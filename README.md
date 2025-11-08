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
- 
- Menyimpan hasil pemeriksaan ke database

- Monitor realtime semua parameter kesehatan

- Update otomatis saat sensor mengirim data baru

- Export data ke format CSV

- Tampilan yang clean dengan tema blue & white

- 8 jenis pengukuran kesehatan secara simultan

- Mengelola data (CRUD operations) melalui halaman Data Management

## Instalasi dan Running

- Debug mode untuk simulasi sensor realtime

Admin panel memungkinkan pengelolaan data kesehatan secara realtime:

1. **Install dependencies**

   ```bash
   npm install
   ```
   
2. **Setup database MySQL**

   - Buka phpMyAdmin di Laragon## User Panel
   - Input data peserta (nama, umur, nomor telepon)
   
   ## Fitur UtamaStructure

   - Import file `sql/schema.sql`

   - Atau buat database manual dengan nama `cek_kesehatan`

3. **Konfigurasi database**User panel menampilkan:

   - Monitoring 8 sensor kesehatan secara realtime

   - Edit file `server/db.js` jika perlu (default: host=localhost, user=root, password=asya2105)

   - Monitor realtime semua parameter kesehatan

4. **Jalankan server**

   ```bash
   node server/index.js
   ```

6. **Akses website**- 8 jenis pengukuran kesehatan secara simultan- Export data ke CSV dengan format custom

   - User Panel: `http://localhost:3000/user`

   - Admin Panel: Ketik `accessadmin()` di console User Panel

   - Debug Mode: `http://localhost:3000/debug`

## Instalasi dan Running

- Data Management dengan fitur CRUD lengkap### Admin Panel
- `server/`
- Node.js Express backend

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

## Created by

**Glenferdinza & Rafli**
