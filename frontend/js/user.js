const API_BASE = 'http://localhost:3000'; // change if server host differs

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
  if (!fields[key]) return;
  
  if (key === 'name' || key === 'age' || key === 'phone' || key === 'gender') {
    fields[key].textContent = value || '-';
  } else if (key === 'height' || key === 'sit_and_reach') {
    fields[key].textContent = value ? value + ' cm' : '- cm';
  } else if (key === 'heart_rate') {
    fields[key].textContent = value ? value + ' bpm' : '- bpm';
  } else if (key === 'calories') {
    fields[key].textContent = value ? value + ' kcal' : '- kcal';
  } else if (key === 'body_age') {
    fields[key].textContent = value || '-';
  } else if (key === 'push_up') {
    fields[key].textContent = value ? value + ' kali' : '-';
  } else if (key === 'leg_back' || key === 'handgrip') {
    fields[key].textContent = value ? value + ' kg' : '- kg';
  }
}

// Connect on load
connectSSE();

// Browser console helper function for admin access - WITH TOKEN
window.accessadmin = async function() {
  try {
    const res = await fetch(API_BASE + '/api/admin-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: 'accessadmin' })
    });
    
    const data = await res.json();
    
    if (data.ok) {
      console.log('✅ Token generated! Redirecting to admin...');
      window.location.href = data.url;
    } else {
      console.error('❌ Access denied!');
    }
  } catch (err) {
    console.error('❌ Error:', err);
  }
};


