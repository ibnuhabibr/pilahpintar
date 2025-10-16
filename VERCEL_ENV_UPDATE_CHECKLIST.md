# ✅ Update Frontend Environment Variables - Vercel

## 🎯 Status Backend

✅ **Backend VPS FULLY WORKING:**
- Health: `https://api.pilahpintar.site/health` → 200 OK
- OAuth: `https://api.pilahpintar.site/auth/oauth` → 200 OK
- Upload: `https://api.pilahpintar.site/upload/classify` → Ready
- DNS: Correct (202.10.41.181)
- SSL: Working (HTTPS)

**Sekarang tinggal update frontend untuk connect ke backend VPS!**

---

## 📋 STEP-BY-STEP UPDATE VERCEL

### **STEP 1: Login ke Vercel Dashboard**

1. **Buka:** https://vercel.com/dashboard
2. **Login** dengan akun GitHub
3. **Find project:** `frontend-gules-xi-70` atau cari "pilahpintar"

---

### **STEP 2: Navigate to Environment Variables**

1. **Click project:** `frontend-gules-xi-70`
2. **Click tab:** `Settings` (di top navigation)
3. **Sidebar left:** Click `Environment Variables`

---

### **STEP 3: Update API URL Variables**

**Variable 1: `REACT_APP_API_URL`**

1. **Find:** `REACT_APP_API_URL` in the list
2. **Click:** Edit (pencil icon) atau three dots → Edit
3. **Change value:**

```
Old Value (Vercel backend):
❌ https://pilahpintar-backend.vercel.app
❌ https://pilahpintar-backend.vercel.app/api

New Value (VPS backend):
✅ https://api.pilahpintar.site
```

4. **Select environments:**
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Click:** Save

---

**Variable 2: `REACT_APP_API_URL_PRODUCTION` (jika ada)**

1. **Find:** `REACT_APP_API_URL_PRODUCTION`
2. **Click:** Edit
3. **Change value:**

```
Old Value:
❌ https://pilahpintar-backend.vercel.app/api

New Value:
✅ https://api.pilahpintar.site
```

4. **Select:** ✅ Production
5. **Click:** Save

---

**Variable 3: `REACT_APP_BACKEND_URL` (jika ada)**

1. **Find:** `REACT_APP_BACKEND_URL` atau `VITE_API_URL`
2. **Update to:** `https://api.pilahpintar.site`
3. **Save**

---

**Variable 4: `NEXT_PUBLIC_API_URL` (jika pakai Next.js)**

1. **Find:** `NEXT_PUBLIC_API_URL`
2. **Update to:** `https://api.pilahpintar.site`
3. **Save**

---

### **STEP 4: Verify All Variables**

**Expected final configuration:**

```
REACT_APP_API_URL = https://api.pilahpintar.site
REACT_APP_API_URL_PRODUCTION = https://api.pilahpintar.site
REACT_APP_FRONTEND_URL = https://pilahpintar.site
REACT_APP_SUPABASE_URL = https://xnrlkxvbqkdjoecfesdd.supabase.co
REACT_APP_SUPABASE_ANON_KEY = (existing value - don't change)
REACT_APP_GOOGLE_CLIENT_ID = (existing value - don't change)
```

**Screenshot variables sebelum save** (untuk backup!)

---

### **STEP 5: Redeploy Frontend**

**Method 1: Via Vercel Dashboard**

1. **Click tab:** `Deployments`
2. **Find:** Latest deployment (paling atas)
3. **Click:** Three dots (⋯) next to deployment
4. **Select:** `Redeploy`
5. **Modal popup:** Click `Redeploy` button
6. **Wait:** ~2-5 minutes for build complete

**You'll see:**
- ⏳ Building... (yellow)
- ✅ Ready (green checkmark) - Done!

---

**Method 2: Via Git Push**

