# 🎯 QUICK FIX SUMMARY

## Masalah Anda:

1. ❌ **Google OAuth** - Login/signup stuck di callback
2. ❌ **Password Reset** - Selalu kadaluarsa (endpoint tidak ada)

---

## ✅ SOLUSI CEPAT

### **PRIORITAS 1: DEBUG GOOGLE OAUTH** 🔍

Tolong lakukan ini dan share hasilnya:

1. **Buka** https://pilahpintar.site
2. **F12** → **Console** tab
3. **Klik** "Login with Google"
4. **Screenshot** semua error di Console
5. **F12** → **Network** tab → Filter: `oauth`
6. **Screenshot** request yang gagal

**Test di Console browser:**

```javascript
fetch("https://api.pilahpintar.site/health")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

---

### **PRIORITAS 2: FIX PASSWORD RESET** 🔧

**SSH ke VPS:**

```bash
ssh pilahpintar@202.10.41.181
cd ~/pilahpintar-backend

# Install package
npm install @getbrevo/brevo

# Edit auth routes
nano src/routes/auth.js
```

**Copy code dari file:** `auth-password-reset-endpoints.js`

**Paste di `src/routes/auth.js` SEBELUM `module.exports`**

**Edit User model:**

```bash
nano src/models/User.js
```

**Tambahkan fields dari file:** `user-model-update.js`

**Update .env:**

```bash
nano .env
```

**Tambahkan:**

```bash
BREVO_API_KEY=your_brevo_api_key
FRONTEND_URL=https://pilahpintar.site
```

**Restart backend:**

```bash
pm2 restart pilahpintar-backend
pm2 logs pilahpintar-backend --lines 50
```

**Test:**

```bash
# Test forgot-password
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"your_email@example.com"}'

# Should return: {"success":true,"message":"Password reset email sent..."}
```

---

## 📁 FILES READY:

1. ✅ `COMPLETE_FIX_GUIDE.md` - Full detailed guide
2. ✅ `auth-password-reset-endpoints.js` - Code untuk auth.js
3. ✅ `user-model-update.js` - Code untuk User.js
4. ✅ `fix-password-reset-backend.sh` - Automation script

---

## 🆘 BUTUH INFO DARI ANDA:

**Untuk OAuth:**

- Screenshot Console errors
- Screenshot Network tab
- Hasil test fetch() di browser

**Untuk Password Reset:**

- Apakah sudah punya Brevo API key?
- Sudah siap SSH ke VPS?

---

**Mau mulai dari mana?** 🚀
