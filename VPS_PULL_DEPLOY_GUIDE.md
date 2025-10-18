# ✅ CODE READY! Panduan Pull & Deploy di VPS

## **STATUS:**

✅ **Local (Windows):**

- User.js updated (added resetPasswordToken & resetPasswordExpires)
- auth.js updated (added crypto import + 2 endpoints)
- Committed & pushed to GitHub (commit: befc4c6)

✅ **VPS:**

- Package @getbrevo/brevo already installed
- Backup files already created

---

## **🚀 NEXT: Pull & Configure di VPS (PuTTY)**

### **STEP 1: SSH Connect**

```
Host: 202.10.41.181
Port: 22
Login: pilahpintar
```

---

### **STEP 2: Navigate & Pull**

```bash
cd ~/pilahpintar-backend

# Check current status
git status

# Pull latest code from GitHub
git pull origin main
```

**Expected output:**

```
Updating 1656acd..befc4c6
Fast-forward
 backend/src/models/User.js  |   6 +++
 backend/src/routes/auth.js  | 189 ++++++++++++++++++
 2 files changed, 195 insertions(+)
```

✅ **Code updated!**

---

### **STEP 3: Verify Changes**

**Check User.js:**

```bash
grep -A 5 "resetPasswordToken" src/models/User.js
```

**Expected output:**

```javascript
resetPasswordToken: {
  type: String,
},
resetPasswordExpires: {
  type: Date,
},
```

**Check auth.js has new endpoints:**

```bash
grep "forgot-password\|reset-password" src/routes/auth.js
```

**Expected output:**

```
router.post("/forgot-password", async (req, res) => {
router.post("/reset-password", async (req, res) => {
```

✅ **Files correct!**

---

### **STEP 4: Update .env File**

```bash
nano .env
```

**Scroll to bottom and ADD these 2 lines:**

```env
BREVO_API_KEY=your-brevo-api-key-here
FRONTEND_URL=https://pilahpintar.site
```

**⚠️ IMPORTANT: Get Brevo API Key**

1. **Buka browser** (Windows)
2. Login: https://app.brevo.com
3. Settings → SMTP & API → API Keys
4. Create new: "PilahPintar Backend"
5. **Copy key** (starts with `xkeysib-...`)
6. **Paste** di .env (replace `your-brevo-api-key-here`)

**Example:**

```env
BREVO_API_KEY=xkeysib-abc123def456xyz789...
FRONTEND_URL=https://pilahpintar.site
```

**Save & exit:**

- `Ctrl + O` (Write)
- `Enter` (Confirm)
- `Ctrl + X` (Exit)

---

### **STEP 5: Verify .env**

```bash
# Check values (without showing full API key)
cat .env | grep BREVO | cut -c1-30
cat .env | grep FRONTEND_URL
```

**Expected output:**

```
BREVO_API_KEY=xkeysib-abc123...
FRONTEND_URL=https://pilahpintar.site
```

✅ **.env configured!**

---

### **STEP 6: Restart PM2**

```bash
# Restart with new env variables
pm2 restart pilahpintar-backend --update-env

# Wait 5 seconds
sleep 5

# Check status
pm2 status
```

**Expected output:**

```
┌─────┬────────────────────────┬─────────┬─────────┬──────────┐
│ id  │ name                   │ status  │ restart │ uptime   │
├─────┼────────────────────────┼─────────┼─────────┼──────────┤
│ 0   │ pilahpintar-backend    │ online  │ 0       │ 5s       │
└─────┴────────────────────────┴─────────┴─────────┴──────────┘
```

✅ **Backend restarted!**

---

### **STEP 7: Test Health Check**

```bash
curl http://localhost:3000/health
```

**Expected output:**

```json
{
  "success": true,
  "message": "PilahPintar API is running",
  "database": "connected"
}
```

✅ **Backend healthy!**

---

### **STEP 8: Test Forgot Password**

```bash
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL@gmail.com"}'
```

**⚠️ Replace `YOUR_EMAIL@gmail.com` with your actual email!**

**Expected output:**

```json
{
  "success": true,
  "message": "Reset code sent to your email"
}
```

