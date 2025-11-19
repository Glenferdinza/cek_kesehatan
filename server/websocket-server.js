const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const os = require('os');
const { Bonjour } = require('bonjour-service');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;
const MDNS_NAME = 'cek-kesehatan-ws';

const server = app.listen(PORT, '0.0.0.0', () => {
  const networkInterfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(networkInterfaces)) {
    for (const net of networkInterfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  
  console.log(`✓ WebSocket Server running on port ${PORT}`);
  console.log(`✓ Local access:`);
  addresses.forEach(addr => {
    console.log(`  http://${addr}:${PORT}`);
    console.log(`  ws://${addr}:${PORT}`);
  });
  
  // Publish mDNS service
  const bonjour = new Bonjour();
  bonjour.publish({
    name: MDNS_NAME,
    type: 'websocket',
    port: PORT,
    txt: {
      service: 'Cek Kesehatan - WebSocket Server',
      path: '/'
    }
  });
  
  console.log(`\n📡 mDNS service published as: ${MDNS_NAME}.local`);
  console.log(`   WebSocket endpoint: ws://${MDNS_NAME}.local:${PORT}\n`);
});

const wss = new WebSocket.Server({ server });

// Store wss instance globally so index.js can access it
global.websocketServer = wss;

const webClients = new Set();
let latestSensorData = null;

wss.on('connection', (ws, req) => {
  const clientIP = req.socket.remoteAddress;
  console.log(`New connection from ${clientIP}`);
  
  webClients.add(ws);

  if (latestSensorData) {
    ws.send(JSON.stringify({
      type: 'init',
      data: latestSensorData
    }));
  }

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      console.log('Data received:', data);

      if (data.sensor_id) {
        latestSensorData = {
          ...latestSensorData,
          ...data
        };

        broadcastToClients({
          type: 'sensor_update',
          data: data
        }, ws);

        ws.send(JSON.stringify({
          status: 'ok',
          timestamp: Date.now()
        }));
      }
    } catch (err) {
      console.error('Parse error:', err);
      ws.send(JSON.stringify({
        status: 'error',
        message: 'Invalid JSON'
      }));
    }
  });

  ws.on('close', () => {
    webClients.delete(ws);
    console.log(`Client disconnected (${webClients.size} remaining)`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    webClients.delete(ws);
  });
});

function broadcastToClients(message, sender) {
  const messageStr = JSON.stringify(message);
  webClients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(messageStr);
    }
  });
}

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    connections: webClients.size,
    latestData: latestSensorData
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
