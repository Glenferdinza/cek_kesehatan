# Deksripsi Singkat

Website monitoring kesehatan realtime yang terintegrasi dengan ESP32 untuk mengukur berbagai parameter kesehatan seperti tinggi badan, sit and reach, detak jantung, kalori, usia tubuh, push up, kekuatan kaki & punggung, dan kekuatan genggaman tangan.

## Admin Panel

Admin panel memungkinkan petugas kesehatan untuk:

- Input data pasien (nama, umur, nomor telepon) secara manual dengan tombol Enter

- Menerima data sensor secara realtime dari ESP32 (ID 1-8)## Admin PanelWebsite monitoring kesehatan realtime untuk menampilkan data sensor dari ESP32/NodeMCU. Sistem ini memiliki dua role: Admin dan User, dengan fitur manajemen data lengkap.

- Menyimpan hasil pemeriksaan ke database

- Export data ke format CSV

- Mengelola data (CRUD operations) melalui halaman Data Management

- Debug mode untuk simulasi sensor realtimeAdmin panel memungkinkan petugas kesehatan untuk:

Akses admin dilindungi dengan token yang berlaku selama 10 menit. Untuk mendapatkan akses admin, buka halaman User dan ketik `accessadmin()` di browser console.- Input data pasien (nama, umur, nomor telepon) secara manual dengan tombol Enter

## User Panel

- Menerima data sensor secara realtime dari ESP32 (ID 1-8)## Admin PanelWebsite realtime untuk menampilkan data sensor kesehatan dari ESP32 dengan 2 role: **Admin** dan **User**. Simple realtime web app to display sensor data from an ESP32 (NodeMCU) with two roles: admin and user.

User panel menampilkan:

- Menyimpan hasil pemeriksaan ke database

- Monitor realtime semua parameter kesehatan

- Update otomatis saat sensor mengirim data baru- Export data ke format CSV

- Tampilan yang clean dengan tema blue & white

- 8 jenis pengukuran kesehatan secara simultan

- Mengelola data (CRUD operations) melalui halaman Data Management



## Instalasi dan Running

- Debug mode untuk simulasi sensor realtime

Admin panel memungkinkan pengelolaan data kesehatan secara realtime:

1. **Install dependencies**

   ```bash

   npm installAkses admin dilindungi dengan token yang berlaku selama 10 menit. Untuk mendapatkan akses admin, buka halaman User dan ketik `accessadmin()` di browser console.

   ```



2. **Setup database MySQL**

   - Buka phpMyAdmin di Laragon## User Panel- Input data peserta (nama, umur, nomor telepon)
   
   ## Fitur UtamaStructure

   - Import file `sql/schema.sql`

   - Atau buat database manual dengan nama `cek_kesehatan`



3. **Konfigurasi database**User panel menampilkan:

   - Monitoring 8 sensor kesehatan secara realtime

   - Edit file `server/db.js` jika perlu (default: host=localhost, user=root, password=asya2105)

   - Monitor realtime semua parameter kesehatan

4. **Jalankan server**

   ```bash- Update otomatis saat sensor mengirim data baru- Simpan data ke database dengan timestamp GMT+7- `frontend/` - static files (index.html, css, js)

   node server/index.js

   ```- Tampilan yang clean dengan tema blue & white



5. **Akses website**- 8 jenis pengukuran kesehatan secara simultan- Export data ke CSV dengan format custom

   - User Panel: `http://localhost:3000/user`

   - Admin Panel: Ketik `accessadmin()` di console User Panel

   - Debug Mode: `http://localhost:3000/debug`

## Instalasi dan Running- Data Management dengan fitur CRUD lengkap### Admin Panel- `server/` - Node.js Express backend

## Created by

**Glenferdinza & Rafli**

1. **Install dependencies**

## License

   ```bash

MIT License

   npm installAkses admin dilindungi dengan token yang expire dalam 10 menit. Untuk mengakses, buka console browser dan ketik `accessadmin()`.-  Input data peserta (nama, umur, nomor telepon) - **otomatis terisi**- `sql/schema.sql` - database schema

   ```



2. **Setup database MySQL**

   - Buka phpMyAdmin di Laragon## User Panel-  Monitoring realtime 8 sensor kesehatan

   - Import file `sql/schema.sql`

   - Atau buat database manual dengan nama `cek_kesehatan`



3. **Konfigurasi database**User panel menampilkan data kesehatan secara realtime dalam format dashboard yang mudah dibaca:-  Simpan data ke database dengan timestamp GMT+7Overview

   - Edit file `server/db.js` jika perlu (default: host=localhost, user=root, password=asya2105)



