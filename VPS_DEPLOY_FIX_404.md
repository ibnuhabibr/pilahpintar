# 🚀 Deploy Backend Code Terbaru ke VPS

## Problem yang Terjadi

Frontend request ke `https://api.pilahpintar.site/upload/classify` mendapat **404 Not Found**.

**Root Cause:** Backend di VPS masih pakai **code lama** yang belum ada **dual routing support** (support both `/api/upload/classify` dan `/upload/classify`).

---

## ✅ Solusi: Deploy Code Terbaru

### **STEP 1: SSH ke VPS**

```bash
ssh pilahpintar@202.10.41.181
```

### **STEP 2: Jalankan Deploy Script**

```bash
# Navigate to project root
cd ~/pilahpintar

# Download deploy script dari GitHub
curl -o deploy.sh https://raw.githubusercontent.com/ibnuhabibr/pilahpintar/main/deploy-to-vps.sh

# Make executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

**Atau manual deployment:**

```bash
# 1. Navigate to backend
cd ~/pilahpintar/backend

# 2. Backup current version
cp -r ~/pilahpintar/backend ~/pilahpintar/backend-backup-$(date +%Y%m%d-%H%M%S)

# 3. Pull latest code
git pull origin main

# 4. Install dependencies
npm install --production

# 5. Restart PM2
pm2 restart pilahpintar-backend --update-env

# 6. Check status
pm2 status
pm2 logs pilahpintar-backend --lines 20
```

### **STEP 3: Verify Deployment**

```bash
# Test health endpoint
curl http://localhost:3000/health

# Expected: {"success":true,"database":"connected"}

# Test upload endpoint (both routes)
curl -X POST http://localhost:3000/upload/classify
curl -X POST http://localhost:3000/api/upload/classify

# Both should return same response (401 or require multipart)
```

### **STEP 4: Test dari Frontend**

1. **Open browser:** https://pilahpintar.site atau https://frontend-gules-xi-70.vercel.app
2. **F12** → Network tab
3. **Upload waste image**
4. **Check request:**
   - URL: `https://api.pilahpintar.site/upload/classify`
   - Status: Should be **200 OK** (not 404!)
   - Response: Classification result

---

## 🔍 What Changed in Backend Code

### File: `backend/src/app.js`

**Before (Old Code on VPS):**

```javascript
// Only /api prefix routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
// ... other /api routes
```

**After (New Code in GitHub):**

```javascript
// Use routes with /api prefix (for path-based routing)
app.use("/api/auth", authRoutes);
app.use("/api/classification", classificationRoutes);
app.use("/api/user", userRoutes);
app.use("/api/waste-map", wasteMapRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/community", communityRoutes);
app.use("/api/upload", uploadRoutes);

// Also support root routes (for subdomain api.pilahpintar.site)
app.use("/auth", authRoutes);
app.use("/classification", classificationRoutes);
app.use("/user", userRoutes);
app.use("/waste-map", wasteMapRoutes);
app.use("/education", educationRoutes);
app.use("/community", communityRoutes);
app.use("/upload", uploadRoutes);
```

**Result:**

- ✅ `https://api.pilahpintar.site/upload/classify` → **WORKS**
- ✅ `https://api.pilahpintar.site/api/upload/classify` → **WORKS**
- ✅ Backward compatible dengan existing frontend code

---

## 📊 Expected Behavior After Deploy

### Before (404 Error):

```
Frontend Request: POST https://api.pilahpintar.site/upload/classify
Backend Response: 404 Not Found (Route not found)
```

### After (Success):

```
Frontend Request: POST https://api.pilahpintar.site/upload/classify
Backend Response: 200 OK
{
  "success": true,
  "message": "Gambar berhasil diklasifikasi",
  "data": { ... classification result ... }
}
```

---

## 🚨 Troubleshooting

### Issue: Git pull fails

```bash
# Check git status
cd ~/pilahpintar/backend
git status

# Stash local changes if any
git stash

# Pull again
git pull origin main

# Apply stashed changes
git stash pop
```

### Issue: PM2 restart fails

```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs pilahpintar-backend --lines 50

# Delete and restart
pm2 delete pilahpintar-backend
pm2 start ecosystem.config.js

# Or use npm script
npm run start:prod
```

### Issue: Health check still fails

```bash
# Check if backend process running
pm2 status

# Check if port 3000 is listening
sudo netstat -tulpn | grep 3000

# Check backend logs
pm2 logs pilahpintar-backend --lines 100

# Check environment variables
pm2 env 0  # Replace 0 with actual PM2 ID
```

### Issue: Still getting 404 from frontend

**Possible causes:**

1. **DNS not propagated yet** - `nslookup api.pilahpintar.site` should return `202.10.41.181`
2. **Frontend still using old URL** - Check Vercel env vars `REACT_APP_API_URL`
3. **Nginx not proxying correctly** - Check Nginx config and logs
4. **Backend code not updated** - Verify by checking file modification time:
   ```bash
   ls -la ~/pilahpintar/backend/src/app.js
   cat ~/pilahpintar/backend/src/app.js | grep "Also support root routes"
   ```

---

## ✅ Success Checklist

After deployment, verify these:

- [ ] `git pull` completed successfully
- [ ] `npm install` completed without errors
- [ ] PM2 status shows **online**
- [ ] Health check returns `{"success":true}`
- [ ] Both `/upload/classify` and `/api/upload/classify` routes work
- [ ] Frontend can upload images successfully
- [ ] No 404 errors in browser Network tab
- [ ] PM2 logs show no errors

---

## 📞 Quick Commands Reference

```bash
# SSH to VPS
ssh pilahpintar@202.10.41.181

# Deploy latest code
cd ~/pilahpintar/backend && git pull && npm install && pm2 restart pilahpintar-backend

# Check status
pm2 status

# View logs (live)
pm2 logs pilahpintar-backend

# View logs (last 50 lines)
pm2 logs pilahpintar-backend --lines 50 --nostream

# Test health
curl http://localhost:3000/health

# Test via domain
curl https://api.pilahpintar.site/health

# Restart if needed
pm2 restart pilahpintar-backend --update-env
```

---

**🎯 Deploy sekarang dan 404 error akan hilang!**
