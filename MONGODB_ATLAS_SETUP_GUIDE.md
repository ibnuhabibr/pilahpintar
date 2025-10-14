# 🍃 MongoDB Atlas Setup Guide - PilahPintar

## 📋 Persiapan dan Checklist

### ✅ Yang Anda Butuhkan:

- [ ] Email address (untuk registrasi akun)
- [ ] Koneksi internet yang stabil
- [ ] Browser web (Chrome/Firefox/Edge)
- [ ] Password manager atau catatan untuk menyimpan kredensial
- [ ] Proyek PilahPintar yang sudah disetup

### 🔐 Kredensial yang Perlu Disiapkan:

- [x] **Email MongoDB Atlas**: ibnuhabib017@gmail.com
- [x] **Login Method**: Gmail OAuth (tidak perlu password khusus untuk Atlas)
- [x] **Database Username**: pilahpintar-admin
- [x] **Database Password**: pilahpintar (INI yang penting untuk aplikasi)
- [x] **Cluster Name**: PilahPintar

---

## 📝 Pertanyaan Persiapan

Sebelum mulai setup, jawab pertanyaan berikut:

### 1. **Akun dan Autentikasi**

- **Q: Apakah Anda sudah memiliki akun MongoDB Atlas?**

  - [x] Ya, saya sudah punya akun
  - [ ] Tidak, saya akan buat akun baru

- **Q: Email apa yang akan Anda gunakan untuk registrasi?**
  - Email: `ibnuhabib017@gmail.com`

### 2. **Keamanan Database**

- **Q: Username untuk database user?**

  - Username: `pilahpintar-admin`

- **Q: Password untuk database user?** (Min 8 karakter, kombinasi huruf+angka)
  - Password: `pilahpintar`

### 3. **Lokasi dan Performa**

- **Q: Dimana lokasi server terdekat dengan Anda?**
  - [ ] Singapore (Asia Pacific)
  - [ ] Mumbai (Asia Pacific)
  - [ ] Tokyo (Asia Pacific)
  - [ ] Sydney (Asia Pacific)
  - [x] Lainnya: GCP Jakarta (asia-southeast2)

### 4. **Environment Setup**

- **Q: Ini untuk environment apa?**

  - [ ] Development/Testing
  - [ ] Production/Live
  - [x] Keduanya

- **Q: IP address mana yang perlu akses ke database?**
  - [ ] Hanya IP saya saat ini
  - [x] Semua IP (0.0.0.0/0) - untuk development
  - [ ] IP spesifik: **\*\***\_\_\_**\*\***

### 5. **Integrasi dengan PilahPintar**

- **Q: Nama database yang akan digunakan?**

  - Database Name: `pilahpintar`

- **Q: Collections apa yang dibutuhkan?**
  - [x] users (data pengguna)
  - [x] classifications (hasil klasifikasi)
  - [x] posts (postingan komunitas)
  - [x] challenges (tantangan)
  - [x] articles (artikel edukasi)

---

## 🛠️ Langkah-langkah Setup

### Phase 1: Registrasi dan Cluster Setup

1. **Buka MongoDB Atlas**: https://cloud.mongodb.com
2. **Register/Login** dengan email yang sudah disiapkan
3. **Create Organization** (nama: "PilahPintar" atau sesuai keinginan)
4. **Create Project** (nama: "PilahPintar-Production")
5. **Build Database** - pilih FREE tier (M0 Sandbox)
6. **Pilih Cloud Provider**: AWS/Google Cloud/Azure
7. **Pilih Region**: Sesuai jawaban pertanyaan #3
8. **Cluster Name**: Sesuai jawaban pertanyaan #2

### Phase 2: Security Configuration

