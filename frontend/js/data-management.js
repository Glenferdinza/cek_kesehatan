const API_BASE = 'http://localhost:3000';

let allRecords = [];

// Load all records
async function loadRecords() {
  try {
    const res = await fetch(`${API_BASE}/api/records?limit=1000`);
    const data = await res.json();
    allRecords = data.records || [];
    renderTable();
  } catch (err) {
    console.error(err);
    document.getElementById('recordsBody').innerHTML = '<tr><td colspan="14" class="no-data">Gagal memuat data</td></tr>';
  }
}

// Render table
function renderTable() {
  const tbody = document.getElementById('recordsBody');
  if (allRecords.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" class="no-data">Tidak ada data</td></tr>';
    return;
  }

  tbody.innerHTML = '';
  allRecords.forEach(rec => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="checkbox-col"><input type="checkbox" class="row-checkbox" data-id="${rec.session_id}"></td>
      <td>${rec.saved_at || '-'}</td>
      <td>${rec.name || '-'}</td>
      <td>${rec.age || '-'}</td>
      <td>${rec.phone || '-'}</td>
      <td>${rec.height || '-'}</td>
      <td>${rec.sit_and_reach || '-'}</td>
      <td>${rec.heart_rate || '-'}</td>
      <td>${rec.calories || '-'}</td>
      <td>${rec.body_age || '-'}</td>
      <td>${rec.push_up || '-'}</td>
      <td>${rec.leg_back || '-'}</td>
      <td>${rec.handgrip || '-'}</td>
      <td class="actions-col">
        <button class="btn-edit" onclick="editRecord('${rec.session_id}')">Edit</button>
        <button class="btn-delete" onclick="deleteRecord('${rec.session_id}')">Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Select all checkbox
document.getElementById('selectAll').addEventListener('change', (e) => {
  const checkboxes = document.querySelectorAll('.row-checkbox');
  checkboxes.forEach(cb => cb.checked = e.target.checked);
});

// Delete selected
document.getElementById('deleteSelected').addEventListener('click', async () => {
  const selected = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.dataset.id);
  if (selected.length === 0) {
    alert('Pilih data yang akan dihapus');
    return;
  }
  
  if (!confirm(`Hapus ${selected.length} data?`)) return;
  
  for (const id of selected) {
    await fetch(`${API_BASE}/api/records/${id}`, { method: 'DELETE' });
  }
  
  alert('Data berhasil dihapus');
  loadRecords();
});

// Download selected
document.getElementById('downloadSelected').addEventListener('click', () => {
  const selected = Array.from(document.querySelectorAll('.row-checkbox:checked')).map(cb => cb.dataset.id);
  if (selected.length === 0) {
    alert('Pilih data yang akan didownload');
    return;
  }
  
  const selectedRecords = allRecords.filter(r => selected.includes(r.session_id));
  downloadCSV(selectedRecords, 'Selected_Data_Cek-Kesehatan.csv');
});

// Download all
document.getElementById('downloadAll').addEventListener('click', () => {
  downloadCSV(allRecords, 'All_Data_Cek-Kesehatan.csv');
});

// CSV Download helper
function downloadCSV(records, filename) {
  const headers = ['Timestamp','Nama','Umur','Nomor Telepon','Tinggi Badan','Sit and Reach','Heart Rate','Kebutuhan Kalori','Body Age','Push Up','Leg and Back Dynamometer','Handgrip Dynamometer'];
  const csvRows = [headers.join(',')];
  
  records.forEach(r => {
    const cols = [r.saved_at, r.name, r.age, r.phone, r.height, r.sit_and_reach, r.heart_rate, r.calories, r.body_age, r.push_up, r.leg_back, r.handgrip];
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
window.deleteRecord = async (id) => {
  if (!confirm('Hapus data ini?')) return;
  
  await fetch(`${API_BASE}/api/records/${id}`, { method: 'DELETE' });
  alert('Data berhasil dihapus');
  loadRecords();
};

// Edit record
window.editRecord = (id) => {
  const rec = allRecords.find(r => r.session_id === id);
  if (!rec) return;
  
  document.getElementById('editId').value = id;
  document.getElementById('editName').value = rec.name || '';
  document.getElementById('editAge').value = rec.age || '';
  document.getElementById('editPhone').value = rec.phone || '';
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
  
  const id = document.getElementById('editId').value;
  const data = {
    name: document.getElementById('editName').value,
    age: document.getElementById('editAge').value,
    phone: document.getElementById('editPhone').value,
    height: document.getElementById('editHeight').value,
    sit_and_reach: document.getElementById('editSit').value,
    heart_rate: document.getElementById('editHr').value,
    calories: document.getElementById('editCal').value,
    body_age: document.getElementById('editBodyAge').value,
    push_up: document.getElementById('editPush').value,
    leg_back: document.getElementById('editLeg').value,
    handgrip: document.getElementById('editHandgrip').value
  };
  
  await fetch(`${API_BASE}/api/records/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  alert('Data berhasil diupdate');
  document.getElementById('editModal').classList.remove('active');
  loadRecords();
});

// Load on page load
loadRecords();