```bash
# Di Windows PowerShell, dari project folder
cd frontend

# Make small change (trigger rebuild)
echo "# Updated $(date)" >> README.md

# Commit and push
git add README.md
git commit -m "chore: trigger redeploy with new env vars"
git push origin main

# Vercel will auto-deploy
```

---

### **STEP 6: Wait for Deployment**

**Check deployment status:**

1. **Vercel Dashboard → Deployments**
2. **Latest deployment status:**
   - ⏳ `Queued` → `Building` → `Running Checks`
   - ✅ `Ready` (green) - Deployment successful!

**Time:** Usually 2-3 minutes

**Deployment URL:**
- Production: `https://pilahpintar.site`
- Also available: `https://www.pilahpintar.site`
- Vercel URL: `https://frontend-gules-xi-70.vercel.app`

---

### **STEP 7: Clear Browser Cache**

**Before testing, clear cache:**

**Chrome/Edge:**
1. Press `Ctrl + Shift + Delete`
2. Select: `Cached images and files`
3. Time range: `All time`
4. Click: `Clear data`

**Or Hard Refresh:**
- Windows: `Ctrl + Shift + R` atau `Ctrl + F5`
- Mac: `Cmd + Shift + R`

---

## 🧪 TESTING CHECKLIST

### **Test 1: Verify API URL in Browser**

1. **Open:** https://pilahpintar.site
2. **Press:** `F12` (DevTools)
3. **Console tab**, run:

```javascript
console.log('API URL:', process.env.REACT_APP_API_URL);
// Expected output: https://api.pilahpintar.site
```

**If still shows old URL:** Hard refresh (`Ctrl + Shift + R`)

---

### **Test 2: Health Check Request**

**In Console, run:**

```javascript
fetch('https://api.pilahpintar.site/health')
  .then(r => r.json())
  .then(d => console.log('✅ Backend Health:', d))
  .catch(e => console.error('❌ Error:', e));
```

**Expected output:**

```javascript
✅ Backend Health: {
  success: true,
  message: "PilahPintar API is running",
  database: "connected"
}
```

---

### **Test 3: Google OAuth Flow**

1. **Homepage:** Click `Login with Google`
2. **Google login page:** Select account
3. **Consent screen:** Click `Continue`
4. **Redirect to:** `/auth/callback`
5. **Check DevTools → Network tab:**

```
Request: POST https://api.pilahpintar.site/auth/oauth
Status: 200 OK ✅
Response: {success: true, token: "...", user: {...}}
```

6. **Expected result:**
   - ✅ Toast: "Login berhasil!"
   - ✅ Redirect to: `/dashboard`
   - ✅ User logged in
   - ✅ Avatar/name displayed

---

### **Test 4: Upload Image**

1. **Navigate to:** Smart Sort / Upload page
2. **Upload:** Waste image (JPEG/PNG, max 5MB)
3. **Click:** Classify button
4. **Check Network tab:**

```
Request: POST https://api.pilahpintar.site/upload/classify
Status: 200 OK ✅
Response: {success: true, data: {classification: {...}}}
```

5. **Expected:**
   - ✅ Classification result displayed
   - ✅ Waste type, confidence shown
   - ✅ No errors in console

---

### **Test 5: Email Login (Already Working)**

1. **Login page:** Enter email + password
2. **Click:** Login
3. **Expected:** Login successful ✅

---

## 🚨 TROUBLESHOOTING

### Issue: "API URL still shows old value"

**Solution:**
1. Hard refresh: `Ctrl + Shift + R`
2. Clear all browser data
3. Close and reopen browser
4. Check Vercel deployment status (must be green ✅)

---

### Issue: "CORS error in browser"

**Check CORS headers:**

```javascript
fetch('https://api.pilahpintar.site/health', {
  method: 'OPTIONS',
  headers: {
    'Origin': 'https://pilahpintar.site',
    'Access-Control-Request-Method': 'POST'
  }
})
.then(r => {
  console.log('CORS headers:', r.headers.get('Access-Control-Allow-Origin'));
});
```

