const express = require('express');
const cors = require('cors');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('./db');
const { Bonjour } = require('bonjour-service');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MDNS_NAME = 'cek-kesehatan';

// serve frontend static assets (CSS/JS/images)
app.use('/frontend', express.static(path.join(__dirname, '..', 'frontend')));

// In-memory current data (single active session)
let currentData = {
  name: null,
  age: null,
  phone: null,
  gender: null,
  height: null,
  sit_and_reach: null,
  heart_rate: null,
  calories: null,
  body_age: null,
  push_up: null,
  leg_back: null,
  handgrip: null
};

// In-memory list of SSE clients
const clients = new Set();

// Admin token storage (with expiry)
const adminTokens = new Map(); // token -> expiry timestamp

// Sensor ID mapping: ESP32 sends ID 1-8
const SENSOR_MAP = {
  1: 'height',
  2: 'sit_and_reach',
  3: 'heart_rate',
  4: 'calories',
  5: 'body_age',
  6: 'push_up',
  7: 'leg_back',
  8: 'handgrip'
};

// Additional fields
const INFO_MAP = {
  name: 'name',
  age: 'age',
  phone: 'phone',
  gender: 'gender'
};

// helper to broadcast updates to SSE clients
function broadcast(payload) {
  clients.forEach(res => {
    try { res.write(`data: ${JSON.stringify(payload)}\n\n`); } catch (e) { /* ignore */ }
  });
}

// Input sensor data by ID (1-8) or info field (name/age/phone)
app.post('/api/input', (req, res) => {
  const { id, field, value } = req.body;
  
  // Handle sensor ID (1-8)
  if (id && SENSOR_MAP[id]) {
    const key = SENSOR_MAP[id];
    currentData[key] = String(value);
    broadcast({ [key]: String(value) });
    return res.json({ ok: true });
  }
  
  // Handle info fields (name/age/phone)
  if (field && INFO_MAP[field]) {
    currentData[field] = value;
    broadcast({ [field]: value });
    return res.json({ ok: true });
  }
  
  return res.status(400).json({ ok: false, error: 'invalid id or field' });
});

// Utility: Get GMT+7 formatted timestamp
function getGMT7Timestamp() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const gmt7 = new Date(utc + (7 * 3600000));
  return gmt7.toISOString().replace('T', ' ').substring(0, 19);
}

// Save current data to database (called when complete)
async function saveToDatabase() {
  try {
    const id = uuidv4();
    const timestamp = getGMT7Timestamp();
    await pool.query(
      `INSERT INTO records (session_id, name, age, phone, gender, height, sit_and_reach, heart_rate, calories, body_age, push_up, leg_back, handgrip, saved_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        currentData.name || '',
        currentData.age || null,
        currentData.phone || '',
        currentData.gender || '',
        currentData.height || '',
        currentData.sit_and_reach || '',
        currentData.heart_rate || '',
        currentData.calories || '',
        currentData.body_age || '',
        currentData.push_up || '',
        currentData.leg_back || '',
        currentData.handgrip || '',
        timestamp
      ]
    );
    broadcast({ type: 'saved', timestamp });
    // Reset current data after save
    Object.keys(currentData).forEach(k => currentData[k] = null);
    broadcast({ type: 'reset' });
  } catch (err) {
    console.error('Save error:', err);
  }
}

// Get current data
app.get('/api/current', (req, res) => {
  return res.json({ ok: true, data: currentData });
});

// Get all records
app.get('/api/records', async (req, res) => {
  const limit = parseInt(req.query.limit || '100', 10);
  const [rows] = await pool.query('SELECT * FROM records ORDER BY saved_at DESC LIMIT ?', [limit]);
  return res.json({ ok: true, records: rows });
});

// Save current session manually (admin button)
app.post('/api/save', async (req, res) => {
  await saveToDatabase();
  
  // Broadcast to WebSocket clients that data was saved
  const WebSocket = require('ws');
  const wss = global.websocketServer;
  if (wss) {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ 
          type: 'data_saved',
          event: 'data_saved',
          timestamp: new Date().toISOString()
        }));
      }
    });
  }
  
  return res.json({ ok: true });
});

// Reset current data (start new measurement)
app.post('/api/reset', async (req, res) => {
  // Clear current data
  Object.keys(currentData).forEach(k => currentData[k] = null);
  broadcast({ type: 'reset' });
  return res.json({ ok: true });
});

// Export CSV with custom filename
app.get('/api/export', async (req, res) => {
  const name = req.query.name || 'Export';
  const filename = `${name.replace(/\s+/g, '_')}_Cek-Kesehatan.csv`;
  
  const [rows] = await pool.query('SELECT * FROM records ORDER BY saved_at DESC');
  const headers = ['Nama','Umur','Nomor Telepon','Jenis Kelamin','Tinggi Badan','Sit and Reach','Heart Rate','Kebutuhan Kalori','Body Age','Push Up','Leg and Back Dynamometer','Handgrip Dynamometer','Timestamp'];
  const csvRows = [headers.join(',')];
  rows.forEach(r => {
    const cols = [r.name, r.age, r.phone, r.gender, r.height, r.sit_and_reach, r.heart_rate, r.calories, r.body_age, r.push_up, r.leg_back, r.handgrip, r.saved_at];
    const esc = cols.map(c => `"${String(c).replace(/"/g,'""')}"`);
    csvRows.push(esc.join(','));
  });
  const csv = csvRows.join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csv);
});

