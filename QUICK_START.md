# QUICK START GUIDE

**Pastikan Server Mysql entah lewat Laragon atau Mysql sudah kamu buat terlebih dahulu, lanjut nanti kamu buat databasenya dengan klik Link ini:**

[Link schema.sql](https://github.com/Glenferdinza/cek_kesehatan/blob/main/sql/schema.sql)

Copy paste langsung aja di SQL nya untuk membuat databasenya (ingat ya ini di copy-paste diluar database (soalnya udah include create databasenya))

### Buka Browser:

1. **User View** (Public Display)
   ```
   http://localhost:3000/
   ```

2. **Admin Panel** (Full Control)
   ```
   http://localhost:3000/admin
   ```

3. **ESP32 Simulator** (Testing)
   ```
   http://localhost:3000/simulator
   ```

4. **Data Management** (CRUD)
   ```
   http://localhost:3000/data-management
   ```

5. **DEBUG Sensor Simulator** (Demo)
   ```
   http://localhost:3000/debug
   ```
   
---

## Testing Flow

### Step 1: Buka Simulator
- Klik: `http://localhost:3000/simulator`
- Isi data info peserta (nama, umur, telepon)
- Isi data 8 sensor

### Step 2: Buka Admin Panel (Tab Baru)
- Klik: `http://localhost:3000/admin`
- Lihat data muncul **REALTIME** saat kamu kirim dari simulator!

### Step 3: Test Kirim Data
Di **Simulator**:
1. Klik "Kirim" di sebelah "Nama" → Langsung muncul di Admin!
2. Klik "Kirim" di sebelah "1. Height" → Langsung muncul di Admin!
3. Atau klik **"Kirim Semua Data Sekaligus"**

### Step 4: Simpan ke Database
Di **Admin Panel**:
- Klik tombol **"Simpan Data"**
- Data tersimpan dengan timestamp GMT+7!

### Step 5: Export CSV
Di **Admin Panel**:
- Klik tombol **"Export CSV"**
- File didownload dengan nama: `NamaOrang_Cek-Kesehatan.csv`

### Step 6: Data Management
- Klik link **"Data Management"** di Admin Panel
- Lihat semua data tersimpan
- Bisa **Edit**, **Hapus**, atau **Download** data

---

## Cara Konek ESP32

### Endpoint API:
```
POST http://YOUR_SERVER_IP:3000/api/input
Content-Type: application/json
```

### Format Kirim Info Peserta:
```json
{
  "field": "name",
  "value": "John Doe"
}
```

### Format Kirim Sensor (ID 1-8):
```json
{
  "id": 1,
  "value": "170"
}
```

### Mapping Sensor ID:
- ID 1 = Height (cm)
- ID 2 = Sit and Reach (cm)
- ID 3 = Heart Rate (bpm)
- ID 4 = Calories (kcal)
- ID 5 = Body Age
- ID 6 = Push Up (kali)
- ID 7 = Leg & Back Dynamometer (kg)
- ID 8 = Handgrip Dynamometer (kg)

---

## Fitur Selesai

- ID-based sensor system (1-8)  
- Realtime updates via SSE  
- No Start Session form (data langsung masuk)  
- Custom CSV filename `NamaOrang_Cek-Kesehatan.csv`  
- GMT+7 timestamp  
- Full CRUD Data Management  
- Modern UI design (soft colors, clean)  
- ESP32 Simulator untuk testing  
- Checkbox selection untuk download/delete  

---

## Troubleshooting

**Server mati?**
```powershell
cd c:\laragon\www\cek_kesehatan
node server/index.js
```

**Port 3000 sudah digunakan?**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Data tidak muncul?**
- Refresh halaman (Ctrl + F5)
- Buka Console (F12) cek error
- Pastikan server running

---

## Notes

- **Simulator** = Pengganti ESP32 untuk testing
- **SSE** = Data update otomatis tanpa refresh
- **GMT+7** = Timestamp Indonesia
- **Admin Access** = Bisa via console `accessadmin()` dari user page

---

Untuk integrasi ESP32 yang sebenarnya, lihat contoh code di README.md
