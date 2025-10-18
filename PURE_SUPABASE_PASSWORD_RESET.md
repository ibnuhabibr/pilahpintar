# ✅ PURE SUPABASE PASSWORD RESET - Deployment Guide

## **🎯 WHAT WE DID:**

### **Removed from Backend:**

- ❌ Removed `crypto` import
- ❌ Removed `/auth/forgot-password` endpoint
- ❌ Removed `/auth/reset-password` endpoint
- ❌ Removed `resetPasswordToken` from User model
- ❌ Removed `resetPasswordExpires` from User model
- ❌ No more Brevo dependency!

### **Improved Frontend:**

- ✅ Better error handling for expired links
- ✅ Redirect to `/forgot-password` when link expired
- ✅ User-friendly error messages
- ✅ Auto-redirect after 2 seconds

### **Result:**

- ✅ **Pure Supabase auth flow**
- ✅ **Simpler codebase**
- ✅ **No external email service needed**

---

## **🚀 DEPLOYMENT STEPS**

### **BACKEND (VPS) - Quick Pull**

```bash
# SSH ke VPS
ssh pilahpintar@202.10.41.181

# Navigate
cd ~/pilahpintar-backend

# Pull latest code
git pull origin main

# Verify changes
grep -c "forgot-password" src/routes/auth.js
# Should return: 0 (no matches - endpoints removed!)

grep -c "resetPasswordToken" src/models/User.js
# Should return: 0 (field removed!)

# Restart PM2
pm2 restart pilahpintar-backend

# Check status
pm2 status

# Verify health
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

✅ **Backend updated!**

---

### **FRONTEND (Vercel) - Auto-Deploy**

Vercel should **auto-deploy** karena ada push baru ke `main` branch!

**Check deployment:**

1. **Open:** https://vercel.com/dashboard
2. **Project:** `frontend-gules-xi-70`
3. **Deployments** tab
4. **Wait for:** ✅ **Ready** status (2-3 minutes)

**Or manual redeploy:**

1. Latest deployment → ⋮ → **Redeploy**
2. ❌ **UNCHECK** "Use existing Build Cache"
3. **Redeploy**
4. Wait for ✅ **Ready**

✅ **Frontend deployed!**

---

## **🧪 TESTING - Password Reset Flow**

### **STEP 1: Request Reset Link**

1. **Clear browser cache** or use **Incognito** (`Ctrl + Shift + N`)
2. **Open:** https://pilahpintar.site/forgot-password
3. **Enter email:** your-email@gmail.com
4. **Click:** "Kirim Link Reset"

**Expected:**

- ✅ Success message: "Email reset password telah dikirim..."
- ✅ No errors in console

---

### **STEP 2: Check Email**

**Look for email from Supabase:**

- **From:** noreply@mail.app.supabase.io (or your custom SMTP if configured)
- **Subject:** "Reset Your Password" or similar
- **Content:** Contains reset link

**Check spam folder if not in inbox!**

---

### **STEP 3: Click Reset Link**

**Click link in email**

**Scenarios:**

#### **Scenario A: Valid Link (within 1 hour)**

- ✅ Redirects to: `https://pilahpintar.site/reset-password#access_token=...&type=recovery`
- ✅ Page shows: "Reset Password" form
- ✅ No error messages
- ✅ Console shows: "Recovery session set successfully"

**Action:**

- Enter new password (min 6 characters)
- Confirm password
- Click "Reset Password"
- ✅ **Success!** "Password berhasil diubah!"
- ✅ Auto-redirect to `/login`
- ✅ **Login with new password works!**

#### **Scenario B: Expired Link (after 1 hour)**

- ⚠️ Redirects to: `https://pilahpintar.site/reset-password#error=access_denied&error_code=otp_expired`
- ⚠️ Toast shows: "Link reset password sudah kadaluarsa. Silakan request link baru."
- ⚠️ Auto-redirect to `/forgot-password` after 2 seconds
- ✅ User can request new link

**Action:**

- Request new reset link
- Use new link within 1 hour

---

## **🔧 SUPABASE CONFIGURATION**

### **Check Email Template (Optional Customization)**

1. **Login:** https://supabase.com/dashboard
2. **Project:** pilahpintar
3. **Authentication** → **Email Templates**
4. **Select:** "Reset Password"

**Current template should have:**

- Reset link button
- Link expiry notice (1 hour)
- Security message

**Optional:** Customize with PilahPintar branding!

---

### **Check URL Configuration**

1. **Authentication** → **URL Configuration**

**Verify these are set:**

```
Site URL: https://pilahpintar.site

Redirect URLs:
- https://pilahpintar.site/reset-password
- https://www.pilahpintar.site/reset-password
- https://pilahpintar.site/auth/callback
- https://www.pilahpintar.site/auth/callback
```

