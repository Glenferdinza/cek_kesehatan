const API_BASE = 'http://localhost:3000';

let allRecords = [];
let filteredRecords = [];

// Custom Alert System
function showAlert(title, message, type = 'success', actions = null) {
  const modal = document.getElementById('alertModal');
  const icon = document.getElementById('alertIcon');
  const titleEl = document.getElementById('alertTitle');
  const messageEl = document.getElementById('alertMessage');
  const actionsEl = document.getElementById('alertActions');
  
  // Set icon type
  icon.className = 'alert-icon ' + type;
  
  // Change icon based on type
  let iconSVG = '';
  if (type === 'success') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === 'warning') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  } else if (type === 'danger') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }
  icon.innerHTML = iconSVG;
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  // Set actions
  if (actions) {
    actionsEl.innerHTML = actions;
  } else {
    actionsEl.innerHTML = '<button class="alert-btn alert-btn-primary" onclick="closeAlert()">OK</button>';
  }
  
  modal.classList.add('show');
}

function closeAlert() {
  document.getElementById('alertModal').classList.remove('show');
}

function showConfirm(title, message, onConfirm, type = 'warning') {
  const actions = `
    <button class="alert-btn alert-btn-secondary" onclick="closeAlert()">Batal</button>
    <button class="alert-btn ${type === 'danger' ? 'alert-btn-danger' : 'alert-btn-primary'}" onclick="confirmAction()">Ya, Lanjutkan</button>
  `;
  
  window.confirmCallback = onConfirm;
  showAlert(title, message, type, actions);
}

function confirmAction() {
  closeAlert();
  if (window.confirmCallback) {
    window.confirmCallback();
    window.confirmCallback = null;
  }
}

// Make functions global
window.showAlert = showAlert;
window.closeAlert = closeAlert;
window.showConfirm = showConfirm;
window.confirmAction = confirmAction;

// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const adminToken = urlParams.get('token');

// Update back to admin link with token
if (adminToken) {
  const backLink = document.getElementById('backToAdmin');
  if (backLink) {
    backLink.href = `/admin?token=${adminToken}`;
  }
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();
  
  if (!query) {
    filteredRecords = allRecords;
  } else {
    filteredRecords = allRecords.filter(rec => {
      return (
        (rec.name && rec.name.toLowerCase().includes(query)) ||
        (rec.age && String(rec.age).includes(query)) ||
        (rec.phone && rec.phone.toLowerCase().includes(query)) ||
        (rec.gender && rec.gender.toLowerCase().includes(query))
      );
    });
  }
  
  renderTable();
});

// Gender filter
document.getElementById('genderFilter').addEventListener('change', (e) => {
  const gender = e.target.value;
  
  if (!gender) {
    filteredRecords = allRecords;
  } else {
    filteredRecords = allRecords.filter(rec => rec.gender === gender);
  }
  
  renderTable();
});

// Update records count
function updateRecordsCount() {
  const total = allRecords.length;
  const shown = filteredRecords.length;
  const countEl = document.getElementById('totalRecords');
  
  if (countEl) {
    countEl.textContent = total;
  }
}

// Download CSV button
document.getElementById('downloadBtn').addEventListener('click', () => {
  if (allRecords.length === 0) {
    showAlert(
      'No Data',
      'No data available to download',
      'warning'
    );
    return;
  }
  
  downloadCSV(allRecords, `Health_Data_Export_${new Date().toISOString().split('T')[0]}.csv`);
  showAlert(
    'Download Successful',
    `${allRecords.length} records exported`,
    'success'
  );
});

// Delete selected button
document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
  const selected = Array.from(document.querySelectorAll('.dm-checkbox:checked'))
    .filter(cb => cb.id !== 'selectAll')
    .map(cb => cb.dataset.id);
    
  if (selected.length === 0) {
    showAlert(
      'No Selection',
      'Please select records to delete',
      'warning'
    );
    return;
  }
  
  showConfirm(
    'Delete Selected Records?',
    `You are about to delete ${selected.length} record(s). This action cannot be undone.`,
    async () => {
      for (const id of selected) {
        await fetch(`${API_BASE}/api/records/${id}`, { method: 'DELETE' });
      }
      
      showAlert(
        'Deleted Successfully',
        `${selected.length} record(s) deleted`,
        'success'
      );
      loadRecords();
    },
    'danger'
  );
});