4. **Jalankan server**

   ```bash- Display realtime untuk 8 jenis pengukuran sensor-  Export CSV dengan format `NamaOrang_Cek-Kesehatan.csv`- Admin starts a session by filling Nama / Umur / Nomor Telepon.

   node server/index.js

   ```- Informasi peserta (nama, umur, nomor telepon)



5. **Akses website**- Update otomatis tanpa refresh halaman- Data Management (CRUD lengkap)- ESP32 posts measurements one-by-one to the server.

   - User Panel: `http://localhost:3000/user`

   - Admin Panel: Ketik `accessadmin()` di console User Panel- Tampilan responsive dan modern

   - Debug Mode: `http://localhost:3000/debug`

- Frontend uses Server-Sent Events (SSE) for realtime updates (both admin & user connect).

## Created by

## Instalasi dan Running

**Glenferdinza & Rafli**

### User View- When all measurements are present, a historical record is saved. Admin can export CSV.

## License

1. Install dependencies:

MIT License

```bash- Display realtime data sensor

npm install

```- Akses admin via browser console: `accessadmin()`Quick start (Windows, Laragon):



2. Setup database MySQL di Laragon, kemudian jalankan script SQL:

```bash

mysql -u root -p cek_kesehatan < sql/schema.sql### Data Management1. Database

```

- Tabel data lengkap dengan checkbox   - Create a database `cek_kesehatan` in your MySQL (Laragon) instance.

3. Konfigurasi database di `server/db.js` (sesuaikan password MySQL):

```javascript- Edit data individual   - Run `sql/schema.sql` to create tables.

password: 'your_mysql_password'

```- Hapus data (single/multiple)



4. Jalankan server:-Download CSV (selected/all)2. Server

```bash

node server/index.js   - Open a terminal in `server/` and run:

```

## Sensor System (ID-Based)

5. Akses website:

- User: `http://localhost:3000````powershell

- Admin: `http://localhost:3000` (ketik `accessadmin()` di console)

- Debug: `http://localhost:3000/debug`ESP32 mengirim data dengan **ID sensor 1-8**:npm install



## Created by$env:DB_HOST='localhost'



Glenferdinza & Rafli| ID | Sensor | Satuan |$env:DB_USER='root'



## License|----|--------|--------|$env:DB_PASS=''



MIT License| 1  | Height | cm |$env:DB_NAME='cek_kesehatan'


| 2  | Sit and Reach | cm |$env:PORT='3000'

| 3  | Heart Rate | bpm |node index.js

| 4  | Calories | kcal |```

| 5  | Body Age | - |

| 6  | Push Up | kali |3. Frontend

| 7  | Leg & Back Dynamometer | kg |   - Serve `frontend/` folder with any static server or open `frontend/index.html` directly.

| 8  | Handgrip Dynamometer | kg |   - Admin page is the default UI. The top-left form is admin-only to start a session.



## InstalasiESP32 integration (summary)

- Start a session by calling `/api/start_session` (POST JSON: {name, age, phone}). This returns `session_id`.

### 1. Install Dependencies- ESP32 sends readings one-by-one to `/api/input` (POST JSON: {session_id, sensor, value}).

```powershell- Sensors order expected: height, sit_and_reach, heart_rate, calories, body_age, push_up, leg_back, handgrip. Use keys below.

npm install

```Sensor keys (use when posting):

- `height` (Tinggi Badan)

### 2. Setup Database- `sit_and_reach`

- Buka **Laragon** → Start MySQL- `heart_rate`

- Jalankan query dari `sql/schema.sql` di phpMyAdmin atau HeidiSQL- `calories`

- `body_age`

### 3. Konfigurasi Database- `push_up`

Edit `server/db.js` jika perlu:- `leg_back`

```javascript- `handgrip`

host: 'localhost',

user: 'root',See `frontend/js/app.js` and `server/index.js` for example requests.

password: 'asya2105',  // sesuaikan dengan password MySQL Anda

database: 'cek_kesehatan'Notes & assumptions

```- We keep a `sessions` table for the active session (current values) and a `records` table for historical completed sessions. This allows showing realtime current values and listing/exporting past records.

- UI and CSS are compact and sized to avoid scrolling on a 1920x1080 browser window; adjust font-sizes and paddings in `frontend/css/style.css` if needed.

### 4. Jalankan Server

```powershell
node server/index.js
```

Server berjalan di: `http://localhost:3000`

## Akses Website