**Check your email inbox!** 📧 You should receive:

- Email from "PilahPintar"
- Subject: "Reset Password - PilahPintar"
- 6-digit code

✅ **Email sent!**

---

### **STEP 9: Test Reset Password**

**Use the 6-digit code from email:**

```bash
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"123456","password":"TestPassword123"}'
```

**⚠️ Replace:**

- `123456` with code from email
- `TestPassword123` with your test password

**Expected output:**

```json
{
  "success": true,
  "message": "Password has been reset successfully. You can now login with your new password."
}
```

✅ **Password reset works!**

---

### **STEP 10: View Logs (Optional)**

```bash
# View live logs
pm2 logs pilahpintar-backend --lines 50
```

**What to look for:**

```
✅ Password reset requested for: user@email.com
✅ Reset code: 123456
✅ Reset email sent successfully to: user@email.com
✅ Password reset successful for: user@email.com
```

**Press `Ctrl + C` to exit logs.**

---

### **STEP 11: Test from Production URL**

```bash
# Test via public URL
curl -X POST https://api.pilahpintar.site/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL@gmail.com"}'
```

**Expected:** Same success response!

✅ **Production endpoint works!**

---

## **🎉 FINAL VERIFICATION**

### **Test Complete Flow from Frontend:**

1. **Open browser:** https://pilahpintar.site/forgot-password
2. **Enter your email** (that you tested with)
3. **Click "Send Reset Code"**
4. **Check email** for 6-digit code
5. **Enter code** and new password
6. **Click "Reset Password"**
7. **Go to login:** https://pilahpintar.site/login
8. **Login with NEW password** ✅

---

## **📋 COMPLETION CHECKLIST**

- [ ] SSH connected to VPS ✅
- [ ] `git pull origin main` successful ✅
- [ ] Files verified (User.js + auth.js updated) ✅
- [ ] .env updated (BREVO_API_KEY + FRONTEND_URL) ✅
- [ ] PM2 restarted ✅
- [ ] Health check passed ✅
- [ ] Forgot password tested (local) ✅
- [ ] Email received with reset code ✅
- [ ] Reset password tested (local) ✅
- [ ] Production URL tested ✅
- [ ] **Frontend test successful** ✅

---

## **🆘 TROUBLESHOOTING**

### **Issue: git pull conflicts**

```bash
# Stash local changes
git stash

# Pull again
git pull origin main

# Reapply if needed
git stash pop
```

### **Issue: PM2 restart error**

```bash
# View error logs
pm2 logs pilahpintar-backend --err --lines 50

# Check for syntax errors or missing dependencies
```

### **Issue: Email not sending**

```bash
# Verify Brevo API key
cat .env | grep BREVO_API_KEY

# Test API key
curl -X GET https://api.brevo.com/v3/account \
  -H "api-key: YOUR_BREVO_API_KEY"

# Should return account info, not 401
```

### **Issue: Reset token expired**

```bash
# Request new code (token expires in 1 hour)
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"YOUR_EMAIL@gmail.com"}'
```

---

## **📞 QUICK COMMAND REFERENCE**

```bash
# Navigation
cd ~/pilahpintar-backend

# Git
git status
git pull origin main
git log --oneline -5

# Edit
nano .env

# PM2
pm2 status
pm2 restart pilahpintar-backend --update-env
pm2 logs pilahpintar-backend
pm2 logs pilahpintar-backend --err

# Testing
curl http://localhost:3000/health
curl -X POST http://localhost:3000/auth/forgot-password -H "Content-Type: application/json" -d '{"email":"test@gmail.com"}'
curl -X POST http://localhost:3000/auth/reset-password -H "Content-Type: application/json" -d '{"token":"123456","password":"newPass123"}'
```

---

**🎯 Silakan mulai dari STEP 1 di PuTTY!**

**Kabari saya:**

- ✅ Setelah git pull sukses
- ✅ Setelah PM2 restart
- ✅ Setelah test forgot password (email terkirim)
- ✅ Setelah test reset password
- 🎉 Setelah test dari frontend berhasil!

**Good luck!** 🚀