// Load all records
async function loadRecords() {
  try {
    const res = await fetch(`${API_BASE}/api/records?limit=1000`);
    const data = await res.json();
    allRecords = data.records || [];
    filteredRecords = allRecords;
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = ''; // Reset search
    renderTable();
  } catch (err) {
    console.error(err);
    document.getElementById('recordsBody').innerHTML = '<tr><td colspan="15" class="no-data">Gagal memuat data</td></tr>';
    updateRecordsCount();
  }
}

// Format timestamp to local time
function formatTimestamp(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Render table
function renderTable() {
  const tbody = document.getElementById('recordsBody');
  
  if (filteredRecords.length === 0) {
    if (allRecords.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="15" style="padding:0;">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              </div>
              <div class="empty-state-text">Belum ada data tersimpan</div>
              <div class="empty-state-subtext">Data yang disimpan akan muncul di sini</div>
            </div>
          </td>
        </tr>`;
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="15" style="padding:0;">
            <div class="empty-state">
              <div class="empty-state-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </div>
              <div class="empty-state-text">Tidak ada hasil ditemukan</div>
              <div class="empty-state-subtext">Coba kata kunci pencarian lain</div>
            </div>
          </td>
        </tr>`;
    }
    updateRecordsCount();
    return;
  }

  tbody.innerHTML = '';
  filteredRecords.forEach(rec => {
    const formattedTime = formatTimestamp(rec.saved_at);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="freeze-check"><input type="checkbox" class="dm-checkbox" data-id="${rec.session_id}"></td>
      <td class="freeze-name" title="${rec.name || '-'}">
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);display:flex;align-items:center;justify-content:center;color:white;font-weight:600;font-size:14px;">
            ${(rec.name || '?').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:500;color:#1e293b;">${rec.name || '-'}</div>
            <div style="font-size:12px;color:#94a3b8;">${rec.phone || '-'}</div>
          </div>
        </div>
      </td>
      <td>${rec.age || '-'}</td>
      <td>${rec.gender || '-'}</td>
      <td>${rec.phone || '-'}</td>
      <td>${rec.height || '-'}</td>
      <td>${rec.sit_and_reach || '-'}</td>
      <td>${rec.heart_rate || '-'}</td>
      <td>${rec.calories || '-'}</td>
      <td>${rec.body_age || '-'}</td>
      <td>${rec.push_up || '-'}</td>
      <td>${rec.leg_back || '-'}</td>
      <td>${rec.handgrip || '-'}</td>
      <td title="${formattedTime}">${formattedTime}</td>
      <td>
        <div style="display:flex;gap:6px;justify-content:center;">
          <button class="dm-action-btn" onclick="editRecord('${rec.session_id}')" title="Edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button class="dm-action-btn dm-action-delete" onclick="deleteRecord('${rec.session_id}')" title="Delete">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
  
  updateRecordsCount();
}

// Select all checkbox
document.getElementById('selectAll').addEventListener('change', (e) => {
  const checkboxes = document.querySelectorAll('.dm-checkbox:not(#selectAll)');
  checkboxes.forEach(cb => cb.checked = e.target.checked);
});



// CSV Download helper
function downloadCSV(records, filename) {
  const headers = ['Timestamp','Nama','Umur','Nomor Telepon','Jenis Kelamin','Tinggi Badan','Sit and Reach','Heart Rate','Kebutuhan Kalori','Body Age','Push Up','Leg and Back Dynamometer','Handgrip Dynamometer'];
  const csvRows = [headers.join(',')];
  
  records.forEach(r => {
    const cols = [r.saved_at, r.name, r.age, r.phone, r.gender, r.height, r.sit_and_reach, r.heart_rate, r.calories, r.body_age, r.push_up, r.leg_back, r.handgrip];
    const esc = cols.map(c => `"${String(c || '').replace(/"/g,'""')}"`);
    csvRows.push(esc.join(','));
  });
  
  const csv = csvRows.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Delete single record
window.deleteRecord = (id) => {
  showConfirm(
    'Hapus Data Ini?',
    'Data yang dihapus tidak dapat dikembalikan',
    async () => {
      await fetch(`${API_BASE}/api/records/${id}`, { method: 'DELETE' });
      showAlert('Data Berhasil Dihapus', 'Data telah dihapus dari sistem', 'success');
      loadRecords();
    },
    'danger'
  );
};

// Edit record
window.editRecord = (id) => {
  const rec = allRecords.find(r => r.session_id === id);
  if (!rec) return;
  
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = rec.name || '';
  document.getElementById('editAge').value = rec.age || '';
  document.getElementById('editPhone').value = rec.phone || '';
  document.getElementById('editGender').value = rec.gender || '';
  document.getElementById('editHeight').value = rec.height || '';
  document.getElementById('editSit').value = rec.sit_and_reach || '';
  document.getElementById('editHr').value = rec.heart_rate || '';
  document.getElementById('editCal').value = rec.calories || '';
  document.getElementById('editBodyAge').value = rec.body_age || '';
  document.getElementById('editPush').value = rec.push_up || '';
  document.getElementById('editLeg').value = rec.leg_back || '';
  document.getElementById('editHandgrip').value = rec.handgrip || '';
  
  document.getElementById('editModal').classList.add('active');
};

// Cancel edit
document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('editModal').classList.remove('active');
});

// Save edit
document.getElementById('editForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // Validasi tambahan
  const name = document.getElementById('editName').value.trim();
  const age = parseInt(document.getElementById('editAge').value);
  const phone = document.getElementById('editPhone').value.trim();
  const gender = document.getElementById('editGender').value;
  
  if (name.length < 2) {
    showAlert('Validasi Gagal', 'Nama harus minimal 2 karakter', 'warning');
    return;
  }
  
  if (age < 1 || age > 150) {
    showAlert('Validasi Gagal', 'Umur harus antara 1-150 tahun', 'warning');
    return;
  }
  
  if (!phone.match(/^[0-9+\-\s()]+$/)) {
    showAlert('Validasi Gagal', 'Nomor telepon hanya boleh berisi angka, +, -, (, ), dan spasi', 'warning');
    return;
  }
  
  if (!gender || (gender !== 'Laki-laki' && gender !== 'Perempuan')) {
    showAlert('Validasi Gagal', 'Pilih jenis kelamin yang valid', 'warning');
    return;
  }
  
  const id = document.getElementById('editId').value;
  const data = {
    name: name,
    age: age,
    phone: phone,
    gender: gender,
    height: document.getElementById('editHeight').value,
    sit_and_reach: document.getElementById('editSit').value,
    heart_rate: document.getElementById('editHr').value,
    calories: document.getElementById('editCal').value,
    body_age: document.getElementById('editBodyAge').value,
    push_up: document.getElementById('editPush').value,
    leg_back: document.getElementById('editLeg').value,
    handgrip: document.getElementById('editHandgrip').value
  };
  
  try {
    const res = await fetch(`${API_BASE}/api/records/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (res.ok) {
      showAlert('Data Berhasil Diupdate', 'Perubahan data telah disimpan', 'success');
      document.getElementById('editModal').classList.remove('active');
      loadRecords();
    } else {
      showAlert('Gagal Update Data', 'Terjadi kesalahan saat menyimpan data', 'danger');
    }
  } catch (err) {
    console.error(err);
    showAlert('Terjadi Kesalahan', 'Tidak dapat terhubung ke server', 'danger');
  }
});

// Load on page load
loadRecords();

// WebSocket connection for realtime updates
let ws = null;
function connectWebSocket() {
  const hostname = window.location.hostname;
  const wsUrl = `ws://${hostname}:3001`;
  
  ws = new WebSocket(wsUrl);
  
  ws.onopen = () => {
    console.log('WebSocket connected for data management');
  };
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      // When we receive 'data_saved' event, reload records
      if (data.type === 'data_saved' || data.event === 'data_saved') {
        console.log('New data saved, reloading records...');
        loadRecords();
      }
    } catch (err) {
      console.error('WebSocket message error:', err);
    }
  };
  
  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  ws.onclose = () => {
    console.log('WebSocket disconnected, reconnecting in 3s...');
    setTimeout(connectWebSocket, 3000);
  };
}

connectWebSocket();
