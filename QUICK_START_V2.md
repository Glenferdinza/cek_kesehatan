# 🚀 Quick Start Guide - Sistem Cek Kesehatan

## 📋 Checklist Setup

### 1. Start Services
```bash
# Terminal 1: MySQL (Laragon)
# Pastikan MySQL running

# Terminal 2: Express API Server
cd server
node index.js
# Running on port 3000

# Terminal 3: WebSocket Server
cd server
node websocket-server.js
# Running on port 3001

# Terminal 4: Astro Dev Server
npm run dev
# Running on port 4321
```

### 2. Access Admin Panel
```javascript
// Di browser console (F12):
accessadmin()
// Copy URL yang muncul
// Contoh: /admin?token=abc-123-def
```

### 3. Workflow Normal

#### A. Admin Melakukan Deteksi
1. **Buka Admin Panel** (dengan token)
2. **Isi Form Manual:**
   - Nama
   - Umur
   - Nomor Telpon
   - Pilih Gender (radio button)

3. **NodeMCU Kirim Data:**
   - Sensor otomatis terdeteksi
   - Progress bar update (0/8 → 8/8)
   - Data auto-save ke localStorage

4. **Button States:**
   - "Simpan Data" → Aktif setelah min 4 sensor + form lengkap
   - "Export Data" → Aktif setelah simpan
   - "Mulai Data Baru" → Selalu aktif

5. **Simpan Data:**
   - Klik "Simpan Data"
   - Konfirmasi → Ya
   - ✅ Data masuk ke MySQL
   - ✅ "Export Data" jadi aktif
   - ✅ WebSocket broadcast ke Data Management

6. **Export (Opsional):**
   - Klik "Export Data"
   - Konfirmasi → Ya
   - ✅ CSV downloaded

7. **Data Baru:**
   - Klik "Mulai Data Baru"
   - Konfirmasi → Ya
   - ✅ Form & sensor direset
   - ✅ Siap untuk user berikutnya

#### B. Cek Data Management
1. **Buka Data Management:**
   - Klik link "Data Management" (di sidebar)
   - Buka di tab baru (target="_blank")
   - Admin panel tetap jalan

2. **Fitur Available:**
   - Search user (by nama/umur/telpon)
   - Filter by gender
   - Select multiple (checkbox)
   - Delete selected
   - Export CSV all data
   - Edit data inline
   - Realtime update saat ada data baru

---

## 🎯 Troubleshooting

### Problem: Data tidak masuk
**Solution:**
- ✅ Check semua 4 server running
- ✅ Check WebSocket connected (console log)
- ✅ Check NodeMCU connected ke WiFi
- ✅ Refresh admin panel

### Problem: Button "Simpan Data" disabled
**Possible Causes:**
- ❌ Form belum lengkap (nama/umur/telpon/gender)
- ❌ Sensor kurang dari 4 terdeteksi
- ❌ Validasi data gagal

**Solution:**
- ✅ Lengkapi semua form
- ✅ Tunggu sensor minimal 4
- ✅ Hover button untuk tooltip

### Problem: Refresh hilangkan data
**Solution:**
- ✅ Data auto-save ke localStorage
- ✅ Refresh akan restore data
- ✅ Kalau data hilang, cek localStorage (F12 → Application → Local Storage)

### Problem: Data Management tidak update
**Solution:**
- ✅ Check WebSocket connection (console)
- ✅ Refresh Data Management page
- ✅ Check server index.js running

### Problem: Token expired
**Solution:**
- ✅ Console: `accessadmin()` lagi
- ✅ Copy new URL with new token
- ✅ Token valid 10 menit

---

## 🔄 Data Flow Diagram

```
NodeMCU (ESP8266)
    ↓ WebSocket (port 3001)
WebSocket Server
    ↓ Broadcast
Admin Panel (Browser)
    ↓ Display realtime
Admin isi form manual
    ↓ Input events
Server (currentData)
    ↓ SSE broadcast
User Display Page
    ↓ Admin klik "Simpan Data"
MySQL Database
    ↓ WebSocket broadcast "data_saved"
Data Management
    ↓ Auto-reload
Table updated realtime
```

---

## 💾 Data Persistence Layers

### Layer 1: LocalStorage (Browser)
- **Purpose:** Backup sementara
- **Trigger:** Setiap sensor/form update
- **Lifetime:** Until save or clear
- **Restore:** Auto saat refresh

### Layer 2: Server Memory (currentData)
- **Purpose:** Real-time sharing
- **Trigger:** Input dari NodeMCU/Admin
- **Lifetime:** Until save or reset
- **Broadcast:** SSE + WebSocket

### Layer 3: MySQL Database
- **Purpose:** Permanent storage
- **Trigger:** Admin klik "Simpan Data"
- **Lifetime:** Forever (until delete)
- **Access:** Data Management page

---

## ⚙️ Configuration Files

### 1. Database (server/db.js)
```javascript
host: 'localhost',
user: 'root',
password: '',
database: 'cek_kesehatan'
```

### 2. Ports
```javascript
Express API: 3000
WebSocket: 3001
Astro Dev: 4321
```

### 3. Token Expiry
```javascript
// server/index.js
const expiry = Date.now() + (10 * 60 * 1000); // 10 minutes
```

### 4. Sensor Mapping
```javascript
// server/index.js
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
```

---

## 🎨 UI States Reference

### Button States
| Button | State | Condition |
|--------|-------|-----------|
| Simpan Data | Disabled | Form incomplete OR sensors < 4 |
| Simpan Data | Enabled | Form complete AND sensors ≥ 4 |
| Export Data | Disabled | Before save |
| Export Data | Enabled | After save |
| Mulai Data Baru | Always Enabled | - |