// Delete record
app.delete('/api/records/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM records WHERE session_id = ?', [req.params.id]);
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'db error' });
  }
});

// Update record
app.put('/api/records/:id', async (req, res) => {
  const { name, age, phone, gender, height, sit_and_reach, heart_rate, calories, body_age, push_up, leg_back, handgrip } = req.body;
  try {
    await pool.query(
      `UPDATE records SET name=?, age=?, phone=?, gender=?, height=?, sit_and_reach=?, heart_rate=?, calories=?, body_age=?, push_up=?, leg_back=?, handgrip=? WHERE session_id=?`,
      [name, age, phone, gender, height, sit_and_reach, heart_rate, calories, body_age, push_up, leg_back, handgrip, req.params.id]
    );
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'db error' });
  }
});

// SSE endpoint - broadcasts realtime updates
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current data immediately
  res.write(`data: ${JSON.stringify({ type: 'init', data: currentData })}\n\n`);

  clients.add(res);

  req.on('close', () => {
    clients.delete(res);
  });
});

// Browser console admin access endpoint - generates token with 10 min expiry
app.post('/api/admin-access', (req, res) => {
  const { secret } = req.body;
  if (secret === 'accessadmin') {
    const token = uuidv4();
    const expiry = Date.now() + (10 * 60 * 1000); // 10 minutes
    adminTokens.set(token, expiry);
    
    // Clean up expired tokens
    for (const [t, exp] of adminTokens.entries()) {
      if (Date.now() > exp) adminTokens.delete(t);
    }
    
    return res.json({ ok: true, token, url: `/admin?token=${token}` });
  }
  return res.status(403).json({ ok: false, error: 'Invalid secret' });
});

// Admin token validation middleware
function adminAuth(req, res, next) {
  const token = req.query.token;
  
  if (!token) {
    return res.status(403).send(`
      <html>
        <head><title>Access Denied</title></head>
        <body style="font-family: Arial; text-align: center; padding: 100px; background: #1e293b; color: white;">
          <h1 style="color: #ef4444;">🚫 Access Denied</h1>
          <p style="font-size: 18px; margin: 20px 0;">You need a valid token to access admin panel.</p>
          <p style="color: #94a3b8;">Open browser console (F12) and type: <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #60a5fa;">accessadmin()</code></p>
        </body>
      </html>
    `);
  }
  
  const expiry = adminTokens.get(token);
  
  if (!expiry) {
    return res.status(403).send(`
      <html>
        <head><title>Access Denied</title></head>
        <body style="font-family: Arial; text-align: center; padding: 100px; background: #1e293b; color: white;">
          <h1 style="color: #ef4444;">🚫 Invalid Token</h1>
          <p style="font-size: 18px; margin: 20px 0;">Your token is invalid.</p>
          <p style="color: #94a3b8;">Open browser console (F12) and type: <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #60a5fa;">accessadmin()</code></p>
        </body>
      </html>
    `);
  }
  
  if (Date.now() > expiry) {
    adminTokens.delete(token);
    return res.status(403).send(`
      <html>
        <head><title>Access Denied</title></head>
        <body style="font-family: Arial; text-align: center; padding: 100px; background: #1e293b; color: white;">
          <h1 style="color: #f59e0b;">⏰ Token Expired</h1>
          <p style="font-size: 18px; margin: 20px 0;">Your token has expired (10 minutes limit).</p>
          <p style="color: #94a3b8;">Open browser console (F12) and type: <code style="background: #0f172a; padding: 4px 8px; border-radius: 4px; color: #60a5fa;">accessadmin()</code></p>
        </body>
      </html>
    `);
  }
  
  next();
}

// Serve user UI at / (user-only page) - now at root/user.html
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'user.html'));
});

// Admin UI - TOKEN REQUIRED (10 min expiry)
app.get('/admin', adminAuth, (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'admin.html'));
});

// Data Management UI - TOKEN REQUIRED
app.get('/data-management', adminAuth, (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'data-management.html'));
});

// ESP32 Simulator (for testing)
app.get('/simulator', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'esp32-simulator.html'));
});

// DEBUG Sensor Simulator (realtime simulation)
app.get('/debug', (req, res) => {
  return res.sendFile(path.join(__dirname, '..', 'debug-sensor.html'));
});

app.listen(PORT, () => {
  console.log(`✓ HTTP Server running on port ${PORT}`);
  console.log(`✓ Access via: http://localhost:${PORT}`);
  console.log(`✓ mDNS: http://${MDNS_NAME}.local:${PORT}`);
  
  // Publish mDNS service
  const bonjour = new Bonjour();
  bonjour.publish({
    name: MDNS_NAME,
    type: 'http',
    port: PORT,
    txt: {
      service: 'Cek Kesehatan - Health Monitoring System'
    }
  });
  
  console.log(`\n📡 mDNS service published as: ${MDNS_NAME}.local`);
  console.log(`   You can access the app using: http://${MDNS_NAME}.local:${PORT}\n`);
});