**Expected:** `Access-Control-Allow-Origin: https://pilahpintar.site`

**If not working:**
```bash
# SSH to VPS
ssh pilahpintar@202.10.41.181

# Check CORS config
cat ~/pilahpintar/backend/src/app.js | grep -A 10 "allowedOrigins"

# Should include:
# "https://pilahpintar.site"
# "https://www.pilahpintar.site"
# "https://frontend-gules-xi-70.vercel.app"

# Restart backend
pm2 restart pilahpintar-backend
```

---

### Issue: "Mixed Content error"

**Symptoms:** `Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource 'http://...'`

**Cause:** Frontend trying to access `http://api.pilahpintar.site` (not HTTPS)

**Solution:**
- Verify `REACT_APP_API_URL` starts with `https://` (not `http://`)
- Redeploy frontend
- Clear browser cache

---

### Issue: "OAuth still stuck at callback"

**Check Console logs:**

```
F12 → Console tab

Expected logs:
=== Auth Callback Starting ===
Session data: {...}
Backend response: {success: true, ...}
✅ Login berhasil!
```

**If error:**
1. Check Network tab → `auth/oauth` request
2. Status code (should be 200)
3. Response body
4. Share error message

---

## 📊 VERIFICATION SUMMARY

After completing all steps, verify:

- [ ] Vercel env vars updated (`REACT_APP_API_URL` = `https://api.pilahpintar.site`)
- [ ] Frontend redeployed (Deployment status: ✅ Ready)
- [ ] Browser cache cleared
- [ ] Health check works in browser console
- [ ] Google OAuth login successful
- [ ] Upload image works
- [ ] Email login works (already working)
- [ ] No CORS errors in console
- [ ] No 404 errors on API endpoints

---

## 🎯 EXPECTED FINAL STATE

**Frontend (Vercel):**
```
https://pilahpintar.site → ✅ Working
https://www.pilahpintar.site → ✅ Working
https://frontend-gules-xi-70.vercel.app → ✅ Working
```

**Backend (VPS):**
```
https://api.pilahpintar.site/health → ✅ 200 OK
https://api.pilahpintar.site/auth/oauth → ✅ 200 OK
https://api.pilahpintar.site/upload/classify → ✅ 200 OK
```

**Features:**
```
✅ Google OAuth login
✅ Email login
✅ Image upload & classification
✅ User dashboard
✅ Leaderboard
✅ Analytics
```

---

## 📞 QUICK COMMANDS

**Check Vercel deployment status (CLI):**

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Check deployments
vercel ls

# Get deployment URL
vercel inspect
```

**Test backend from terminal:**

```powershell
# Health check
curl https://api.pilahpintar.site/health

# OAuth test
curl -Method POST -Uri "https://api.pilahpintar.site/auth/oauth" -ContentType "application/json" -Body '{"email":"test@gmail.com","name":"Test User","provider":"google","providerId":"test123"}'
```

---

## 🎉 NEXT STEPS AFTER SUCCESSFUL DEPLOY

1. **Monitor PM2 logs:**
   ```bash
   ssh pilahpintar@202.10.41.181
   pm2 logs pilahpintar-backend --lines 50
   ```

2. **Setup password reset** (follow `FIX_OAUTH_PASSWORD_RESET.md`)

3. **Test all features:**
   - User registration
   - Google OAuth
   - Email login
   - Upload & classify
   - Leaderboard
   - Analytics
   - Profile update

4. **Production optimizations:**
   - Setup monitoring
   - Enable Nginx caching
   - Setup automated backups
   - SSL certificate auto-renewal (already setup)

---

**🚀 Mulai update Vercel environment variables sekarang!**

**Estimasi waktu:** 5-10 menit total
- Update env vars: 2 min
- Redeploy: 3 min
- Testing: 5 min

**Let me know setelah redeploy selesai, dan kita test Google OAuth!** 🎯
