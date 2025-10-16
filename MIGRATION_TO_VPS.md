# 🚀 Panduan Migrasi dari Vercel Backend ke VPS

## 📋 Ringkasan Perubahan Arsitektur

### Sebelum (Vercel Backend):

```
Frontend (Vercel) ──> Backend (Vercel Serverless) ──> MongoDB Atlas
```

### Sekarang (VPS Backend):

```
Frontend (Vercel) ──> Backend (VPS 202.10.41.181) ──> MongoDB Atlas
```

---

## ✅ CHECKLIST KONFIGURASI ULANG

### 1. 🌐 VERCEL - Frontend Environment Variables

**Lokasi**: https://vercel.com/your-username/frontend/settings/environment-variables

**Variables yang HARUS DIUBAH:**

| Variable Name                  | Old Value (Vercel Backend)           | New Value (VPS Backend with Domain) |
| ------------------------------ | ------------------------------------ | ----------------------------------- |
| `REACT_APP_API_URL`            | `https://backend-xxx.vercel.app/api` | `https://api.pilahpintar.site`      |
| `REACT_APP_API_URL_PRODUCTION` | `https://backend-xxx.vercel.app/api` | `https://api.pilahpintar.site`      |

**⚠️ CATATAN:** Gunakan `https://api.pilahpintar.site` (dengan SSL), bukan `http://202.10.41.181/api`

**Langkah-langkah:**

1. Login ke Vercel Dashboard
2. Pilih project **frontend** (frontend-gules-xi-70)
3. Settings → Environment Variables
4. Edit kedua variables di atas
5. Pilih **Production**, **Preview**, dan **Development**
6. Save changes
7. **Redeploy frontend** (Deployments → Latest → Redeploy)

**Command untuk redeploy via CLI (opsional):**

```bash
cd frontend
vercel --prod
```

---

## 📍 API ENDPOINTS

### Backend VPS Endpoints

| Endpoint                                       | Method | Purpose                       | Auth Required |
| ---------------------------------------------- | ------ | ----------------------------- | ------------- |
| `https://api.pilahpintar.site/health`          | GET    | Health check & status         | No            |
| `https://api.pilahpintar.site/upload/classify` | POST   | Upload & classify waste image | Yes           |
| `https://api.pilahpintar.site/auth/login`      | POST   | User login                    | No            |
| `https://api.pilahpintar.site/auth/register`   | POST   | User registration             | No            |
| `https://api.pilahpintar.site/auth/google`     | GET    | Google OAuth                  | No            |
| `https://api.pilahpintar.site/leaderboard`     | GET    | User leaderboard              | No            |
| `https://api.pilahpintar.site/analytics`       | GET    | Waste analytics               | No            |

### Upload/Classify Endpoint Details

**URL:** `https://api.pilahpintar.site/upload/classify`
**Method:** POST
**Content-Type:** multipart/form-data
**Authentication:** Required (Bearer token)

**Request Example:**

```bash
curl -X POST https://api.pilahpintar.site/upload/classify \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@photo.jpg"
```

**Response Example:**

```json
{
  "success": true,
  "message": "Gambar berhasil diklasifikasi",
  "data": {
    "classificationId": "mock-1697xxx",
    "file": {
      "url": "/uploads/1697xxx.jpg",
      "originalName": "photo.jpg",
      "size": 245678,
      "mimetype": "image/jpeg"
    },
    "classification": {
      "type": "plastic",
      "confidence": 95.5,
      "suggestions": "Bersihkan botol plastik, lepas label, kumpulkan untuk daur ulang",
      "processedAt": "2025-10-16T10:00:00.000Z"
    }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "File terlalu besar. Pilih gambar yang lebih kecil dari 5MB."
}
```

---

### 2. 🌐 DNS CONFIGURATION - Domain Setup

**Domain**: `pilahpintar.site` (gunakan domain yang sudah ada)

**Strategi**: Subdomain untuk Backend API

```
pilahpintar.site          → Frontend (Vercel)
www.pilahpintar.site      → Frontend (Vercel)
api.pilahpintar.site      → Backend (VPS)
```

**DNS Records di Registrar Domain:**

| Type  | Name/Host | Value/Target         | TTL  | Purpose           |
| ----- | --------- | -------------------- | ---- | ----------------- |
| CNAME | @         | cname.vercel-dns.com | Auto | Frontend (apex)   |
| CNAME | www       | cname.vercel-dns.com | Auto | Frontend (www)    |
| A     | api       | 202.10.41.181        | Auto | Backend API (VPS) |

**Langkah-langkah:**

