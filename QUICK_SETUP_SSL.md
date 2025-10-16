# 🚀 Quick Setup: Domain & SSL untuk Backend VPS

**Estimasi waktu:** 30-45 menit (termasuk DNS propagation)

---

## ✅ Prerequisites

- [x] VPS running (202.10.41.181)
- [x] Backend deployed dengan PM2
- [x] Domain `pilahpintar.site` sudah ada
- [x] SSH access ke VPS

---

## 📋 Step-by-Step Setup

### **STEP 1: Setup DNS Record (5 menit)**

1. **Login ke Registrar Domain** (tempat beli `pilahpintar.site`)

2. **DNS Management** → Add new record:

   ```
   Type: A
   Name: api
   Value: 202.10.41.181
   TTL: Auto (atau 3600)
   ```

3. **Save changes**

4. **Verify DNS propagation:**

   ```bash
   # Windows PowerShell
   nslookup api.pilahpintar.site

   # Expected output:
   # Name: api.pilahpintar.site
   # Address: 202.10.41.181
   ```

   **Atau via browser:** https://dnschecker.org → `api.pilahpintar.site`

5. **Tunggu 5-30 menit** jika belum propagated

---

### **STEP 2: Configure Nginx di VPS (5 menit)**

```bash
# 1. SSH ke VPS
ssh pilahpintar@202.10.41.181

# 2. Backup config lama
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# 3. Edit Nginx config
sudo nano /etc/nginx/sites-available/default
```

**Replace semua isi file dengan:**

```nginx
server {
    listen 80;
    server_name api.pilahpintar.site;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Proxy to Node.js backend (support both /api prefix and root)
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Preserve host and client info
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint (no logging)
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }
}
```

```bash
# 4. Test config
sudo nginx -t

# Expected: syntax is ok

# 5. Reload Nginx
sudo systemctl reload nginx

# 6. Test HTTP access (before SSL)
curl http://api.pilahpintar.site/health

# Expected: {"success":true,"database":"connected"}
```

---

### **STEP 3: Install SSL Certificate (5 menit)**

```bash
# 1. Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx -y

# 2. Generate SSL certificate
sudo certbot --nginx -d api.pilahpintar.site
```

**Certbot Prompts:**

```
Enter email address: your-email@gmail.com
(A)gree/(C)ancel: A
Share email with EFF (Y/N): N
Redirect HTTP to HTTPS:
  1: No redirect
  2: Redirect
Select: 2
```

**Expected output:**

```
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/api.pilahpintar.site/fullchain.pem
Successfully deployed certificate for api.pilahpintar.site
Congratulations! You have successfully enabled HTTPS
```

```bash
# 3. Test HTTPS
curl https://api.pilahpintar.site/health

# Expected: {"success":true,"database":"connected"}

# 4. Test SSL cert
curl -vI https://api.pilahpintar.site 2>&1 | grep "subject:"

# Expected: subject: CN=api.pilahpintar.site

# 5. Test auto-renewal
sudo certbot renew --dry-run

# Expected: Congratulations, all simulated renewals succeeded
```

---

### **STEP 4: Update Backend Environment (3 menit)**

```bash
# 1. Edit .env
cd ~/pilahpintar/backend
nano .env
```

**Update these lines:**

```bash
# Frontend URLs
FRONTEND_URL=https://pilahpintar.site
CORS_ORIGIN=https://pilahpintar.site,https://www.pilahpintar.site,https://frontend-gules-xi-70.vercel.app

# Google OAuth
GOOGLE_OAUTH_REDIRECT_URI=https://pilahpintar.site/auth/callback
```

**Save:** `Ctrl + X`, `Y`, `Enter`

```bash
# 2. Restart backend
pm2 restart pilahpintar-backend --update-env

# 3. Check logs
pm2 logs pilahpintar-backend --lines 20

# Expected:
# 📦 MongoDB connected successfully
# 🚀 PilahPintar API server running on port 3000
```

---

### **STEP 5: Update Google OAuth (5 menit)**

1. **Buka:** https://console.cloud.google.com
2. **Select project:** PilahPintar
3. **Menu:** APIs & Services → Credentials
4. **Click:** OAuth 2.0 Client ID

**Authorized JavaScript origins - TAMBAHKAN:**

```
https://api.pilahpintar.site
https://pilahpintar.site
https://www.pilahpintar.site
https://frontend-gules-xi-70.vercel.app
```

**Authorized redirect URIs - TAMBAHKAN:**

```
https://api.pilahpintar.site/auth/google/callback
https://pilahpintar.site/auth/callback
https://www.pilahpintar.site/auth/callback
https://frontend-gules-xi-70.vercel.app/auth/callback
```

**HAPUS yang pakai IP:**

```
❌ http://202.10.41.181 (DELETE)
❌ http://202.10.41.181/api/auth/google/callback (DELETE)
```

5. **Click Save**

---

### **STEP 6: Update Supabase (3 menit)**

1. **Buka:** https://supabase.com/dashboard
2. **Select project:** pilahpintar
3. **Menu:** Authentication → URL Configuration

**Redirect URLs - TAMBAHKAN:**

```
https://api.pilahpintar.site/auth/callback
https://pilahpintar.site/auth/callback
https://www.pilahpintar.site/auth/callback
https://frontend-gules-xi-70.vercel.app/auth/callback
```

