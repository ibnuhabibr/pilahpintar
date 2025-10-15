# 🚀 Tutorial Deploy Backend PilahPintar ke Render.com

## 📋 Daftar Isi

1. [Persiapan](#persiapan)
2. [Sign Up & Setup Render](#sign-up--setup-render)
3. [Deploy Backend](#deploy-backend)
4. [Konfigurasi Environment Variables](#konfigurasi-environment-variables)
5. [Testing & Verification](#testing--verification)
6. [Update Frontend](#update-frontend)
7. [Troubleshooting](#troubleshooting)

---

## 1. Persiapan

### ✅ Prerequisites

- [x] Repository GitHub: `pilahpintar` sudah ada
- [x] Backend code sudah di-push ke GitHub branch `main`
- [x] MongoDB Atlas cluster sudah berjalan
- [x] File `render.yaml` sudah ada di folder `backend/`

### 📦 Yang Dibutuhkan

- Account GitHub (untuk authentication)
- Browser web
- Connection string MongoDB Atlas
- Environment variables backend

---

## 2. Sign Up & Setup Render

### Step 1: Buat Account Render

1. **Buka browser** dan kunjungi: https://render.com

2. **Sign Up dengan GitHub**:

   - Klik tombol **"Get Started for Free"**
   - Pilih **"Sign up with GitHub"**
   - Authorize Render untuk mengakses GitHub account Anda

3. **Verifikasi Email**:
   - Cek inbox email Anda
   - Klik link verifikasi dari Render
   - Confirm account

### Step 2: Connect GitHub Repository

1. **Dashboard Render** akan terbuka otomatis
2. Render akan request **GitHub repository access**
3. **Grant access** ke repository `pilahpintar`
   - Bisa pilih "All repositories" atau
   - Pilih "Only select repositories" → pilih `pilahpintar`
4. Klik **"Install & Authorize"**

---

## 3. Deploy Backend

### Step 1: Create New Web Service

1. Di **Render Dashboard**, klik **"New +"** (pojok kanan atas)
2. Pilih **"Web Service"**
3. Render akan menampilkan list repository GitHub Anda

### Step 2: Select Repository

1. Cari repository **"pilahpintar"**
2. Klik tombol **"Connect"** di sebelah repository

### Step 3: Configure Web Service

Isi form konfigurasi dengan detail berikut:

#### Basic Settings

| Field              | Value                              |
| ------------------ | ---------------------------------- |
| **Name**           | `pilahpintar-backend`              |
| **Region**         | `Singapore` (closest to Indonesia) |
| **Branch**         | `main`                             |
| **Root Directory** | `backend`                          |
| **Runtime**        | `Node` (auto-detected)             |

#### Build & Deploy Settings

| Field             | Value         |
| ----------------- | ------------- |
| **Build Command** | `npm install` |
| **Start Command** | `npm start`   |

#### Instance Settings

| Field             | Value                    |
| ----------------- | ------------------------ |
| **Instance Type** | `Free`                   |
| **Auto-Deploy**   | ✅ **Yes** (recommended) |

> **Note**: Dengan Auto-Deploy enabled, setiap kali Anda push ke branch `main`, Render akan otomatis redeploy backend.

---

## 4. Konfigurasi Environment Variables

### Step 1: Open Advanced Settings

1. Scroll ke bawah sampai menemukan section **"Advanced"**
2. Klik **"Advanced"** untuk expand

### Step 2: Add Environment Variables

Klik **"Add Environment Variable"** dan tambahkan satu per satu:

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

> **Note**: Ganti dengan URL frontend Anda yang sebenarnya

#### 6. CORS_ORIGIN

```
Key: CORS_ORIGIN
Value: https://frontend-gules-xi-70.vercel.app
```

> **Note**: Harus sama dengan FRONTEND_URL

#### 7. MAX_FILE_SIZE

```
Key: MAX_FILE_SIZE
Value: 10485760
```

> **Note**: 10MB in bytes

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

> **Note**: 15 minutes in milliseconds

#### 10. RATE_LIMIT_MAX_REQUESTS

```
Key: RATE_LIMIT_MAX_REQUESTS
Value: 100
```

#### 11. PORT (Optional)

```
Key: PORT
Value: 3000
```

### Step 3: Review Environment Variables

Pastikan semua 11 environment variables sudah ditambahkan dengan benar:

✅ **Checklist**:

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

---

## 5. Deploy & Wait

### Step 1: Create Web Service

1. Scroll ke bawah
2. Klik tombol besar **"Create Web Service"**
3. Render akan mulai deployment process

### Step 2: Monitor Deployment

1. Anda akan diarahkan ke **deployment logs page**
2. Lihat progress deployment:
   - ⏳ **Building**: Installing dependencies
   - ⏳ **Deploying**: Starting the application
   - ✅ **Live**: Deployment successful!

### Step 3: Wait for Completion

⏰ **Estimated Time**: 3-5 menit

Progress indicator akan menunjukkan:

```
Building...
==> Downloading cache...
==> Installing dependencies
==> Build successful!
Deploying...
==> Starting service
==> Your service is live 🎉
```

### Step 4: Get Backend URL

Setelah deployment selesai, Anda akan mendapat URL seperti:

```
https://pilahpintar-backend.onrender.com
```

📋 **Copy URL ini** - Anda akan membutuhkannya untuk update frontend!

---

## 6. Testing & Verification

### Test 1: Health Check Endpoint

Buka browser atau gunakan curl untuk test health endpoint:

**Via Browser**:

```
https://pilahpintar-backend.onrender.com/api/health
```

**Via PowerShell/Terminal**:

```powershell
curl https://pilahpintar-backend.onrender.com/api/health
```

**Expected Response**:

```json
{
  "success": true,
  "message": "PilahPintar API is running",
  "timestamp": "2025-10-15T07:30:00.000Z",
  "environment": "production",
  "database": "connected" ✅
}
```

> ✅ **PENTING**: `"database": "connected"` harus muncul!

### Test 2: Check Deployment Status

Di Render Dashboard:

1. Klik nama service **"pilahpintar-backend"**
2. Lihat status indicator di atas:
   - ✅ **Green dot**: Service running
   - 🔴 **Red dot**: Service failed
3. Check **"Metrics"** tab untuk resource usage
4. Check **"Logs"** tab untuk application logs

### Test 3: MongoDB Connection

Dari logs, cari line berikut:

```
📦 MongoDB connected successfully
🚀 PilahPintar API server running on port 3000
```

---

## 7. Update Frontend

### Step 1: Update Frontend Environment Variables

1. **Buka Vercel Dashboard** frontend project:

   ```
   https://vercel.com/your-username/frontend/settings/environment-variables
   ```

2. **Edit atau Add** variable `REACT_APP_API_URL_PRODUCTION`:

   ```
   Key: REACT_APP_API_URL_PRODUCTION
   Value: https://pilahpintar-backend.onrender.com/api
   ```

   > **Note**: Tambahkan `/api` di akhir URL!

3. **Save** environment variable

### Step 2: Redeploy Frontend

1. Masuk ke tab **"Deployments"**
2. Klik **"..."** (3 dots) di deployment teratas
3. Klik **"Redeploy"**
4. Tunggu ~30 detik

### Step 3: Test Full Integration

Setelah frontend redeploy selesai:

1. **Buka frontend**: https://frontend-gules-xi-70.vercel.app

2. **Test Upload Foto** (Smart Sort):

   - Kunjungi: `/smart-sort`
   - Upload foto sampah
   - ✅ Harus berhasil tanpa error "Network Error"

3. **Test Google OAuth**:

   - Kunjungi: `/login`
   - Klik "Login dengan Google"
   - ✅ Harus redirect dan login berhasil

4. **Test Reset Password**:
   - Kunjungi: `/forgot-password`
   - Masukkan email
   - ✅ Harus terkirim email reset

---

## 8. Troubleshooting

### ❌ Problem: Database Disconnected

**Symptoms**:

```json
{
  "database": "disconnected"
}
```

**Solutions**:

1. **Check Environment Variables**:

   - Pastikan `MONGODB_URI` ter-set dengan benar
   - Tidak ada typo atau spasi extra
   - Connection string lengkap dengan credentials

2. **Check MongoDB Atlas Network Access**:

   - Login ke MongoDB Atlas
   - **Network Access** → Add `0.0.0.0/0` (allow all)
   - Atau add Render IP addresses

3. **Check MongoDB Atlas Database Access**:

   - **Database Access** → User `Vercel-Admin-PilahPintar` ada
   - Password benar
   - User punya read/write access

4. **Restart Service**:
   - Render Dashboard → **Manual Deploy** → **Deploy latest commit**

### ❌ Problem: Build Failed

**Symptoms**:

```
Build failed with exit code 1
```

**Solutions**:

1. **Check Build Logs**:

   - Baca error message di logs
   - Common issues: missing dependencies, syntax errors

2. **Verify `package.json`**:

   ```json
   {
     "scripts": {
       "start": "node src/app.js"
     }
   }
   ```

3. **Check Node Version**:
   - Render uses Node 18+ by default
   - Add `engines` to package.json if needed:
   ```json
   {
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

### ❌ Problem: Service Keeps Restarting

**Symptoms**:

- Service shows "Live" then "Deploying" repeatedly
- Logs show crash errors

**Solutions**:

1. **Check Application Logs**:

   - Look for error messages
   - Common: MongoDB connection timeout, missing env vars

2. **Increase Health Check Timeout**:

   - Render Settings → **Health Check Path**: `/api/health`
   - Set timeout to 30 seconds

3. **Check Memory Usage**:
   - Free tier has 512MB RAM limit
   - Monitor "Metrics" tab

### ❌ Problem: CORS Errors

**Symptoms**:

```
Access to fetch at ... has been blocked by CORS policy
```

**Solutions**:

1. **Update CORS_ORIGIN**:

   - Pastikan CORS_ORIGIN sama dengan frontend URL
   - No trailing slash

2. **Check app.js CORS config**:
   ```javascript
   app.use(
     cors({
       origin: process.env.CORS_ORIGIN,
       credentials: true,
     })
   );
   ```

### ❌ Problem: 404 Not Found

**Symptoms**:

```
Cannot GET /api/health
```

**Solutions**:

1. **Check Root Directory**:

   - Pastikan Root Directory = `backend`
   - Bukan `./backend` atau `/backend`

2. **Check Start Command**:
   - Should be `npm start`
   - NOT `node app.js` (unless your file structure different)

---

## 9. Post-Deployment Configuration

### Custom Domain (Optional)

1. **Render Dashboard** → Your service
2. Click **"Settings"**
3. Scroll to **"Custom Domains"**
4. Add your domain (e.g., `api.pilahpintar.site`)
5. Update DNS records as instructed
6. Wait for SSL certificate provisioning

### Auto-Deploy from GitHub

Already enabled! Every push to `main` branch will trigger redeploy.

To disable:

1. **Settings** → **Build & Deploy**
2. Toggle **"Auto-Deploy"** off

### Scaling (Paid Plans)

Free tier limitations:

- ❌ Service spins down after 15 minutes of inactivity
- ❌ First request after spin down is slow (~30 seconds)
- ✅ 750 hours/month free

To keep service always on:

1. Upgrade to **Starter Plan** ($7/month)
2. Service stays running 24/7
3. No cold starts

---

## 10. Monitoring & Maintenance

### View Logs

1. **Render Dashboard** → Your service
2. Click **"Logs"** tab
3. Real-time logs streaming
4. Filter by log level: Info, Warning, Error

### Monitor Performance

1. Click **"Metrics"** tab
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

### Health Checks

Render automatically monitors:

- HTTP health check every 30 seconds
- Auto-restart if service fails
- Email notifications for failures

---

## 11. Backup & Rollback

### Manual Backup

Backend code already backed up di GitHub!

### Rollback to Previous Deployment

1. **Render Dashboard** → **Events** tab
2. Find previous successful deployment
3. Click **"Rollback to this version"**
4. Confirm rollback

---

## 📋 Quick Reference

### Essential URLs

| Resource         | URL                                                 |
| ---------------- | --------------------------------------------------- |
| Render Dashboard | https://dashboard.render.com                        |
| Backend Service  | https://pilahpintar-backend.onrender.com            |
| Health Check     | https://pilahpintar-backend.onrender.com/api/health |
| MongoDB Atlas    | https://cloud.mongodb.com                           |
| GitHub Repo      | https://github.com/ibnuhabibr/pilahpintar           |

### Essential Commands

```bash
# Test health endpoint
curl https://pilahpintar-backend.onrender.com/api/health

# Test upload endpoint (with auth)
curl -X POST https://pilahpintar-backend.onrender.com/api/upload/classify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg"
```

### Environment Variables Quick Copy

```env
MONGODB_URI=mongodb+srv://Vercel-Admin-PilahPintar:nv7xQsEDlAorZbf5@pilahpintar.ldoobvd.mongodb.net/pilahpintar?retryWrites=true&w=majority
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

---

## 🎉 Selesai!

Backend PilahPintar sekarang sudah running di Render.com dengan:

- ✅ Persistent MongoDB connection
- ✅ Auto-deploy from GitHub
- ✅ Free SSL certificate
- ✅ Health monitoring
- ✅ Zero downtime deployments
- ✅ Ready untuk production!

**Selamat! Backend Anda sudah live!** 🚀

---

## 📞 Support

Jika ada masalah:

1. Check logs di Render Dashboard
2. Check MongoDB Atlas network access
3. Verify environment variables
4. Test health endpoint
5. Review troubleshooting section di atas

---

**Tutorial ini dibuat untuk**: PilahPintar Backend Deployment
**Platform**: Render.com
**Date**: October 2025
**Version**: 1.0

---

## Changelog

- **v1.0** (Oct 2025): Initial tutorial created
  - Complete step-by-step guide
  - Troubleshooting section
  - Monitoring & maintenance guide