1. **Database Access**:

   - Create Database User
   - Username: (dari jawaban pertanyaan #2)
   - Password: (dari jawaban pertanyaan #2)
   - Role: Atlas Admin atau Read/Write to any database

2. **Network Access**:
   - Add IP Address
   - Sesuai jawaban pertanyaan #4
   - Description: "PilahPintar Development" atau "Production Access"

### Phase 3: Connection Setup

1. **Get Connection String**:

   - Connect → Drivers → Node.js
   - Copy connection string
   - Replace `<password>` dengan password database user

2. **Test Connection**:
   - Gunakan MongoDB Compass atau MongoDB Shell
   - Verify connection berhasil

### Phase 4: Integration dengan PilahPintar

1. **Update Environment Variables**
2. **Update Database Connection Code**
3. **Create Database Schema/Models**
4. **Test dengan Sample Data**
5. **Migrate dari Local MongoDB (jika ada)**

---

## 🔧 Configuration Files Yang Akan Diupdate

### 1. `.env` File

```bash
# Connection string untuk PilahPintar (dengan database name)
MONGODB_URI=mongodb+srv://pilahpintar-admin:pilahpintar@pilahpintar.6ib8o03.mongodb.net/pilahpintar?retryWrites=true&w=majority&appName=PilahPintar
```

### 2. Database Connection (`src/config/database.js`)

```javascript
const mongoose = require("mongoose");
// Connection logic dengan error handling
```

### 3. Models yang Akan Dibuat

- `User.js` - Model pengguna
- `Classification.js` - Model hasil klasifikasi
- `Post.js` - Model postingan komunitas
- `Challenge.js` - Model tantangan
- `Article.js` - Model artikel edukasi

---

## 🧪 Testing Checklist

Setelah setup selesai, test hal-hal berikut:

- [ ] **Connection Test**: Database bisa connect dari local
- [ ] **User Registration**: Bisa create user baru
- [ ] **Authentication**: Login/logout berfungsi
- [ ] **Classification**: Bisa simpan hasil klasifikasi
- [ ] **Community Posts**: Bisa create/read postingan
- [ ] **Performance**: Response time < 500ms untuk query sederhana

---

## 🚨 Troubleshooting Common Issues

### Issue 1: Connection Timeout

**Gejala**: `MongoServerSelectionError`
**Solusi**:

- [ ] Check IP whitelist
- [ ] Verify username/password
- [ ] Check internet connection

### Issue 2: Authentication Failed

**Gejala**: `Authentication failed`
**Solusi**:

- [ ] Double-check username/password di connection string
- [ ] Verify database user permissions

### Issue 3: Database Not Found

**Gejala**: `Database does not exist`
**Solusi**:

- [ ] Database akan auto-create saat first write operation
- [ ] Check database name di connection string

---

## 📊 Monitoring dan Maintenance

### Metrics yang Perlu Dipantau:

- [ ] **Connection Count**: Jumlah koneksi aktif
- [ ] **Operation Count**: Jumlah read/write per detik
- [ ] **Storage Usage**: Penggunaan storage vs limit
- [ ] **Index Usage**: Efisiensi query dengan index

### Regular Maintenance Tasks:

- [ ] **Weekly**: Review slow queries
- [ ] **Monthly**: Analyze storage growth
- [ ] **Quarterly**: Review and optimize indexes
- [ ] **Yearly**: Consider upgrade tier jika perlu

---

## 💰 Cost Planning

### Free Tier (M0) Limits:

- **Storage**: 512 MB
- **RAM**: 512 MB (shared)
- **Connections**: 500 concurrent
- **Databases**: 500 max

### Kapan Perlu Upgrade:

- [ ] Storage > 400 MB (80% dari limit)
- [ ] Connections sering hit limit
- [ ] Performance mulai lambat
- [ ] Butuh automated backup

---

## 📞 Support dan Resources

### Jika Ada Masalah:

1. **MongoDB Documentation**: https://docs.mongodb.com/atlas/
2. **Community Forum**: https://community.mongodb.com/
3. **Stack Overflow**: Tag `mongodb-atlas`
4. **MongoDB University**: Kursus gratis untuk belajar

### Emergency Contacts:

- **MongoDB Support** (Paid tiers only)
- **Community Forum** (Free support)
- **PilahPintar Team** (Internal support)

---

## ✅ Final Checklist

Sebelum go-live, pastikan:

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] Sample data seeded
- [ ] All API endpoints tested
- [ ] Error handling implemented
- [ ] Monitoring setup
- [ ] Backup strategy (untuk paid tiers)
- [ ] Security review completed

---

**🎉 Setelah semua checklist selesai, PilahPintar siap menggunakan MongoDB Atlas!**

---

_Created: October 13, 2025_
_Project: PilahPintar - AI-Powered Waste Classification Platform_
_Environment: Development → Production Ready_
