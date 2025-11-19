class SensorWebSocket {
  constructor(url = null) {
    if (!url) {
      const hostname = window.location.hostname;
      url = `ws://${hostname}:3001`;
    }
    this.url = url;
    this.ws = null;
    this.reconnectInterval = 3000;
    this.isConnecting = false;
    this.callbacks = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    console.log(`WebSocket will connect to: ${this.url}`);
  }

  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return;
    }
    
    this.isConnecting = true;
    console.log('Connecting to WebSocket...');

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('WebSocket Connected');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'sensor_update' && message.data) {
            this.callbacks.forEach(cb => cb(message.data));
          } else if (message.type === 'init' && message.data) {
            this.callbacks.forEach(cb => cb(message.data));
          }
        } catch (err) {
          console.error('WebSocket parse error:', err);
        }
      };

      this.ws.onclose = () => {
        console.log('WebSocket Disconnected');
        this.isConnecting = false;
        
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
          setTimeout(() => this.connect(), this.reconnectInterval);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
      };
    } catch (err) {
      console.error('WebSocket connection error:', err);
      this.isConnecting = false;
    }
  }

  onData(callback) {
    this.callbacks.push(callback);
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected. Cannot send data.');
    }
  }

  disconnect() {
    if (this.ws) {
      this.reconnectAttempts = this.maxReconnectAttempts;
      this.ws.close();
      this.ws = null;
    }
  }
}

const sensorWS = new SensorWebSocket();
sensorWS.connect();

const fieldElements = {
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

sensorWS.onData((data) => {
  console.log('Sensor data received:', data);
  updateDisplay(data);
});

function updateDisplay(data) {
  if (data.name !== undefined && fieldElements.name) {
    fieldElements.name.textContent = data.name || '-';
  }
  if (data.age !== undefined && fieldElements.age) {
    fieldElements.age.textContent = data.age || '-';
  }
  if (data.phone !== undefined && fieldElements.phone) {
    fieldElements.phone.textContent = data.phone || '-';
  }
  if (data.gender !== undefined && fieldElements.gender) {
    fieldElements.gender.textContent = data.gender || '-';
  }
  if (data.height !== undefined && fieldElements.height) {
    fieldElements.height.textContent = data.height ? `${data.height} cm` : '- cm';
  }
  if (data.sit_and_reach !== undefined && fieldElements.sit_and_reach) {
    fieldElements.sit_and_reach.textContent = data.sit_and_reach ? `${data.sit_and_reach} cm` : '- cm';
  }
  if (data.heart_rate !== undefined && fieldElements.heart_rate) {
    fieldElements.heart_rate.textContent = data.heart_rate ? `${data.heart_rate} bpm` : '- bpm';
  }
  if (data.calories !== undefined && fieldElements.calories) {
    fieldElements.calories.textContent = data.calories ? `${data.calories} kcal` : '- kcal';
  }
  if (data.body_age !== undefined && fieldElements.body_age) {
    fieldElements.body_age.textContent = data.body_age || '-';
  }
  if (data.push_up !== undefined && fieldElements.push_up) {
    fieldElements.push_up.textContent = data.push_up ? `${data.push_up} kali` : '- kali';
  }
  if (data.leg_back !== undefined && fieldElements.leg_back) {
    fieldElements.leg_back.textContent = data.leg_back ? `${data.leg_back} kg` : '- kg';
  }
  if (data.handgrip !== undefined && fieldElements.handgrip) {
    fieldElements.handgrip.textContent = data.handgrip ? `${data.handgrip} kg` : '- kg';
  }
}

window.sensorWS = sensorWS;