**Site URL:**

```
https://pilahpintar.site
```

4. **Click Save**

---

### **STEP 7: Update Vercel Frontend (5 menit)**

1. **Login:** https://vercel.com/dashboard
2. **Select project:** frontend-gules-xi-70
3. **Menu:** Settings → Environment Variables

**Edit/Add:**

```
Name: REACT_APP_API_URL
Value: https://api.pilahpintar.site
Environments: ✅ Production ✅ Preview ✅ Development
```

```
Name: REACT_APP_API_URL_PRODUCTION
Value: https://api.pilahpintar.site
Environments: ✅ Production
```

4. **Save**
5. **Deployments → Latest → ⋯ → Redeploy**
6. **Wait for build** (~2-5 minutes)

---

### **STEP 8: Complete Testing (5 menit)**

**Test 1: Backend Health (Terminal)**

```bash
curl https://api.pilahpintar.site/health
```

**Expected:**

```json
{
  "success": true,
  "database": "connected",
  "timestamp": "2025-10-16T08:00:00.000Z"
}
```

**Test 2: Frontend Connection (Browser)**

1. Buka: https://frontend-gules-xi-70.vercel.app (atau https://pilahpintar.site)
2. **F12** → Network tab
3. **Upload gambar sampah**
4. Verify request:
   - URL: `https://api.pilahpintar.site/upload/classify` ✅
   - Status: `200 OK` ✅
   - Response: Classification result ✅

**Test 3: CORS (Terminal)**

```bash
curl -H "Origin: https://pilahpintar.site" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.pilahpintar.site/health -v
```

**Expected headers:**

```
Access-Control-Allow-Origin: https://pilahpintar.site
Access-Control-Allow-Credentials: true
```

**Test 4: OAuth Flow (Browser)**

1. Frontend → Click "Login with Google"
2. Select Google account
3. Consent → Allow
4. Redirected to backend → Process auth
5. Redirected to frontend with token
6. User logged in ✅

---

## ✅ Success Checklist

- [x] DNS `api.pilahpintar.site` resolves to `202.10.41.181`
- [x] Nginx configured for subdomain
- [x] SSL certificate installed (Let's Encrypt)
- [x] Backend environment variables updated
- [x] Google OAuth URIs updated
- [x] Supabase redirect URLs updated
- [x] Vercel frontend environment updated
- [x] Frontend redeployed
- [x] Health check works: `https://api.pilahpintar.site/health`
- [x] Upload/classify works from frontend
- [x] CORS headers correct
- [x] OAuth flow works

---

## 🚨 Troubleshooting Quick Reference

### Issue: DNS not propagating

```bash
# Wait 30 minutes, then check again
nslookup api.pilahpintar.site

# Clear DNS cache
ipconfig /flushdns  # Windows
```

### Issue: 502 Bad Gateway

```bash
# Check backend running
pm2 status
pm2 restart pilahpintar-backend

# Check port 3000
sudo netstat -tulpn | grep 3000
```

### Issue: SSL certificate failed

```bash
# Check DNS first
nslookup api.pilahpintar.site

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Retry certbot
sudo certbot --nginx -d api.pilahpintar.site
```

### Issue: CORS error in browser

```bash
# SSH to VPS
ssh pilahpintar@202.10.41.181

# Check CORS config
cat ~/pilahpintar/backend/src/app.js | grep -A 10 "allowedOrigins"

# Should include: https://frontend-gules-xi-70.vercel.app

# Restart backend
pm2 restart pilahpintar-backend
```

### Issue: 404 on endpoints

```bash
# Check backend routes work
curl https://api.pilahpintar.site/health
curl https://api.pilahpintar.site/upload/classify

# Check PM2 logs
pm2 logs pilahpintar-backend --lines 50
```

---

## 📊 Architecture After Setup

```
┌─────────────────────────────────────┐
│   User Browser (HTTPS)              │
└────────────┬────────────────────────┘
             │
             ├──── Static Assets
             │     │
             ↓     ↓
┌────────────────────────────────────────┐
│  FRONTEND (Vercel Global CDN)          │
│  https://pilahpintar.site              │
│  https://frontend-gules-xi-70.vercel   │
└────────────┬───────────────────────────┘
             │
             └──── API Requests
                   │
                   ↓
┌────────────────────────────────────────┐
│  BACKEND VPS (Nginx + SSL)             │
│  https://api.pilahpintar.site          │
│  202.10.41.181:80/443 → localhost:3000 │
└────────────┬───────────────────────────┘
             │
             └──── Database Queries
                   │
                   ↓
┌────────────────────────────────────────┐
│  MONGODB ATLAS (Cloud)                 │
│  pilahpintar.ldoobvd.mongodb.net       │
└────────────────────────────────────────┘
```

---

## 🎯 Next Steps

1. **Monitor:** Setup PM2 monitoring, Nginx logs monitoring
2. **Backup:** Setup automated MongoDB backups
3. **Optimize:** Enable Nginx caching, gzip compression
4. **Security:** Setup fail2ban, firewall rules (UFW)
5. **Custom Domain:** Point `pilahpintar.site` apex to frontend

---

**🎉 Setup Complete! Backend sekarang production-ready dengan HTTPS!**
