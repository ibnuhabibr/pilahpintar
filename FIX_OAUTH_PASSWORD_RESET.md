# 🔐 Fix Google OAuth & Password Reset Issues

## 🎯 Status Update

✅ **Upload gambar** - BERHASIL!  
⚠️ **Google OAuth** - Stuck di callback URL  
❌ **Password Reset** - Token selalu kadaluarsa

---

## 🔍 Problem 1: Google OAuth Stuck

### **Symptoms:**
- URL stuck di: `https://www.pilahpintar.site/auth/callback#access_token=...`
- Spinner terus berputar "Memproses login..."
- Console error di browser DevTools

### **Root Cause Analysis:**

Ada 2 kemungkinan:

1. **Frontend tidak bisa hubungi backend OAuth endpoint**
   - URL backend salah (masih ke Vercel lama?)
   - CORS issue
   
2. **Supabase session tidak ter-parse dengan benar**
   - Token di URL hash (`#access_token=...`) tidak di-extract
   - `supabase.auth.getSession()` return null

---

### **🔧 SOLUSI 1: Debug OAuth Flow**

**STEP 1: Check Browser Console**

1. Buka: https://www.pilahpintar.site
2. Login dengan Google
3. **F12** → Console tab
4. Lihat di callback page, cari output:

```
=== Auth Callback Starting ===
URL: https://www.pilahpintar.site/auth/callback#access_token=...
Session data: { ... }
User found: { email: "...", ... }
Backend response: { ... }
```

**Share output console error jika ada!**

---

**STEP 2: Verify Backend API URL di Frontend**

Check environment variable Vercel:

1. https://vercel.com/dashboard
2. Select project: `frontend-gules-xi-70`
3. Settings → Environment Variables
4. Check `REACT_APP_API_URL`

**Expected value:**
```
https://api.pilahpintar.site
```

**Jika masih `https://pilahpintar-backend.vercel.app`, UBAH dan redeploy!**

---

**STEP 3: Test Backend OAuth Endpoint**

Di VPS, test endpoint berfungsi:

```bash
# SSH to VPS
ssh pilahpintar@202.10.41.181

# Test OAuth endpoint
curl -X POST http://localhost:3000/auth/oauth \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@gmail.com",
    "name": "Test User",
    "provider": "google",
    "providerId": "test123"
  }'
```

