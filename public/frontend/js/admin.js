const API_BASE = 'http://localhost:3000';

// Get token from URL
const urlParams = new URLSearchParams(window.location.search);
const adminToken = urlParams.get('token');

// Update Data Management link with token
if (adminToken) {
  const dataMgmtLink = document.getElementById('dataMgmt');
  dataMgmtLink.href = `/data-management?token=${adminToken}`;
}

// LocalStorage keys
const STORAGE_KEY = 'cek_kesehatan_current_data';
const SENSOR_FIELDS = ['height', 'sit_and_reach', 'heart_rate', 'calories', 'body_age', 'push_up', 'leg_back', 'handgrip'];
const INFO_FIELDS = ['name', 'age', 'phone', 'gender'];

// Track filled sensors
let filledSensors = new Set();
let isDataSaved = false;

// Custom Alert System for Admin
function showAdminAlert(title, message, type = 'success') {
  const overlay = document.getElementById('adminAlertOverlay');
  const icon = document.getElementById('adminAlertIcon');
  const titleEl = document.getElementById('adminAlertTitle');
  const messageEl = document.getElementById('adminAlertMessage');
  const actionsEl = document.getElementById('adminAlertActions');
  
  icon.className = 'dm-alert-icon ' + type;
  
  let iconSVG = '';
  if (type === 'success') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
  } else if (type === 'warning') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  } else if (type === 'danger') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }
  icon.innerHTML = iconSVG;
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  actionsEl.innerHTML = '<button class="dm-alert-btn dm-alert-btn-primary" onclick="closeAdminAlert()">OK</button>';
  
  overlay.classList.add('show');
}

function showAdminConfirm(title, message, onConfirm, type = 'warning') {
  const overlay = document.getElementById('adminAlertOverlay');
  const icon = document.getElementById('adminAlertIcon');
  const titleEl = document.getElementById('adminAlertTitle');
  const messageEl = document.getElementById('adminAlertMessage');
  const actionsEl = document.getElementById('adminAlertActions');
  
  icon.className = 'dm-alert-icon ' + type;
  
  let iconSVG = '';
  if (type === 'warning') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  } else if (type === 'danger') {
    iconSVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
  }
  icon.innerHTML = iconSVG;
  
  titleEl.textContent = title;
  messageEl.textContent = message;
  
  actionsEl.innerHTML = `
    <button class="dm-alert-btn dm-alert-btn-secondary" onclick="closeAdminAlert()">Batal</button>
    <button class="dm-alert-btn ${type === 'danger' ? 'dm-alert-btn-danger' : 'dm-alert-btn-primary'}" onclick="confirmAdminAction()">Ya, Lanjutkan</button>
  `;
  
  window.adminConfirmCallback = onConfirm;
  overlay.classList.add('show');
}

function closeAdminAlert() {
  document.getElementById('adminAlertOverlay').classList.remove('show');
}

function confirmAdminAction() {
  closeAdminAlert();
  if (window.adminConfirmCallback) {
    window.adminConfirmCallback();
    window.adminConfirmCallback = null;
  }
}

window.closeAdminAlert = closeAdminAlert;
window.confirmAdminAction = confirmAdminAction;

// Sidebar toggle logic
const toggleBtn = document.getElementById('toggleSidebar');
const closeBtn = document.getElementById('closeSidebar');
const adminPanel = document.getElementById('adminPanel');
const displaySection = document.getElementById('displaySection');

// Initialize sidebar state from localStorage
let sidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
if (sidebarHidden) {
  adminPanel.classList.add('hidden');
  displaySection.classList.add('expanded');
  toggleBtn.classList.add('visible');
}

// Toggle button (open sidebar)
toggleBtn.addEventListener('click', () => {
  adminPanel.classList.remove('hidden');
  displaySection.classList.remove('expanded');
  toggleBtn.classList.remove('visible');
  localStorage.setItem('sidebarHidden', 'false');
});

