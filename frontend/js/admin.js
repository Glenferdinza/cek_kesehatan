const API_BASE = 'http://localhost:3000';

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
  phone: document.getElementById('phone')
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
    }
  }
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
    }
  }
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
    }
  }
});

// Save button - save current data to database
document.getElementById('saveBtn').addEventListener('click', async ()=>{
  const r = await fetch(`${API_BASE}/api/save`, { method: 'POST' });
  const j = await r.json();
  if (j.ok) {
    alert('Data berhasil disimpan!');
  } else {
    alert('Gagal menyimpan data');
  }
});

// Export CSV button
document.getElementById('exportBtn').addEventListener('click', async ()=>{
  const name = inputFields.name.value || 'Data';
  window.location = `${API_BASE}/api/export?name=${encodeURIComponent(name)}`;
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
  } else if (key === 'height') {
    fields.height.textContent = value ? value + ' cm' : '- cm';
  } else if (key === 'sit_and_reach') {
    fields.sit_and_reach.textContent = value ? value + ' cm' : '- cm';
  } else if (key === 'heart_rate') {
    fields.heart_rate.textContent = value ? value + ' bpm' : '- bpm';
  } else if (key === 'calories') {
    fields.calories.textContent = value ? value + ' kcal' : '- kcal';
  } else if (key === 'body_age') {
    fields.body_age.textContent = value || '-';
  } else if (key === 'push_up') {
    fields.push_up.textContent = value ? value + ' kali' : '-';
  } else if (key === 'leg_back') {
    fields.leg_back.textContent = value ? value + ' kg' : '- kg';
  } else if (key === 'handgrip') {
    fields.handgrip.textContent = value ? value + ' kg' : '- kg';
  }
}

// Connect on load
connectSSE();