**Expected response:**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id": "...",
    "email": "test@gmail.com",
    ...
  }
}
```

**Jika 404 atau error, backend routing belum ter-update!** Run deploy lagi:

```bash
cd ~/pilahpintar/backend
git pull origin main
pm2 restart pilahpintar-backend
```

---

**STEP 4: Check CORS Configuration**

Pastikan backend allow frontend origin:

```bash
# Di VPS
cat ~/pilahpintar/backend/src/app.js | grep -A 10 "allowedOrigins"
```

**Should include:**
```javascript
const allowedOrigins = [
  "https://pilahpintar.site",
  "https://www.pilahpintar.site",
  "https://frontend-gules-xi-70.vercel.app",
  ...
];
```

---

### **🔧 SOLUSI 2: Update Supabase Redirect URLs**

Supabase perlu tahu kemana redirect setelah OAuth:

1. **Login:** https://supabase.com/dashboard
2. **Select project:** pilahpintar  
3. **Authentication → URL Configuration**

**Add these redirect URLs:**

```
https://pilahpintar.site/auth/callback
https://www.pilahpintar.site/auth/callback
https://frontend-gules-xi-70.vercel.app/auth/callback
```

**Site URL:**
```
https://pilahpintar.site
```

4. **Save**

---

### **🔧 SOLUSI 3: Update Frontend Callback (Advanced)**

Jika masih stuck, update callback handler untuk lebih robust:

**File:** `frontend/src/pages/AuthCallback.js`

Tambahkan fallback untuk extract token dari URL hash:

```javascript
useEffect(() => {
  const handleAuthCallback = async () => {
    try {
      console.log("=== Auth Callback Starting ===");
      console.log("URL:", window.location.href);
      console.log("Hash:", window.location.hash);

      // Try getting session from Supabase
      let { data, error } = await supabase.auth.getSession();
      
      // Fallback: parse hash manually if no session
      if (!data?.session && window.location.hash) {
        console.log("No session, trying to set session from URL...");
        
        // Supabase will automatically handle hash params
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try again after delay
        const result = await supabase.auth.getSession();
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error("Supabase session error:", error);
        throw error;
      }

      console.log("Session data:", data);

      if (data.session && data.session.user) {
        // ... rest of code
      }
    } catch (error) {
      console.error("Auth callback error:", error);
      toast.error("Login gagal: " + error.message);
      navigate("/login");
    }
  };

  const timer = setTimeout(handleAuthCallback, 1500); // Increase delay
  return () => clearTimeout(timer);
}, [navigate, checkAuthStatus]);
```

---

## 🔐 Problem 2: Password Reset Token Kadaluarsa

### **Symptoms:**
- User request password reset
- Email diterima
- Click link → "Token sudah kadaluarsa"

### **Root Cause:**

Password reset endpoint **BELUM DIIMPLEMENTASI** di backend!

File `backend/src/routes/auth.js` tidak ada endpoint:
- `POST /auth/forgot-password` - Request reset
- `POST /auth/reset-password` - Reset dengan token

---

### **🔧 SOLUSI: Implement Password Reset**

**STEP 1: Add Reset Password Endpoints**

SSH ke VPS dan edit `auth.js`:

```bash
ssh pilahpintar@202.10.41.181
cd ~/pilahpintar/backend
nano src/routes/auth.js
```

**Tambahkan di akhir file (sebelum `module.exports`):**

```javascript
// @route   POST /auth/forgot-password
// @desc    Request password reset email
// @access  Public
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { email } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if user exists (security)
        return res.status(200).json({
          success: true,
          message: "If email exists, reset link has been sent",
        });
      }

      // Generate reset token (valid for 1 hour)
      const resetToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      // Save token to user (optional, for validation)
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
      await user.save();

      // Send email (if Brevo configured)
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      
      // TODO: Implement email sending with Brevo
      // For now, return token in response (DEV ONLY)
      console.log("Reset URL:", resetUrl);

      res.status(200).json({
        success: true,
        message: "Password reset link sent to email",
        // DEV ONLY - Remove in production!
        resetUrl: resetUrl,
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   POST /auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password",
  [
    body("token")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Token is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: errors.array()[0].msg,
        });
      }

      const { token, newPassword } = req.body;

      // Verify token
      let decoded;
      try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Token invalid or expired",
        });
      }

      // Find user
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if token matches and not expired
      if (
        user.resetPasswordToken !== token ||
        user.resetPasswordExpires < Date.now()
      ) {
        return res.status(400).json({
          success: false,
          message: "Token invalid or expired",
        });
      }

      // Update password
      user.password = newPassword; // Will be hashed by pre-save middleware
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);
```

**Save:** `Ctrl + X`, `Y`, `Enter`

---

**STEP 2: Update User Model (Add Reset Fields)**

```bash
nano src/models/User.js
```

**Tambahkan fields di schema:**

```javascript
const userSchema = new mongoose.Schema(
  {
    // ... existing fields ...
    
    // Password reset
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);
```

**Save dan exit**

---

**STEP 3: Restart Backend**

```bash
pm2 restart pilahpintar-backend
pm2 logs pilahpintar-backend --lines 20
```

---

**STEP 4: Test Password Reset**

```bash
# Request reset
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# Should return:
# {
#   "success": true,
#   "message": "Password reset link sent to email",
#   "resetUrl": "https://pilahpintar.site/reset-password?token=..."
# }

# Copy token dari resetUrl, lalu:
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token":"TOKEN_DARI_URL",
    "newPassword":"newpassword123"
  }'

# Should return:
# {"success":true,"message":"Password reset successfully"}
```

---

## ✅ Quick Fixes Checklist

### For Google OAuth:
- [ ] Check browser console for errors
- [ ] Verify `REACT_APP_API_URL` in Vercel = `https://api.pilahpintar.site`
- [ ] Test backend `/auth/oauth` endpoint works
- [ ] Update Supabase redirect URLs
- [ ] Redeploy frontend if env vars changed

### For Password Reset:
- [ ] Add forgot-password endpoint to `auth.js`
- [ ] Add reset-password endpoint to `auth.js`
- [ ] Update User model with reset fields
- [ ] Restart PM2 backend
- [ ] Test reset flow

---

## 📞 Debug Commands

```bash
# Check backend logs for OAuth errors
ssh pilahpintar@202.10.41.181
pm2 logs pilahpintar-backend --lines 100

# Test OAuth endpoint
curl -X POST https://api.pilahpintar.site/auth/oauth \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","name":"Test","provider":"google","providerId":"123"}'

# Check CORS
curl -H "Origin: https://pilahpintar.site" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://api.pilahpintar.site/auth/oauth -v
```

---

**Tolong share:**
1. **Browser console output** dari `/auth/callback` page
2. **Error message** yang muncul (screenshot atau copy text)
3. **Vercel env vars** - apa value `REACT_APP_API_URL`?

Saya akan bantu fix OAuth issue! 🎯
