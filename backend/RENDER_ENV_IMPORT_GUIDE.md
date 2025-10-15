# 📦 Cara Import Environment Variables ke Render.com

## 🎯 Quick Guide

Ada 2 cara untuk import environment variables ke Render:

---

## 🔥 Cara 1: Bulk Import (TERCEPAT - Recommended)

### Step 1: Copy Environment Variables

Buka file: `.env.render.import`

Copy **semua baris** (tanpa comment `#`):
```
MONGODB_URI=mongodb+srv://Vercel-Admin-PilahPintar:...
JWT_SECRET=pilahpintar-prod-aaca99bf7c4136fd0159f6b7c419e3e0434859746f9795656efda44d3797af81
JWT_EXPIRES_IN=7d
NODE_ENV=production
FRONTEND_URL=https://frontend-gules-xi-70.vercel.app
CORS_ORIGIN=https://frontend-gules-xi-70.vercel.app
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
PORT=3000
```

### Step 2: Paste di Render Dashboard

1. **Buka Render Dashboard**: https://dashboard.render.com
2. **Pilih service** `pilahpintar-backend`
3. **Klik tab "Environment"** (di sidebar kiri)
4. **Klik tombol "Add from .env"** (pojok kanan atas)
5. **Paste** semua environment variables yang sudah di-copy
6. **Klik "Save Changes"**

✅ **Done!** Semua environment variables ter-import sekaligus.

---

## 📝 Cara 2: Manual Input Satu-per-Satu

### Step 1: Buka Environment Settings

1. **Render Dashboard** → Service `pilahpintar-backend`
2. **Tab "Environment"**
3. **Klik "Add Environment Variable"**

### Step 2: Input Variables

Buka file `.env.render` sebagai referensi.

Input satu per satu:

#### 1. MONGODB_URI
```
Key: MONGODB_URI
Value: mongodb+srv://Vercel-Admin-PilahPintar:nv7xQsEDlAorZbf5@pilahpintar.ldoobvd.mongodb.net/pilahpintar?retryWrites=true&w=majority
```

#### 2. JWT_SECRET
```
Key: JWT_SECRET
Value: pilahpintar-prod-aaca99bf7c4136fd0159f6b7c419e3e0434859746f9795656efda44d3797af81
```

#### 3. JWT_EXPIRES_IN
```
Key: JWT_EXPIRES_IN
Value: 7d
```

#### 4. NODE_ENV
```
Key: NODE_ENV
Value: production
```

#### 5. FRONTEND_URL
```
Key: FRONTEND_URL
Value: https://frontend-gules-xi-70.vercel.app
```
⚠️ **IMPORTANT**: Ganti dengan URL frontend Anda yang sebenarnya!

#### 6. CORS_ORIGIN
```
Key: CORS_ORIGIN
Value: https://frontend-gules-xi-70.vercel.app
```
⚠️ **IMPORTANT**: Harus sama dengan FRONTEND_URL!

#### 7. MAX_FILE_SIZE
```
Key: MAX_FILE_SIZE
Value: 10485760
```

#### 8. ALLOWED_FILE_TYPES
```
Key: ALLOWED_FILE_TYPES
Value: image/jpeg,image/png,image/jpg,image/webp
```

#### 9. RATE_LIMIT_WINDOW_MS
```
Key: RATE_LIMIT_WINDOW_MS
Value: 900000
```

#### 10. RATE_LIMIT_MAX_REQUESTS
```
Key: RATE_LIMIT_MAX_REQUESTS
Value: 100
```

#### 11. PORT
```
Key: PORT
Value: 3000
```

### Step 3: Save & Deploy

Setelah semua variables ditambahkan:
1. **Klik "Save Changes"**
2. Render akan otomatis **trigger redeploy**
3. Tunggu ~3-5 menit

---

## ✅ Verification

Setelah environment variables ter-import dan deployment selesai:

### Test 1: Health Check
```bash
curl https://pilahpintar-backend.onrender.com/api/health
```

Expected response:
```json
{
  "success": true,
  "database": "connected" ✅
}
```

### Test 2: Check Logs

Render Dashboard → **Logs** tab

Cari line:
```
📦 MongoDB connected successfully
🚀 PilahPintar API server running on port 3000
```

---

## 🔄 Update Environment Variables

Jika perlu update values nanti:

### Method 1: Edit Individual Variable
1. Render Dashboard → **Environment** tab
2. Klik **"Edit"** di variable yang ingin diubah
3. Update value
4. **Save** → Auto redeploy

### Method 2: Bulk Update
1. **Environment** tab → **"Add from .env"**
2. Paste updated KEY=VALUE pairs
3. Render akan merge dengan existing variables
4. **Save** → Auto redeploy

---

## 📋 Checklist

Setelah import, pastikan semua variables ada:

- [ ] MONGODB_URI
- [ ] JWT_SECRET
- [ ] JWT_EXPIRES_IN
- [ ] NODE_ENV
- [ ] FRONTEND_URL
- [ ] CORS_ORIGIN
- [ ] MAX_FILE_SIZE
- [ ] ALLOWED_FILE_TYPES
- [ ] RATE_LIMIT_WINDOW_MS
- [ ] RATE_LIMIT_MAX_REQUESTS
- [ ] PORT

Total: **11 environment variables**

---

## 🚨 Important Notes

1. **Never commit** `.env.render` or `.env.render.import` to Git
2. These files contain **sensitive credentials**
3. Already added to `.gitignore`
4. Keep these files **local only**
5. **Update FRONTEND_URL** dengan URL frontend Anda yang sebenarnya

---

## 📞 Troubleshooting

### Problem: Import gagal
- **Solution**: Pastikan format `KEY=VALUE` tanpa spasi extra
- Hapus semua comment lines (`#`)
- Satu variable per line

### Problem: Variables tidak ter-load
- **Solution**: Redeploy manual
- Render Dashboard → **Manual Deploy** → **Deploy latest commit**

### Problem: Database tetap disconnected
- **Solution**: 
  1. Check MONGODB_URI tidak ada typo
  2. MongoDB Atlas Network Access allow Render IPs atau `0.0.0.0/0`
  3. Check MongoDB Atlas Database Access user credentials

---

## ✨ Summary

**Recommended Method**: Bulk Import (Cara 1)
- ⚡ Fastest
- ✅ Less error-prone
- 🎯 One-time paste

**Time Required**: 
- Cara 1: ~2 menit
- Cara 2: ~10 menit

**Setelah import**, backend akan otomatis redeploy dengan environment variables baru! 🚀