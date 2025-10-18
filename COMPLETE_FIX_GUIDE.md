# 🚀 COMPLETE FIX GUIDE - OAuth & Password Reset

**Date:** October 19, 2025
**Status:** Backend OK, Frontend Issues

---

## ✅ BACKEND STATUS CHECK

```bash
# Health Check
curl https://api.pilahpintar.site/health
# Result: ✅ 200 OK, database connected

# DNS Check
nslookup api.pilahpintar.site 8.8.8.8
# Result: ✅ 202.10.41.181 (VPS - CORRECT!)
```

---

## 🔴 MASALAH 1: GOOGLE OAUTH TIDAK BISA LOGIN/SIGNUP

### **Kemungkinan Penyebab:**

1. **CORS Error** - Frontend tidak bisa POST ke backend
2. **Network Error** - Browser tidak bisa reach `api.pilahpintar.site`
3. **Supabase Session Error** - Token tidak ter-extract dari URL
4. **Backend Response Error** - OAuth endpoint error

### **🔍 STEP 1: DIAGNOSTIC (WAJIB!)**

**Buka website dan test:**

1. Buka https://pilahpintar.site (atau www.pilahpintar.site)
2. **F12** → **Console** tab
3. Klik "Login with Google"
4. Tunggu redirect kembali ke `/auth/callback`
5. **SCREENSHOT** semua error di Console
6. **F12** → **Network** tab
7. Filter: ketik `oauth` atau `api.pilahpintar.site`
8. **SCREENSHOT** request yang gagal (klik request → Headers tab)

**SANGAT PENTING: Share screenshot Console + Network!**

---

### **🔧 SOLUSI 1A: Test Endpoint dari Browser**

Buka **Console** di browser (F12) dan paste:

```javascript
// Test apakah frontend bisa hubungi backend
fetch("https://api.pilahpintar.site/health")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);

// Test OAuth endpoint
fetch("https://api.pilahpintar.site/auth/oauth", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "test@example.com",
    name: "Test User",
    provider: "google",
    providerId: "test123",
  }),
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

**Expected hasil:**

```json
// Health check:
{ "success": true, "database": "connected" }

// OAuth:
{ "success": true, "token": "eyJ...", "user": {...} }
```

**Jika error, screenshot error tersebut!**

---

### **🔧 SOLUSI 1B: Cek Environment Variable Frontend**

**Vercel Dashboard:**

1. https://vercel.com/dashboard
2. Project: `frontend-gules-xi-70`
3. **Settings** → **Environment Variables**

**Check values:**

```bash
REACT_APP_API_URL = https://api.pilahpintar.site
REACT_APP_API_URL_PRODUCTION = https://api.pilahpintar.site
REACT_APP_FRONTEND_URL = https://pilahpintar.site
```

**Jika ada yang salah:**

1. Edit variable
2. Apply to: **Production**, **Preview**, **Development** (check all)
3. **Save**
4. **Redeploy** (tanpa cache!)

---

### **🔧 SOLUSI 1C: Force Clean Redeploy**

**Vercel Dashboard:**

1. **Deployments** tab
2. Klik deployment **terbaru**
3. Three dots (⋮) → **Redeploy**
4. **❌ UNCHECK** "Use existing Build Cache"
5. **Redeploy**
6. Tunggu ✅ **Ready** (hijau)

**Setelah redeploy:**

1. **Clear browser cache**: `Ctrl + Shift + Delete` → All time → Cached files
2. Atau test di **Incognito mode**: `Ctrl + Shift + N`

---

### **🔧 SOLUSI 1D: Update Supabase Redirect URLs**

**Supabase Dashboard:**

1. https://supabase.com/dashboard
2. Project: **pilahpintar**
3. **Authentication** → **URL Configuration**

**Add Redirect URLs:**

```
https://pilahpintar.site/auth/callback
https://www.pilahpintar.site/auth/callback
https://frontend-gules-xi-70.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

**Site URL:**

```
https://pilahpintar.site
```

**Save**

---

### **🔧 SOLUSI 1E: Test Manual OAuth Flow**

**Test di PowerShell:**

```powershell
# Test backend OAuth endpoint
$body = @{
    email = "testuser@gmail.com"
    name = "Test User"
    provider = "google"
    providerId = "google123456"
} | ConvertTo-Json

curl.exe -X POST https://api.pilahpintar.site/auth/oauth `
  -H "Content-Type: application/json" `
  -d $body
```