1. Login ke registrar domain (tempat beli `pilahpintar.site`)
2. DNS Management / DNS Settings
3. Pastikan record untuk frontend sudah ada (CNAME ke Vercel)
4. **Tambahkan A record baru:**
   - Type: `A`
   - Name: `api`
   - Value: `202.10.41.181`
   - TTL: `Auto` atau `3600`
5. Save changes
6. Tunggu DNS propagation (5-30 menit)
7. Cek status: https://dnschecker.org → masukkan `api.pilahpintar.site`

---

### 3. 🗄️ MONGODB ATLAS - Network Access

**Lokasi**: https://cloud.mongodb.com → Network Access

**Yang HARUS DITAMBAHKAN:**

✅ **VPS IP Address sudah ditambahkan**: `202.10.41.181/32`

**Verifikasi:**

1. Login ke MongoDB Atlas
2. Pilih cluster `pilahpintar`
3. Network Access
4. Pastikan ada entry: `202.10.41.181/32` dengan status **Active**

**Yang bisa DIHAPUS (opsional):**

- IP Vercel serverless (biasanya banyak IP dynamic)
- Atau biarkan saja untuk backup

**Database User - Tidak perlu diubah:**

- Username: `Vercel-Admin-PilahPintar`
- Password: `nv7xQsEDlAorZbf5`
- Tetap bisa dipakai untuk VPS

---

### 4. 🔐 GOOGLE OAUTH - Authorized Redirect URIs

**⚠️ PENTING:** Google OAuth **tidak menerima IP address** sebagai redirect URI. **HARUS menggunakan domain.**

**Lokasi**: https://console.cloud.google.com → APIs & Services → Credentials

**OAuth 2.0 Client ID yang perlu diedit:**

**Authorized JavaScript origins:**

```
✅ https://pilahpintar.site (frontend apex domain)
✅ https://www.pilahpintar.site (frontend www subdomain)
✅ https://api.pilahpintar.site (backend API subdomain)
✅ https://frontend-gules-xi-70.vercel.app (Vercel deployment)
⚠️  http://localhost:3000 (development - tetap)
```

**Authorized redirect URIs:**

```
✅ https://pilahpintar.site/auth/callback (frontend domain)
✅ https://www.pilahpintar.site/auth/callback (frontend www)
✅ https://api.pilahpintar.site/auth/google/callback (backend API)
✅ https://frontend-gules-xi-70.vercel.app/auth/callback (Vercel)
⚠️  http://localhost:3000/auth/callback (development - tetap)
```

**JANGAN gunakan IP address (akan error):**
❌ `http://202.10.41.181` - Invalid
❌ `http://202.10.41.181/api/auth/google/callback` - Invalid

**Langkah-langkah:**

1. Login ke Google Cloud Console
2. Pilih project PilahPintar
3. APIs & Services → Credentials
4. Click OAuth 2.0 Client ID
5. Tambahkan URIs di atas
6. Save

---

### 5. 🔑 SUPABASE - Authentication Settings

**Lokasi**: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/auth/url-configuration

**Redirect URLs yang perlu ditambahkan:**

```
✅ https://pilahpintar.site/auth/callback (domain utama)
✅ https://www.pilahpintar.site/auth/callback (www subdomain)
✅ https://api.pilahpintar.site/auth/callback (backend API subdomain)
✅ https://frontend-gules-xi-70.vercel.app/auth/callback (Vercel deployment)
```

**Site URL:**

```
https://pilahpintar.site (domain utama)
```

**Langkah-langkah:**

1. Login ke Supabase Dashboard
2. Pilih project
3. Authentication → URL Configuration
4. Tambahkan redirect URL backend VPS
5. Save

---

### 6. 🔒 SSL CERTIFICATE - Let's Encrypt (GRATIS)

**Setelah DNS propagation selesai**, install SSL certificate untuk `api.pilahpintar.site`:

**SSH ke VPS:**

```bash
ssh pilahpintar@202.10.41.181
```

**Install Certbot:**

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

**Generate SSL Certificate:**

```bash
sudo certbot --nginx -d api.pilahpintar.site
```

**Pilihan saat install:**

1. Email: Masukkan email untuk renewal notifications
2. Terms of Service: `Y` (agree)
3. Share email: `N` (optional)
4. Redirect HTTP to HTTPS: `2` (pilih redirect)

**Certbot akan otomatis:**

- Generate SSL certificate
- Update Nginx configuration
- Setup auto-renewal (setiap 90 hari)

**Test SSL:**

```bash
curl https://api.pilahpintar.site/health
```

**Expected Response:**