| Role | URL | Akses |
|------|-----|-------|
| **User** | `http://localhost:3000/` | Langsung |
| **Admin** | `http://localhost:3000/admin` | Langsung |
| **Data Mgmt** | `http://localhost:3000/data-management` | Dari admin panel |
| **Simulator** | `http://localhost:3000/simulator` | Testing ESP32 |

### Akses Admin dari User Page
Buka browser console (F12) di halaman user, ketik:
```javascript
accessadmin()
```

## 🔌 API Endpoints untuk ESP32

### 1. Kirim Data Info Peserta
```http
POST /api/input
Content-Type: application/json

{
  "field": "name",  // atau "age", "phone"
  "value": "John Doe"
}
```

### 2. Kirim Data Sensor (ID 1-8)
```http
POST /api/input
Content-Type: application/json

{
  "id": 1,          // ID sensor 1-8
  "value": "170"    // nilai sensor
}
```

### 3. Contoh ESP32 Code (Arduino)
```cpp
#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "YOUR_WIFI";
const char* password = "YOUR_PASSWORD";
const char* serverUrl = "http://192.168.1.100:3000/api/input";

void sendSensorData(int sensorId, String value) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  String payload = "{\"id\":" + String(sensorId) + ",\"value\":\"" + value + "\"}";
  int httpCode = http.POST(payload);
  
  if (httpCode == 200) {
    Serial.println("Data sent: ID=" + String(sensorId) + " Value=" + value);
  }
  
  http.end();
}

void loop() {
  // Contoh: kirim data height (sensor ID 1)
  float height = readHeightSensor();
  sendSensorData(1, String(height));
  
  delay(2000);
}
```

## Testing dengan Simulator

1. Buka `http://localhost:3000/simulator`
2. Isi data info peserta dan sensor
3. Klik tombol "Kirim" untuk kirim satu per satu
4. Atau klik "Kirim Semua Data Sekaligus"
5. Monitor hasilnya di Admin/User page (buka tab terpisah)

## Struktur Project

```
cek_kesehatan/
├── server/
│   ├── index.js          # Main server (Express + SSE)
│   └── db.js             # MySQL connection
├── frontend/
│   ├── css/
│   │   └── style.css     # Modern UI styles
│   └── js/
│       ├── admin.js      # Admin page logic
│       ├── user.js       # User page logic
│       └── data-management.js
├── sql/
│   └── schema.sql        # Database schema
├── admin.html            # Admin interface
├── user.html             # User display
├── data-management.html  # CRUD interface
├── esp32-simulator.html  # Testing tool
└── package.json
```

## Design System

### Colors
- Primary: `#3b82f6` (Blue)
- Success: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Background: `#f1f5f9` (Light Gray)

### Typography
- Font: Inter (Google Fonts)
- Weights: 400 (regular), 500 (medium), 600 (semi-bold), 700 (bold)

## Realtime Updates

Website menggunakan **Server-Sent Events (SSE)** untuk update realtime:
- Data sensor langsung muncul di semua browser yang terbuka
- Tidak perlu refresh halaman
- Auto-reconnect jika koneksi terputus

## Database Tables

### `sessions` (tidak digunakan sekarang)
Table lama untuk session-based system (optional, bisa dihapus).

### `records`
Menyimpan data kesehatan yang sudah lengkap:
- `session_id` (UUID)
- Info peserta: `name`, `age`, `phone`
- Data sensor: `height`, `sit_and_reach`, `heart_rate`, dll.
- `saved_at` (DATETIME GMT+7)

## Changelog

### v2.0 - ID-Based Sensor System
- Removed Start Session form
- ID-based sensor detection (1-8)
- Realtime info field updates
- Custom CSV filename with GMT+7 timestamp
- Full CRUD Data Management page
- Modern UI redesign (soft colors, clean spacing)
- ESP32 simulator for testing

### v1.0 - Initial Release
- Session-based system
- Basic admin/user split
- CSV export
- SSE realtime updates

## Troubleshooting

### Port 3000 sudah digunakan
```powershell
# Cek process yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan hasil di atas)
taskkill /PID <PID> /F
```

### CSS tidak load
Pastikan path di HTML menggunakan `/frontend/css/style.css` (dengan slash di depan).

### Database connection error
- Cek Laragon MySQL sudah running
- Cek password di `server/db.js` sesuai dengan MySQL Anda
- Cek database `cek_kesehatan` sudah dibuat

### SSE tidak update
- Buka browser console (F12) cek error
- Pastikan server running
- Refresh halaman (Ctrl+F5)