**Expected response:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "testuser@gmail.com",
    "name": "Test User"
  }
}
```

**Jika gagal, share error message!**

---

## 🔴 MASALAH 2: FORGOT PASSWORD & RESET PASSWORD TIDAK BERFUNGSI

### **Root Cause:**

**ENDPOINT TIDAK ADA DI BACKEND!** ❌

Backend Anda **tidak punya** route untuk:

- `POST /auth/forgot-password`
- `POST /auth/reset-password`

Frontend sudah siap (via Supabase), tapi **backend tidak handle reset token**.

---

### **🔧 SOLUSI 2: Implementasi Backend Endpoints**

**File:** `backend/src/routes/auth.js`

Tambahkan endpoint ini (paste di akhir file sebelum `module.exports`):

```javascript
// ============================================
// FORGOT PASSWORD - Send Reset Email
// ============================================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists (security best practice)
      return res.status(200).json({
        success: true,
        message: "If an account exists, a password reset email will be sent.",
      });
    }

    // Generate reset token (valid for 1 hour)
    const crypto = require("crypto");
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Save token to user
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const frontendUrl = process.env.FRONTEND_URL || "https://pilahpintar.site";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    // Send email via Brevo
    const brevo = require("@getbrevo/brevo");
    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
      brevo.TransactionalEmailsApiApiKeys.apiKey,
      process.env.BREVO_API_KEY
    );

    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Reset Password - PilahPintar";
    sendSmtpEmail.to = [{ email: user.email, name: user.name }];
    sendSmtpEmail.sender = {
      name: "PilahPintar",
      email: "noreply@pilahpintar.site",
    };
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #10B981;">Reset Password Anda</h2>
        <p>Halo ${user.name},</p>
        <p>Kami menerima permintaan untuk reset password akun Anda.</p>
        <p>Klik tombol di bawah untuk reset password:</p>
        <a href="${resetUrl}"
           style="display: inline-block; padding: 12px 24px; background-color: #10B981; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Atau copy link ini ke browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #666; font-size: 14px;">Link ini akan kadaluarsa dalam 1 jam.</p>
        <p style="color: #666; font-size: 14px;">Jika Anda tidak meminta reset password, abaikan email ini.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #999; font-size: 12px;">Email otomatis dari PilahPintar</p>
      </div>
    `;

    await apiInstance.sendTransacEmail(sendSmtpEmail);

    res.status(200).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send reset email",
      error: error.message,
    });
  }
});

// ============================================
// RESET PASSWORD - Update with Token
// ============================================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash token to compare with database
    const crypto = require("crypto");
    const resetTokenHash = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: resetTokenHash,
      resetPasswordExpires: { $gt: Date.now() }, // Token not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset token",
      });
    }

    // Hash new password
    const bcrypt = require("bcryptjs");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
});
```

---

### **📝 UPDATE User Model**

**File:** `backend/src/models/User.js`

Tambahkan fields untuk reset token:

```javascript
const userSchema = new mongoose.Schema(
  {
    // ... existing fields ...

    // Add these new fields:
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);
```

---

### **📦 Install Dependencies**

**SSH ke VPS:**

```bash
ssh pilahpintar@202.10.41.181

cd pilahpintar-backend

# Install crypto (built-in) dan brevo
npm install @getbrevo/brevo

# Add Brevo API key to .env
nano .env
```

**Tambahkan di `.env`:**

```bash
BREVO_API_KEY=your_brevo_api_key_here
FRONTEND_URL=https://pilahpintar.site
```

**Restart backend:**

```bash
pm2 restart pilahpintar-backend
pm2 logs pilahpintar-backend
```

---

### **🧪 TEST Reset Password Flow**

**Test forgot-password:**

```powershell
$body = @{
    email = "your_test_email@gmail.com"
} | ConvertTo-Json

curl.exe -X POST https://api.pilahpintar.site/auth/forgot-password `
  -H "Content-Type: application/json" `
  -d $body
```

**Expected response:**

```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

**Check email inbox untuk reset link!**

---

**Test reset-password:**

```powershell
$body = @{
    token = "token_from_email_link"
    password = "newPassword123!"
} | ConvertTo-Json

curl.exe -X POST https://api.pilahpintar.site/auth/reset-password `
  -H "Content-Type: application/json" `
  -d $body
```

**Expected response:**

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

---

## 📋 CHECKLIST LENGKAP

### **OAUTH Issues:**

- [ ] Screenshot Console errors saat login Google
- [ ] Screenshot Network tab (OAuth request)
- [ ] Test `fetch()` dari Console browser
- [ ] Verify Vercel env vars: `REACT_APP_API_URL`
- [ ] Redeploy Vercel tanpa cache
- [ ] Clear browser cache / test Incognito
- [ ] Verify Supabase redirect URLs
- [ ] Test manual OAuth endpoint via curl

### **Password Reset:**

- [ ] SSH ke VPS
- [ ] Update `backend/src/routes/auth.js` (add forgot/reset endpoints)
- [ ] Update `backend/src/models/User.js` (add reset token fields)
- [ ] Install `@getbrevo/brevo` package
- [ ] Add `BREVO_API_KEY` to `.env`
- [ ] Add `FRONTEND_URL` to `.env`
- [ ] `pm2 restart pilahpintar-backend`
- [ ] Test forgot-password endpoint
- [ ] Check email inbox
- [ ] Test reset-password endpoint
- [ ] Login dengan password baru

---

## 🆘 NEXT STEPS

**Prioritas 1: Debug OAuth**

Tolong berikan:

1. **Screenshot Console** saat stuck di callback
2. **Screenshot Network tab** (OAuth request)
3. **Hasil test** `fetch()` dari Console

**Prioritas 2: Implementasi Password Reset**

Saya bisa buatkan script SSH lengkap untuk update backend!

---

**Mana yang mau di-tackle dulu?** 🎯

1. **OAuth** - Butuh info diagnostic dari browser
2. **Password Reset** - Bisa langsung implementasi backend