### Progress Bar
| Progress | Color | Meaning |
|----------|-------|---------|
| 0/8 | Gray | No sensor |
| 1-3/8 | Orange | Insufficient |
| 4-7/8 | Blue-Green | Sufficient |
| 8/8 | Green | Complete |

### Form Validation
| Field | Rule | Error |
|-------|------|-------|
| Nama | Min 2 chars | "Nama terlalu pendek" |
| Umur | 1-150 | "Umur tidak valid" |
| Telpon | Numeric format | "Format salah" |
| Gender | Must select | "Pilih gender" |

---

## 🔐 Security Notes

### Admin Access
```javascript
// Browser console ONLY
accessadmin()

// Returns:
{
  ok: true,
  token: "uuid-here",
  url: "/admin?token=uuid-here"
}
```

### Token System
- ✅ UUID v4 random
- ✅ 10 minute expiry
- ✅ Server-side validation
- ✅ Auto cleanup

### Data Protection
- ✅ localStorage per domain
- ✅ CORS enabled
- ✅ SQL parameterized queries
- ✅ XSS prevention

---

## 📱 Device Compatibility

### NodeMCU (ESP8266)
- ✅ WebSocket client
- ✅ Direct IP connection
- ✅ No mDNS support
- ✅ Auto-reconnect

### User Browsers
- ✅ mDNS support (cek-kesehatan.local)
- ✅ WebSocket support
- ✅ LocalStorage enabled
- ✅ Modern browser (ES6+)

### Admin Device
- ✅ Same as user
- ✅ Token required
- ✅ Console access
- ✅ Multiple tabs OK

---

## 📊 Monitoring

### Check System Health
```bash
# API Health
curl http://localhost:3000/api/current

# WebSocket Health
curl http://localhost:3001/health

# Database
# Check Laragon MySQL status
```

### Console Logs
**Admin Panel:**
- "WebSocket connected"
- "Data restored from localStorage"
- "Sensor updated: height = 170"

**Data Management:**
- "WebSocket connected for data management"
- "New data saved, reloading records..."

**Server:**
- "Server running on port 3000"
- "WebSocket server running on ws://..."
- "New connection from 192.168.x.x"

---

## 🎯 Best Practices

### For Admin:
1. **Always** lengkapi form sebelum mulai sensor
2. **Wait** sampai progress bar minimal 4/8
3. **Confirm** sebelum simpan (double check data)
4. **Reset** setelah selesai (siap user baru)
5. **Use** Data Management di tab terpisah

### For Development:
1. **Never** commit token ke git
2. **Always** validate input server-side
3. **Test** dengan data edge cases
4. **Monitor** WebSocket connections
5. **Backup** database regularly

### For Deployment:
1. **Change** default database password
2. **Use** environment variables
3. **Enable** HTTPS
4. **Set** proper CORS
5. **Monitor** server resources

---

## 🚨 Emergency Procedures

### Data Loss Prevention
1. **LocalStorage backup** ada
2. **Database backup** regular
3. **Export CSV** sebelum delete
4. **Confirmation** dialog aktif

### System Crash Recovery
1. **Restart** semua servers
2. **Check** database connection
3. **Clear** browser cache
4. **Generate** new token

### Database Issues
1. **Check** Laragon MySQL running
2. **Test** connection: `node server/db.js`
3. **Restore** from backup
4. **Recreate** schema from sql/schema.sql

---

## 📈 Performance Tips

### Optimize Speed:
- ✅ Use WebSocket (not polling)
- ✅ Throttle auto-save
- ✅ Lazy load data
- ✅ Cache static assets

### Reduce Load:
- ✅ Limit records per page
- ✅ Debounce search
- ✅ Cleanup old tokens
- ✅ Close unused connections

---

## ✨ Feature Highlights

### Most Useful:
1. ⭐ **Auto-save localStorage** - Never lose data
2. ⭐ **Progress indicator** - Visual feedback
3. ⭐ **Smart buttons** - Prevent errors
4. ⭐ **Realtime updates** - No refresh needed
5. ⭐ **Warning before exit** - Accident prevention

### Power User:
1. 🔥 **Bulk operations** - Delete multiple
2. 🔥 **Quick reset** - One click new data
3. 🔥 **Filter & search** - Find data fast
4. 🔥 **Export CSV** - Backup anytime
5. 🔥 **Edit inline** - Fix mistakes

---

## 🎓 Learning Resources

### File Structure:
```
src/
  pages/
    admin.astro          → Admin panel UI
    data-management.astro → Data table UI
  components/
    Sidebar.astro        → Form & buttons
    SensorCard.astro     → Sensor display
public/frontend/
  js/
    admin.js            → Admin logic + localStorage
    data-management.js  → Table logic + WebSocket
  css/
    style.css           → All styling
server/
  index.js              → Express API + SSE
  websocket-server.js   → WebSocket server
  db.js                 → MySQL connection
```

### Key Concepts:
- **SSE:** Server-Sent Events (one-way)
- **WebSocket:** Two-way communication
- **LocalStorage:** Browser storage (5MB)
- **Token:** Temporary access key
- **UUID:** Unique identifier

---

## 🎉 Success Indicators

### System Working If:
✅ 4 servers running
✅ Admin panel bisa diakses
✅ Form input working
✅ Sensor data muncul realtime
✅ Progress bar update
✅ Simpan data berhasil
✅ Data Management auto-update
✅ Export CSV downloaded
✅ Reset button clear semua

### Everything Working Perfect If:
✅ No console errors
✅ WebSocket connected
✅ LocalStorage backup active
✅ Warning before exit works
✅ Token valid
✅ Data persisted in DB
✅ Realtime update smooth
✅ UI responsive

---

**System Status:** ✅ Production Ready
**Last Updated:** November 20, 2025
**Version:** 2.0 (With all enhancements)