// Close button (close sidebar)
closeBtn.addEventListener('click', () => {
  adminPanel.classList.add('hidden');
  displaySection.classList.add('expanded');
  toggleBtn.classList.add('visible');
  localStorage.setItem('sidebarHidden', 'true');
});

const fields = {
  name: document.getElementById('disp_name'),
  age: document.getElementById('disp_age'),
  phone: document.getElementById('disp_phone'),
  gender: document.getElementById('disp_gender'),
  height: document.getElementById('disp_height'),
  sit_and_reach: document.getElementById('disp_sit_and_reach'),
  heart_rate: document.getElementById('disp_heart_rate'),
  calories: document.getElementById('disp_calories'),
  body_age: document.getElementById('disp_body_age'),
  push_up: document.getElementById('disp_push_up'),
  leg_back: document.getElementById('disp_leg_back'),
  handgrip: document.getElementById('disp_handgrip')
};

const inputFields = {
  name: document.getElementById('name'),
  age: document.getElementById('age'),
  phone: document.getElementById('phone'),
  gender: document.getElementById('gender')
};

// Manual input with Enter key - send to server
inputFields.name.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const value = e.target.value.trim();
    if (value) {
      await fetch(`${API_BASE}/api/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: 'name', value })
      });
      updateProgress();
      saveToLocalStorage();
    }
  }
});

inputFields.name.addEventListener('input', () => {
  updateProgress();
  saveToLocalStorage();
});

inputFields.age.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const value = e.target.value.trim();
    if (value) {
      await fetch(`${API_BASE}/api/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: 'age', value })
      });
      updateProgress();
      saveToLocalStorage();
    }
  }
});

inputFields.age.addEventListener('input', () => {
  updateProgress();
  saveToLocalStorage();
});

inputFields.phone.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const value = e.target.value.trim();
    if (value) {
      await fetch(`${API_BASE}/api/input`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field: 'phone', value })
      });
      updateProgress();
      saveToLocalStorage();
    }
  }
});

inputFields.phone.addEventListener('input', () => {
  updateProgress();
  saveToLocalStorage();
});

// Radio button untuk Jenis Kelamin
const genderRadios = document.querySelectorAll('input[name=\"gender\"]');
genderRadios.forEach(radio => {
  radio.addEventListener('change', async (e) => {
    const value = e.target.value;
    inputFields.gender.value = value;
    await fetch(`${API_BASE}/api/input`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ field: 'gender', value })
    });
    updateProgress();
    saveToLocalStorage();
  });
});

// Button references
const saveBtn = document.getElementById('saveBtn');
const exportBtn = document.getElementById('exportBtn');
const resetBtn = document.getElementById('resetBtn');
const progressCount = document.getElementById('progressCount');
const progressFill = document.getElementById('progressFill');

// LocalStorage functions
function saveToLocalStorage() {
  const data = {
    name: inputFields.name.value,
    age: inputFields.age.value,
    phone: inputFields.phone.value,
    gender: inputFields.gender.value,
    height: fields.height.textContent.replace(' cm', ''),
    sit_and_reach: fields.sit_and_reach.textContent.replace(' cm', ''),
    heart_rate: fields.heart_rate.textContent.replace(' bpm', ''),
    calories: fields.calories.textContent.replace(' kcal', ''),
    body_age: fields.body_age.textContent,
    push_up: fields.push_up.textContent.replace(' kali', ''),
    leg_back: fields.leg_back.textContent.replace(' kg', ''),
    handgrip: fields.handgrip.textContent.replace(' kg', ''),
    timestamp: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadFromLocalStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const data = JSON.parse(stored);
      // Restore form fields
      if (data.name) inputFields.name.value = data.name;
      if (data.age) inputFields.age.value = data.age;
      if (data.phone) inputFields.phone.value = data.phone;
      if (data.gender) {
        inputFields.gender.value = data.gender;
        genderRadios.forEach(r => r.checked = (r.value === data.gender));
      }
      // Restore sensor displays
      Object.keys(data).forEach(key => {
        if (data[key] && data[key] !== '-' && fields[key]) {
          updateField(key, data[key]);
        }
      });
      console.log('Data restored from localStorage');
    } catch (e) {
      console.error('Error loading localStorage:', e);
    }
  }
}