```json
{
  "success": true,
  "message": "PilahPintar API is running",
  "database": "connected"
}
```

**Check SSL Grade (opsional):**
https://www.ssllabs.com/ssltest/analyze.html?d=api.pilahpintar.site

---

### 7. 📧 BREVO (Sendinblue) - SMTP Settings

**Tidak perlu diubah** - SMTP tetap sama:

```
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=ibnuhabibr@gmail.com
BREVO_SMTP_PASS=your_smtp_key
BREVO_API_KEY=your_api_key
```

Tetap berfungsi di VPS.

---

### 8. 🔄 CORS CONFIGURATION - Backend VPS

**File**: `backend/src/app.js` (sudah dikonfigurasi)

**Allowed Origins yang sudah ada:**

```javascript
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://frontend-gules-xi-70.vercel.app", // Frontend production
  "https://pilahpintar.vercel.app",
  "https://pilahpintar-beige.vercel.app",
  "https://pilahpintar-frontend.vercel.app",
];
```

✅ Sudah sesuai - tidak perlu diubah.

**Jika nanti punya domain:**

```javascript
"https://pilahpintar.com",
"https://www.pilahpintar.com",
```

---

### 7. 🔧 BACKEND VPS - Environment Variables

**File**: `/root/pilahpintar/backend/.env` atau `~/.env` di VPS

**Sudah dikonfigurasi dengan benar** di `.env.vps`:

```bash
# API Configuration
NODE_ENV=production
PORT=3000
API_VERSION=v1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://Vercel-Admin-PilahPintar:nv7xQsEDlAorZbf5@pilahpintar.ldoobvd.mongodb.net/pilahpintar?retryWrites=true&w=majority&appName=pilahpintar

# Frontend URL (Vercel)
FRONTEND_URL=https://frontend-gules-xi-70.vercel.app
CORS_ORIGIN=https://frontend-gules-xi-70.vercel.app

# JWT Secrets
JWT_SECRET=pilahpintar_jwt_secret_key_2024_super_secure
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=pilahpintar_jwt_refresh_secret_key_2024_super_secure
JWT_REFRESH_EXPIRES_IN=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_OAUTH_REDIRECT_URI=https://frontend-gules-xi-70.vercel.app/auth/callback

# Supabase OAuth
SUPABASE_URL=https://hsjkkpldfmdbjpqacsxd.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Brevo Email
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_SMTP_USER=ibnuhabibr@gmail.com
BREVO_SMTP_PASS=your_smtp_pass
BREVO_API_KEY=your_api_key
FROM_EMAIL=noreply@pilahpintar.com
FROM_NAME=PilahPintar

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

### 8. 🌍 NGINX - Reverse Proxy (VPS)

**File**: `/etc/nginx/sites-available/default`

**Sudah dikonfigurasi:**

```nginx
server {
    listen 80;
    server_name 202.10.41.181;

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

✅ Tidak perlu diubah.

---

## 🧹 CLEANUP - Yang Bisa Dihapus

### 1. **Vercel Backend Project (Opsional)**

**Jika ingin delete backend di Vercel:**

1. Login ke Vercel Dashboard
2. Pilih backend project (jika ada)
3. Settings → General → Delete Project

**Atau biarkan sebagai backup.**

### 2. **Dependencies Vercel (Opsional)**

Di `backend/package.json`, bisa hapus:

```json
{
  "dependencies": {
    "@vercel/functions": "^3.1.3" // Bisa dihapus
  },
  "scripts": {
    "vercel-build": "echo 'Build completed'" // Bisa dihapus
  }
}
```

Run setelah edit:

```bash
cd backend
npm install
```

### 3. **File Vercel Backend**

Bisa dihapus (opsional):

```
backend/vercel.json
backend/api/ (jika ada folder ini)
```

**JANGAN HAPUS** `frontend/vercel.json` - ini untuk frontend!

---

## 🧪 TESTING SETELAH KONFIGURASI

### 1. **Test Backend Health Check**

```bash
curl http://202.10.41.181/api/health
```

**Expected Response:**

```json
{
  "success": true,
  "message": "PilahPintar API is running",
  "timestamp": "2025-10-16T00:00:00.000Z",
  "environment": "production",
  "database": "connected"
}
```

### 2. **Test dari Frontend**

Setelah redeploy frontend Vercel:

1. Buka https://frontend-gules-xi-70.vercel.app
2. Buka Browser DevTools → Network tab
3. Test fitur:

   - ✅ Upload gambar sampah
   - ✅ Login Google OAuth
   - ✅ Register user baru
   - ✅ Password reset
   - ✅ Lihat leaderboard
   - ✅ Lihat analytics

4. Pastikan semua request ke `http://202.10.41.181/api/...`

### 3. **Test CORS**

```bash
curl -H "Origin: https://frontend-gules-xi-70.vercel.app" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     http://202.10.41.181/api/health -v
```

Harus ada response header:

```
Access-Control-Allow-Origin: https://frontend-gules-xi-70.vercel.app
Access-Control-Allow-Credentials: true
```

### 4. **Test Google OAuth Flow**

1. Frontend → Click "Login with Google"
2. Google consent screen muncul
3. Setelah approve → redirect ke backend VPS
4. Backend process authentication
5. Redirect kembali ke frontend dengan token
6. User logged in successfully

### 5. **Test Email (Password Reset)**

1. Frontend → Forgot Password
2. Input email → Submit
3. Cek email inbox
4. Email dari `noreply@pilahpintar.com` (via Brevo)
5. Click reset link → redirect ke frontend
6. Reset password berhasil

---

## 📊 MONITORING

### Check Backend Status

```bash
# SSH ke VPS
ssh pilahpintar@202.10.41.181

# Check PM2 status
pm2 status

# Check logs
pm2 logs pilahpintar-backend --lines 50

# Check memory
pm2 monit

# Check Nginx
sudo systemctl status nginx

# Check Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Check Database Connection

```bash
# Test MongoDB connection dari VPS
cd ~/pilahpintar/backend
node -e "require('./src/config/database.js')"
```

---

## 🚨 TROUBLESHOOTING

### Problem: Frontend masih hit Vercel backend

**Solution:**

1. Cek Vercel environment variables sudah diubah
2. Redeploy frontend (Deployments → Redeploy)
3. Clear browser cache
4. Hard refresh (Ctrl + Shift + R)

### Problem: CORS error di browser

**Solution:**

1. Cek `backend/src/app.js` - allowedOrigins sudah ada frontend URL
2. Restart backend: `pm2 restart pilahpintar-backend`
3. Cek Nginx X-Forwarded-For headers

### Problem: Google OAuth redirect error

**Solution:**

1. Cek Google Console - Authorized redirect URIs
2. Harus ada: `http://202.10.41.181/api/auth/google/callback`
3. Dan: `https://frontend-gules-xi-70.vercel.app/auth/callback`

### Problem: Database connection timeout

**Solution:**

1. Cek MongoDB Atlas Network Access
2. Pastikan `202.10.41.181/32` ada dan Active
3. Test dari VPS: `curl https://pilahpintar.ldoobvd.mongodb.net`

### Problem: Email tidak terkirim

**Solution:**

1. Cek `.env` di VPS - BREVO credentials benar
2. Test SMTP: `telnet smtp-relay.brevo.com 587`
3. Cek Brevo dashboard - quota dan status

---

## 📝 SUMMARY CHECKLIST

- [ ] **Vercel Frontend** - Environment variables updated (`REACT_APP_API_URL`)
- [ ] **Vercel Frontend** - Redeployed
- [ ] **MongoDB Atlas** - VPS IP `202.10.41.181/32` whitelisted
- [ ] **Google OAuth** - Redirect URIs updated dengan VPS URL
- [ ] **Supabase** - Redirect URLs updated dengan VPS URL
- [ ] **Backend VPS** - `.env` configured dan PM2 running
- [ ] **Nginx VPS** - Reverse proxy configured
- [ ] **CORS** - Frontend URL dalam allowedOrigins
- [ ] **Testing** - Health check, upload, OAuth, email works
- [ ] **Monitoring** - PM2 logs, Nginx logs, database connection

---

## 🎯 NEXT STEPS (Opsional)

### 1. Setup Domain & SSL

```bash
# Beli domain (misal: pilahpintar.com)
# Point A record ke 202.10.41.181
# Install SSL certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d pilahpintar.com
```

### 2. Setup Automated Backups

```bash
# MongoDB backup script
# PM2 logs rotation
# Automated deployment script
```

### 3. Performance Optimization

```bash
# Enable Nginx caching
# Enable gzip compression
# CDN for static assets
```

### 4. Security Hardening

```bash
# Firewall (UFW)
# Fail2ban
# SSH key only (disable password)
# Regular security updates
```

---

## 📞 SUPPORT

Jika ada masalah, cek:

1. PM2 logs: `pm2 logs pilahpintar-backend`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. MongoDB Atlas logs
4. Vercel deployment logs

**VPS Details:**

- IP: 202.10.41.181
- User: pilahpintar
- Backend Port: 3000
- Nginx Port: 80

**Good Luck! 🚀**
