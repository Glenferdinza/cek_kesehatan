const API_BASE = 'http://localhost:3000'; // change if server host differs
let currentSessionId = null;

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

const startForm = document.getElementById('startForm');
startForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = { name: document.getElementById('name').value, age: parseInt(document.getElementById('age').value,10), phone: document.getElementById('phone').value };
  const r = await fetch(API_BASE + '/api/start_session', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});
  const j = await r.json();
  if (j.ok) {
    currentSessionId = j.session_id;
    // redirect to admin display (same page). show session id in console
    console.log('session', currentSessionId);
    // update fields immediately
    fields.name.textContent = payload.name;
    fields.age.textContent = payload.age;
    fields.phone.textContent = payload.phone;
    connectSSE();
  } else alert('error');
});

document.getElementById('exportBtn').addEventListener('click', ()=>{ window.location = API_BASE + '/api/export?all=1' });

// Data management modal
document.getElementById('dataMgmt').addEventListener('click', async (e)=>{
  e.preventDefault();
  const modal = document.getElementById('dataModal'); modal.classList.remove('hidden');
  const tbody = document.querySelector('#recordsTable tbody'); tbody.innerHTML = '';
  const r = await fetch(API_BASE + '/api/records?limit=200');
  const j = await r.json();
  (j.records||[]).forEach(rec=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${rec.saved_at}</td><td>${rec.name}</td><td>${rec.age}</td><td>${rec.phone}</td><td>${rec.height}</td><td>${rec.sit_and_reach}</td><td>${rec.heart_rate}</td><td>${rec.calories}</td><td>${rec.body_age}</td><td>${rec.push_up}</td><td>${rec.leg_back}</td><td>${rec.handgrip}</td>`;
    tbody.appendChild(tr);
  });
});
document.getElementById('closeModal').addEventListener('click', ()=>{ document.getElementById('dataModal').classList.add('hidden'); });
document.getElementById('exportModal').addEventListener('click', ()=>{ window.location = API_BASE + '/api/export?all=1' });

// SSE connect
let evtSource = null;
function connectSSE(){
  if (evtSource) evtSource.close();
  const url = API_BASE + '/events?session_id=' + (currentSessionId || 'global');
  evtSource = new EventSource(url);
  evtSource.onmessage = function(e){
    try {
      const payload = JSON.parse(e.data);
      if (payload.type === 'update' || payload.type === 'session_started' || payload.type === 'complete') {
        const s = payload.session;
        if (!s) return;
        fields.name.textContent = s.name || '-';
        fields.age.textContent = s.age || '-';
        fields.phone.textContent = s.phone || '-';
        fields.height.textContent = (s.height? s.height + ' cm' : '- cm');
        fields.sit_and_reach.textContent = (s.sit_and_reach? s.sit_and_reach + ' kg' : '-');
        fields.heart_rate.textContent = (s.heart_rate? s.heart_rate + ' bpm' : '- bpm');
        fields.calories.textContent = (s.calories? s.calories + ' kcal' : '- kcal');
        fields.body_age.textContent = (s.body_age? s.body_age : '-');
        fields.push_up.textContent = (s.push_up? s.push_up + ' kali' : '-');
        fields.leg_back.textContent = (s.leg_back? s.leg_back + ' kg' : '-');
        fields.handgrip.textContent = (s.handgrip? s.handgrip + ' kg' : '-');
      }
    } catch (err) { console.error(err) }
  };
}

// Try to get current session on load
(async ()=>{
  try{
    const r = await fetch(API_BASE + '/api/current');
    const j = await r.json();
    if (j.session) { currentSessionId = j.session.id; connectSSE(); }
  }catch(e){console.warn('could not connect to server')}
})();

/* Example ESP32 sequence (for reference):
1) POST /api/start_session  {name,age,phone} -> get session_id
2) For each sensor in order POST /api/input {session_id, sensor: 'height', value: '175'}
   sensor keys: height, sit_and_reach, heart_rate, calories, body_age, push_up, leg_back, handgrip
*/
