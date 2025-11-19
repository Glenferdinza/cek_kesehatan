# Deksripsi Singkat

Website monitoring kesehatan realtime yang terintegrasi dengan ESP32 untuk mengukur berbagai parameter kesehatan seperti tinggi badan, sit and reach, detak jantung, kalori, usia tubuh, push up, kekuatan kaki & punggung, dan kekuatan genggaman tangan.

## Sistem ini memiliki dua role: Admin dan User, dengan fitur manajemen data lengkap.

Untuk penjelasan terkait keduanya antara lain sebagai berikut:

## Admin Panel

Admin panel memungkinkan petugas kesehatan untuk:

- Input data pasien (nama, umur, nomor telepon) secara manual dengan tombol Enter

- Menerima data sensor secara realtime dari ESP32 (ID 1-8)

- Menyimpan hasil pemeriksaan ke database

- Export data ke format CSV

- Mengelola data (CRUD operations) melalui halaman Data Management

- Debug mode untuk simulasi sensor realtimeAdmin panel memungkinkan petugas kesehatan untuk demo testing

- Akses admin dilindungi dengan token yang berlaku selama 10 menit.

- Untuk mendapatkan akses admin, buka halaman User dan ketik `accessadmin()` di browser console.

- Input data pasien (nama, umur, nomor telepon) secara manual dengan tombol Enter

## User Panel

User panel menampilkan:

- Menerima data sensor secara realtime dari ESP32 (ID 1-8)

- Menyimpan hasil pemeriksaan ke database

- Monitor realtime semua parameter kesehatan

- Update otomatis saat sensor mengirim data baru

- Export data ke format CSV

- Tampilan yang clean dengan tema blue & white

- 8 jenis pengukuran kesehatan secara simultan

- Mengelola data (CRUD operations) melalui halaman Data Management

- Debug mode untuk simulasi sensor realtime

## Instalasi dan Running

### Prasyarat
- Node.js (v14 atau lebih baru)
- MySQL Server (melalui Laragon atau instalasi terpisah)
- Git (opsional)

### Langkah-langkah Setup

1. **Install dependencies root project (Astro)**
   ```bash
   npm install
   ```

2. **Install dependencies server**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Setup database MySQL**
   - Buka phpMyAdmin di Laragon (atau MySQL client lainnya)
   - Import file `sql/schema.sql`
   - Atau buat database manual dengan nama `cek_kesehatan`

4. **Konfigurasi database**
   - Edit file `server/db.js` jika perlu
   - Default configuration:
     - host: `localhost`
     - user: `root`
     - password: `asya2105`
     - database: `cek_kesehatan`

5. **Jalankan WebSocket Server**
   
   Buka terminal pertama:
   ```bash
   cd server
   npm run websocket
   ```
   
   WebSocket server akan berjalan di `ws://localhost:8080`

6. **Jalankan HTTP Server**
   
   Buka terminal kedua:
   ```bash
   cd server
   npm start
   ```
   
   Atau langsung dengan:
   ```bash
   node server/index.js
   ```
   
   HTTP server akan berjalan di `http://localhost:3000`

7. **Jalankan Astro Dev Server (Opsional)**
   
   Buka terminal ketiga (jika ingin menggunakan Astro):
   ```bash
   npm run dev
   ```

8. **Akses aplikasi**
   - User Panel: `http://localhost:3000/` atau `http://localhost:3000/user`
   - Admin Panel: Buka User Panel, lalu ketik `accessadmin()` di browser console
   - Debug Mode: `http://localhost:3000/debug`
   - Data Management: `http://localhost:3000/data-management`

### Menjalankan Keseluruhan Sistem

**Terminal 1 - WebSocket Server:**
```bash
cd server
npm run websocket
```

**Terminal 2 - HTTP Server:**
```bash
cd server
npm start
```

**Terminal 3 - Astro (Opsional):**
```bash
npm run dev
```

## Troubleshooting

### Port sudah digunakan

**Port 3000 (HTTP Server):**
```powershell
# Cek process yang menggunakan port 3000
netstat -ano | findstr :3000

# Kill process (ganti PID dengan hasil di atas)
taskkill /PID <PID> /F
```

**Port 8080 (WebSocket Server):**
```powershell
# Cek process yang menggunakan port 8080
netstat -ano | findstr :8080

# Kill process (ganti PID dengan hasil di atas)
taskkill /PID <PID> /F
```

### CSS tidak load
Pastikan path di HTML menggunakan `/frontend/css/style.css` (dengan slash di depan).

### Database connection error
- Cek Laragon MySQL sudah running
- Cek password di `server/db.js` sesuai dengan MySQL Anda
- Cek database `cek_kesehatan` sudah dibuat
- Pastikan MySQL berjalan di port 3306 (default)

### WebSocket tidak terkoneksi
- Pastikan WebSocket server berjalan di port 8080
- Buka browser console (F12) cek error koneksi
- Pastikan tidak ada firewall yang memblokir port 8080
- Cek apakah ESP32 sudah terhubung ke jaringan yang sama

### Data sensor tidak update
- Pastikan WebSocket server berjalan
- Pastikan ESP32 sudah terkoneksi ke WebSocket server
- Buka browser console (F12) cek log WebSocket
- Restart WebSocket server jika perlu
- Refresh halaman (Ctrl+F5)

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **WebSocket**: ws library untuk real-time communication
- **Database**: MySQL
- **Hardware**: ESP32/NodeMCU dengan berbagai sensor kesehatan

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Created by

**Glenferdinza & Rafli**