function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
  filledSensors.clear();
  isDataSaved = false;
  updateProgress();
}

// Update progress indicator
function updateProgress() {
  const total = SENSOR_FIELDS.length;
  const filled = filledSensors.size;
  progressCount.textContent = `${filled}/${total}`;
  const percentage = (filled / total) * 100;
  progressFill.style.width = `${percentage}%`;
  
  // Enable save button only if all info fields filled and at least some sensors
  const infoFilled = inputFields.name.value.trim() && 
                     inputFields.age.value && 
                     inputFields.phone.value.trim() && 
                     inputFields.gender.value;
  
  saveBtn.disabled = !(infoFilled && filled >= 4); // Minimum 4 sensors
  
  // Update button text
  if (!infoFilled) {
    saveBtn.title = 'Lengkapi data nama, umur, telpon, dan jenis kelamin';
  } else if (filled < 4) {
    saveBtn.title = 'Minimal 4 sensor harus terdeteksi';
  } else {
    saveBtn.title = 'Klik untuk menyimpan data';
  }
}

// Track sensor updates
function trackSensor(key, value) {
  if (value && value !== '-') {
    filledSensors.add(key);
  } else {
    filledSensors.delete(key);
  }
  updateProgress();
  saveToLocalStorage();
}

// Load saved data on page load
loadFromLocalStorage();
updateProgress();

// Save button - save current data to database
saveBtn.addEventListener('click', async ()=>{
  if (saveBtn.disabled) return;
  
  // Confirm save
  showAdminConfirm(
    'Simpan Data',
    'Simpan data pemeriksaan ini ke database?',
    async () => {
      const r = await fetch(`${API_BASE}/api/save`, { method: 'POST' });
      const j = await r.json();
      if (j.ok) {
        showAdminAlert('Data Tersimpan!', 'Data pemeriksaan berhasil disimpan ke database', 'success');
        isDataSaved = true;
        exportBtn.disabled = false;
        clearLocalStorage();
      } else {
        showAdminAlert('Gagal Menyimpan', 'Terjadi kesalahan saat menyimpan data', 'danger');
      }
    },
    'warning'
  );
});

// Export CSV button
exportBtn.addEventListener('click', async ()=>{
  if (exportBtn.disabled) return;
  
  showAdminConfirm(
    'Download CSV',
    'Download data CSV untuk user ini?',
    () => {
      const name = inputFields.name.value || 'Data';
      window.location = `${API_BASE}/api/export?name=${encodeURIComponent(name)}`;
      
      setTimeout(() => {
        showAdminAlert('Download Berhasil!', 'File CSV berhasil didownload', 'success');
      }, 500);
    },
    'warning'
  );
});

// Reset button - start new data
resetBtn.addEventListener('click', async ()=>{
  showAdminConfirm(
    'Mulai Data Baru',
    'Data saat ini akan dihapus. Pastikan sudah disimpan jika diperlukan.',
    async () => {
      // Clear all fields
      Object.keys(fields).forEach(key => {
        fields[key].textContent = '-';
      });
      inputFields.name.value = '';
      inputFields.age.value = '';
      inputFields.phone.value = '';
      inputFields.gender.value = '';
      genderRadios.forEach(r => r.checked = false);
      
      // Reset state
      clearLocalStorage();
      exportBtn.disabled = true;
      isDataSaved = false;
      
      // Send reset to server
      await fetch(`${API_BASE}/api/reset`, { method: 'POST' });
      
      showAdminAlert('Siap Untuk Data Baru!', 'Form telah direset dan siap untuk pemeriksaan berikutnya', 'success');
    },
    'danger'
  );
});