✅ **Should already be configured from OAuth setup!**

---

### **Check Email Settings**

1. **Project Settings** → **Authentication**

**Email Auth settings:**

- ✅ Enable email provider: ON
- ✅ Confirm email: OFF (optional, based on your needs)
- ✅ Secure email change: ON (recommended)

**Rate limits (Free tier):**

- Max 4 emails per hour during development
- More in production

**For production (optional):**

- Setup custom SMTP: Project Settings → SMTP
- Use your own email server for branded emails

---

## **✅ VERIFICATION CHECKLIST**

### **Backend:**

- [ ] SSH to VPS ✅
- [ ] git pull successful ✅
- [ ] Brevo endpoints removed (grep returns 0) ✅
- [ ] PM2 restarted ✅
- [ ] Health check passed ✅

### **Frontend:**

- [ ] Vercel deployment Ready ✅
- [ ] ResetPassword.js updated ✅
- [ ] Error handling improved ✅

### **Supabase:**

- [ ] Email template configured ✅
- [ ] Redirect URLs correct ✅
- [ ] Email auth enabled ✅

### **Testing:**

- [ ] Request reset link from /forgot-password ✅
- [ ] Receive email from Supabase ✅
- [ ] Click link (valid) → reset page shows ✅
- [ ] Enter new password → success ✅
- [ ] Login with new password ✅
- [ ] Test expired link → proper error + redirect ✅

---

## **🆘 TROUBLESHOOTING**

### **Issue 1: Link expired immediately**

**Cause:** You waited too long or clicked old link

**Solution:**

- Request new link from /forgot-password
- Use link within 1 hour
- Check system time is correct

---

### **Issue 2: Email not received**

**Check:**

1. Spam folder
2. Email address correct
3. Supabase project active
4. Email provider enabled in Supabase

**Supabase Dashboard check:**

- Authentication → Email Templates → "Reset Password" enabled
- No rate limit exceeded (4/hour on free tier)

**Solution:**

- Wait 15 minutes, try again
- Check Supabase logs: Project → Logs → Authentication
- Verify email in Supabase user list

---

### **Issue 3: "Invalid recovery token"**

**Cause:** Tokens in URL malformed or missing

**Check Console:**

- F12 → Console
- Look for: "Access token: Present" and "Type: recovery"

**If "Not found":**

- Request new reset link
- Don't modify URL manually
- Use link directly from email

---

### **Issue 4: Password update fails**

**Check:**

- Password minimum 6 characters
- Password and confirm match
- Console for specific error

**Common errors:**

- "New password should be different" → Use different password
- "Session expired" → Request new link

---

## **📊 FLOW DIAGRAM**

```
USER FORGOT PASSWORD
         │
         ▼
┌─────────────────────┐
│ /forgot-password     │
│ Enter email          │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│ Supabase Auth        │
│ resetPasswordForEmail│
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│ Email sent           │
│ (Supabase SMTP)      │
└──────────┬───────────┘
           │
           ▼
┌─────────────────────┐
│ User clicks link     │
│ in email             │
└──────────┬───────────┘
           │
           ▼
     Check expiry?
           │
   ┌───────┴────────┐
   │                │
   ▼                ▼
VALID           EXPIRED
   │                │
   ▼                ▼
/reset-password  Error page
Enter new pass   → /forgot-password
   │
   ▼
Supabase.auth
.updateUser()
   │
   ▼
PASSWORD UPDATED! ✅
   │
   ▼
Redirect /login
```

---

## **🎉 SUCCESS CRITERIA**

**Test passed when:**

1. ✅ Request reset link → Email received within 1 minute
2. ✅ Click valid link → Reset page loads
3. ✅ Enter new password → Success message
4. ✅ Login with new password → Dashboard accessible
5. ✅ Click expired link → Proper error + redirect to forgot-password

---

## **📞 QUICK COMMANDS**

### **VPS:**

```bash
# SSH
ssh pilahpintar@202.10.41.181

# Update
cd ~/pilahpintar-backend
git pull origin main
pm2 restart pilahpintar-backend
pm2 status
```

### **Vercel:**

```
https://vercel.com/dashboard
→ frontend-gules-xi-70
→ Deployments
→ Wait for Ready ✅
```

### **Supabase:**

```
https://supabase.com/dashboard
→ pilahpintar
→ Authentication
→ Email Templates / URL Configuration
```

---

**🎯 Silakan deploy dan test sekarang!**

**Kabari saya hasil testing:**

1. Email received? ✅/❌
2. Reset page loads? ✅/❌
3. Password updated? ✅/❌
4. Login works? ✅/❌
5. Expired link handled properly? ✅/❌

**Good luck!** 🚀
