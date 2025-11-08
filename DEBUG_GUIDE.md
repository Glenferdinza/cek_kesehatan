# DEBUG MODE & ADMIN PROTECTION

## Fitur Baru yang Sudah Ditambahkan

### 1. DEBUG Sensor Simulator (Realtime)
**URL:** `http://localhost:3000/debug`

**Fitur:**
- ✅ Simulasi pengukuran sensor secara REALTIME
- ✅ Delay random 1.5-3.5 detik per sensor (seperti alat asli)
- ✅ Animasi scanning dengan nilai berubah-ubah
- ✅ Data otomatis dikirim ke server saat selesai scanning
- ✅ Progress bar untuk tracking
- ✅ Activity log dengan timestamp
- ✅ Data dummy random dalam range realistis

**Urutan Pengukuran:**
1. Nama → ambil dari input
2. Umur → ambil dari input  
3. No. Telepon → ambil dari input
4. Height: 150-190 cm
5. Sit & Reach: 10-40 cm
6. Heart Rate: 60-100 bpm
7. Calories: 1500-2500 kcal
8. Body Age: 18-35
9. Push Up: 10-50 kali
10. Leg & Back: 80-150 kg
11. Handgrip: 30-60 kg

**Cara Test:**
```
1. Buka http://localhost:3000/debug
2. Isi Nama, Umur, No. Telp
3. Buka http://localhost:3000/admin?token=xxx di tab lain
4. Klik "Mulai Simulasi Pengukuran" di debug page
5. Lihat data muncul REALTIME di admin panel!
6. Setiap sensor ngukur dengan delay, website ikut update!
7. Stop kapan aja dengan tombol Stop
```

**Perilaku:**
- ⏱️ Sensor 1 mulai ngukur → animasi scanning 1.5-3.5 detik → nilai fix → kirim ke server → website update
- ⏱️ Sensor 2 mulai ngukur → animasi scanning → nilai fix → kirim → update
- ⏱️ Dan seterusnya sampai semua sensor selesai
- 🎯 Simulasi persis seperti alat asli yang ngukur satu per satu!

---

### 2. 🔒 Admin Protection dengan Token (10 Menit Expiry)

**Cara Akses Admin:**
```javascript
// Buka user page: http://localhost:3000/
// Tekan F12 (Developer Tools)
// Ketik di Console:
accessadmin()

// Token otomatis dibuat, redirect ke /admin?token=xxx
```

**Proteksi:**
- ❌ Akses `/admin` langsung tanpa token → **Access Denied**
- ❌ Akses `/data-management` tanpa token → **Access Denied**
- ❌ Token invalid → **Invalid Token**
- ❌ Token kadaluarsa (>10 menit) → **Token Expired**
- ✅ Token valid (<10 menit) → **Access Granted**

**Token Lifecycle:**
```
1. User ketik accessadmin() di console
2. Server generate UUID token + expiry (now + 10 min)
3. Redirect ke /admin?token=xxx
4. Setiap request ke /admin atau /data-management dicek:
   - Ada token? ✅
   - Token valid? ✅
   - Token belum expired? ✅
   - Kalau semua OK → akses granted
   - Kalau salah satu gagal → denied
5. Setelah 10 menit → token expired
6. User harus accessadmin() lagi untuk token baru
```

**Error Pages:**
- **No Token:** "🚫 Access Denied - You need a valid token"
- **Invalid Token:** "🚫 Invalid Token - Your token is invalid"
- **Expired Token:** "⏰ Token Expired - Your token has expired (10 minutes limit)"

Semua error page kasih instruksi: "Open console (F12) and type: `accessadmin()`"

---

## 🧪 Testing Flow Lengkap

### Test 1: Debug Sensor Realtime
```
1. Buka http://localhost:3000/ (user page)
2. F12 → Console → ketik: accessadmin()
3. Otomatis redirect ke admin dengan token
4. Buka tab baru: http://localhost:3000/debug
5. Isi nama/umur/telp di debug page
6. Klik "Mulai Simulasi Pengukuran"
7. Lihat admin page → data muncul REALTIME satu per satu!
8. Setiap sensor ada delay, animasi scanning, baru fix
9. Website ikut update sesuai delay sensor
```

### Test 2: Admin Token Protection
```
# Test akses langsung (harus denied)
1. Buka http://localhost:3000/admin
   → Muncul: "🚫 Access Denied"

# Test dengan token
2. Buka http://localhost:3000/
3. F12 → Console → accessadmin()
4. Otomatis redirect ke /admin?token=xxx
   → Berhasil masuk! ✅

# Test expiry (tunggu 10 menit atau ganti timestamp di code untuk testing)
5. Tunggu 10 menit
6. Refresh /admin?token=xxx
   → Muncul: "⏰ Token Expired"

# Test token baru
7. Balik ke user page
8. F12 → Console → accessadmin()
9. Token baru dibuat, bisa akses lagi! ✅
```

### Test 3: Data Management Protection
```
1. Buka http://localhost:3000/data-management
   → Denied! (butuh token)

2. Akses via admin panel (sudah ada token):
   Admin → klik "Data Management" → ✅ Bisa masuk!
   (token di URL otomatis diteruskan)
```

---

## 📊 Summary

**URLs:**
- `/` - User page (public)
- `/admin` - Admin panel (🔒 protected)
- `/data-management` - CRUD page (🔒 protected)
- `/simulator` - ESP32 simulator (public testing)
- `/debug` - Realtime sensor simulator (public testing)

**Protected Pages:**
- ✅ `/admin` - Butuh token valid
- ✅ `/data-management` - Butuh token valid
- ⏰ Token expire: 10 menit

**Debug Features:**
- ✅ Realtime sensor simulation
- ✅ Delay per sensor (1.5-3.5 detik)
- ✅ Scanning animation
- ✅ Progress tracking
- ✅ Activity log
- ✅ Stop/Reset controls

**Admin Access:**
```javascript
// Di console user page:
accessadmin()

// Token dibuat, redirect otomatis
// Valid 10 menit
// Kalau expired, panggil lagi
```

---

**🎉 SEMUA FITUR SUDAH JALAN!**

Sekarang kamu bisa:
1. Test realtime sensor dengan delay di `/debug`
2. Lihat data muncul bertahap di admin
3. Admin page protected dengan token
4. Token expire 10 menit
5. Data management juga protected

**Next: Test dan lihat hasilnya!** 🚀