// SSE connect for realtime sensor data (sensor ID-based: 1-8)
let evtSource = null;
function connectSSE(){
  if (evtSource) evtSource.close();
  const url = API_BASE + '/events';
  evtSource = new EventSource(url);
  evtSource.onmessage = function(e){
    try {
      const msg = JSON.parse(e.data);
      
      // Handle init message with full data
      if (msg.type === 'init' && msg.data) {
        const data = msg.data;
        Object.keys(data).forEach(key => {
          if (data[key] !== null && data[key] !== undefined) {
            updateField(key, data[key]);
          }
        });
        return;
      }
      
      // Handle reset message
      if (msg.type === 'reset') {
        Object.keys(fields).forEach(key => {
          fields[key].textContent = '-';
        });
        inputFields.name.value = '';
        inputFields.age.value = '';
        inputFields.phone.value = '';
        inputFields.gender.value = '';
        genderRadios.forEach(r => r.checked = false);
        // Disable export button on reset (wait for new save)
        exportBtn.disabled = true;
        return;
      }
      
      // Handle field updates
      Object.keys(msg).forEach(key => {
        if (key !== 'type' && msg[key] !== undefined) {
          updateField(key, msg[key]);
        }
      });
    } catch (err) { console.error(err) }
  };
}

function updateField(key, value) {
  if (key === 'name') {
    fields.name.textContent = value || '-';
    inputFields.name.value = value || '';
  } else if (key === 'age') {
    fields.age.textContent = value || '-';
    inputFields.age.value = value || '';
  } else if (key === 'phone') {
    fields.phone.textContent = value || '-';
    inputFields.phone.value = value || '';
  } else if (key === 'gender') {
    fields.gender.textContent = value || '-';
    inputFields.gender.value = value || '';
    // Update radio button selection
    genderRadios.forEach(r => {
      r.checked = (r.value === value);
    });
  } else if (key === 'height') {
    fields.height.textContent = value ? value + ' cm' : '- cm';
    trackSensor('height', value);
  } else if (key === 'sit_and_reach') {
    fields.sit_and_reach.textContent = value ? value + ' cm' : '- cm';
    trackSensor('sit_and_reach', value);
  } else if (key === 'heart_rate') {
    fields.heart_rate.textContent = value ? value + ' bpm' : '- bpm';
    trackSensor('heart_rate', value);
  } else if (key === 'calories') {
    fields.calories.textContent = value ? value + ' kcal' : '- kcal';
    trackSensor('calories', value);
  } else if (key === 'body_age') {
    fields.body_age.textContent = value || '-';
    trackSensor('body_age', value);
  } else if (key === 'push_up') {
    fields.push_up.textContent = value ? value + ' kali' : '-';
    trackSensor('push_up', value);
  } else if (key === 'leg_back') {
    fields.leg_back.textContent = value ? value + ' kg' : '- kg';
    trackSensor('leg_back', value);
  } else if (key === 'handgrip') {
    fields.handgrip.textContent = value ? value + ' kg' : '- kg';
    trackSensor('handgrip', value);
  }
}

// Connect on load
connectSSE();

// Warn before leaving page if data not saved
window.addEventListener('beforeunload', (e) => {
  // Check if there's unsaved data
  const hasData = filledSensors.size > 0 || 
                  inputFields.name.value.trim() || 
                  inputFields.age.value || 
                  inputFields.phone.value.trim();
  
  if (hasData && !isDataSaved) {
    e.preventDefault();
    e.returnValue = 'Data belum disimpan! Yakin ingin keluar?';
    return e.returnValue;
  }
});

// Also connect WebSocket if available for real-time sensor data
if (typeof sensorWS !== 'undefined') {
  sensorWS.onData((data) => {
    // Update display from WebSocket sensor data
    Object.keys(data).forEach(key => {
      if (key !== 'sensor_id' && key !== 'timestamp') {
        updateField(key, data[key]);
      }
    });
  });
}
