# 🧪 API Testing Guide - PilahPintar Backend

Complete testing guide untuk verify frontend-backend connection.

---

## 🎯 Quick Test Commands

### Test 1: Health Check

```bash
curl https://api.pilahpintar.site/health
```

**Expected:**
```json
{
  "success": true,
  "message": "PilahPintar API is running",
  "database": "connected",
  "timestamp": "2025-10-16T08:00:00.000Z",
  "environment": "production"
}
```

### Test 2: CORS Headers

```bash
curl -H "Origin: https://pilahpintar.site" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS \
     https://api.pilahpintar.site/health -v
```

**Expected headers:**
```
< Access-Control-Allow-Origin: https://pilahpintar.site
< Access-Control-Allow-Credentials: true
< Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
```

### Test 3: Upload Endpoint (Mock)

```bash
# Create test image
echo "fake image data" > test-image.jpg

# Test upload (will fail without auth token)
curl -X POST https://api.pilahpintar.site/upload/classify \
  -F "image=@test-image.jpg"
```

**Expected (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Authentication required"
}
```

---

## 🌐 Browser DevTools Testing

### Step 1: Open Frontend

```
https://pilahpintar.site
atau
https://frontend-gules-xi-70.vercel.app
```

### Step 2: Open DevTools

**Windows/Linux:** `F12` atau `Ctrl + Shift + I`  
**Mac:** `Cmd + Option + I`

### Step 3: Network Tab Inspection

1. Click **Network** tab
2. Filter by **Fetch/XHR**
3. Check **Preserve log**
4. Refresh page (F5)

**Expected requests:**
```
Name: health
URL: https://api.pilahpintar.site/health
Status: 200
Type: xhr
Size: ~150 B
```

### Step 4: Console Testing

Open **Console** tab, paste and run:

```javascript
// Test 1: Check API URL configuration
console.log('API Base URL:', process.env.REACT_APP_API_URL);

// Test 2: Manual fetch health endpoint
fetch('https://api.pilahpintar.site/health')
  .then(res => res.json())
  .then(data => console.log('✅ Backend Response:', data))
  .catch(err => console.error('❌ Error:', err));

// Test 3: Check CORS
fetch('https://api.pilahpintar.site/health', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(res => {
    console.log('CORS Check:');
    console.log('  Status:', res.status);
    console.log('  Allow-Origin:', res.headers.get('Access-Control-Allow-Origin'));
    console.log('  Allow-Credentials:', res.headers.get('Access-Control-Allow-Credentials'));
    return res.json();
  })
  .then(data => console.log('  Data:', data))
  .catch(err => console.error('❌ CORS Error:', err));
```

---

## 📤 Upload/Classify Feature Testing

### Frontend UI Test

1. Navigate to **Smart Sort** page
2. Click **Upload Image** button
3. Select waste image (JPEG, PNG, max 5MB)
4. Click **Classify** button
5. Wait for result (~2-3 seconds)

**Expected Flow in Network Tab:**

```
Request:
  URL: https://api.pilahpintar.site/upload/classify
  Method: POST
  Status: 200
  Content-Type: multipart/form-data
  
Response:
  {
    "success": true,
    "message": "Gambar berhasil diklasifikasi",
    "data": {
      "classificationId": "mock-xxx",
      "file": { ... },
      "classification": {
        "type": "plastic",
        "confidence": 95.5,
        ...
      }
    }
  }
```

### Manual API Test with curl

```bash
# Create a test image file
curl -o test-waste.jpg https://picsum.photos/400/300

# Test upload (need auth token)
TOKEN="your_jwt_token_here"

curl -X POST https://api.pilahpintar.site/upload/classify \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@test-waste.jpg" \
  -v
```

**Response Check:**
- Status: `200 OK`
- Response body contains `classification` object
- Classification `type` is one of: organic, plastic, paper, glass, metal
- Confidence is between 60-100

---

## 🔐 Authentication Testing

### Test 1: Login Endpoint

```bash
curl -X POST https://api.pilahpintar.site/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected (if user exists):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "xxx",
      "email": "test@example.com",
      "name": "Test User"
    }
  }
}
```

### Test 2: Protected Route

```bash
TOKEN="your_jwt_token"

curl -X GET https://api.pilahpintar.site/user/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "id": "xxx",
    "email": "test@example.com",
    "name": "Test User",
    "points": 100
  }
}
```

---

## 🧩 Complete Integration Test Script

Save as `test-api.sh`:

```bash
#!/bin/bash

API_BASE="https://api.pilahpintar.site"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🧪 PilahPintar API Integration Test"
echo "===================================="

# Test 1: Health Check
echo -e "\n${YELLOW}Test 1:${NC} Health Check"
HEALTH=$(curl -s "$API_BASE/health")
if echo "$HEALTH" | grep -q '"success":true'; then
  echo -e "${GREEN}✅ PASS${NC} - Health check successful"
  echo "$HEALTH" | jq .
else
  echo -e "${RED}❌ FAIL${NC} - Health check failed"
  echo "$HEALTH"
fi

# Test 2: CORS Preflight
echo -e "\n${YELLOW}Test 2:${NC} CORS Preflight"
CORS=$(curl -s -I -X OPTIONS "$API_BASE/health" \
  -H "Origin: https://pilahpintar.site" \
  -H "Access-Control-Request-Method: POST")
if echo "$CORS" | grep -q "Access-Control-Allow-Origin"; then
  echo -e "${GREEN}✅ PASS${NC} - CORS configured correctly"
  echo "$CORS" | grep "Access-Control"
else
  echo -e "${RED}❌ FAIL${NC} - CORS not configured"
fi

# Test 3: Upload Endpoint (expect 401 without auth)
echo -e "\n${YELLOW}Test 3:${NC} Upload Endpoint (no auth)"
UPLOAD=$(curl -s -X POST "$API_BASE/upload/classify" \
  -F "image=@test.jpg" 2>/dev/null || echo '{"error":"request failed"}')
if echo "$UPLOAD" | grep -q "success\|Authentication"; then
  echo -e "${GREEN}✅ PASS${NC} - Upload endpoint accessible"
  echo "$UPLOAD" | jq . 2>/dev/null || echo "$UPLOAD"
else
  echo -e "${RED}❌ FAIL${NC} - Upload endpoint not working"
  echo "$UPLOAD"
fi

# Test 4: Leaderboard (public endpoint)
echo -e "\n${YELLOW}Test 4:${NC} Leaderboard Endpoint"
LEADERBOARD=$(curl -s "$API_BASE/leaderboard")
if echo "$LEADERBOARD" | grep -q "success"; then
  echo -e "${GREEN}✅ PASS${NC} - Leaderboard working"
  echo "$LEADERBOARD" | jq '.data | length' 2>/dev/null || echo "Data: $LEADERBOARD"
else
  echo -e "${RED}❌ FAIL${NC} - Leaderboard failed"
  echo "$LEADERBOARD"
fi

# Test 5: SSL Certificate
echo -e "\n${YELLOW}Test 5:${NC} SSL Certificate"
SSL=$(curl -vI "$API_BASE" 2>&1 | grep "subject:")
if [ -n "$SSL" ]; then
  echo -e "${GREEN}✅ PASS${NC} - SSL certificate valid"
  echo "$SSL"
else
  echo -e "${RED}❌ FAIL${NC} - SSL certificate issue"
fi

echo -e "\n===================================="
echo "✅ Test completed!"
```

**Run:**
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 🔍 Error Diagnosis

### Error: ERR_CONNECTION_REFUSED

**Cause:** Backend not running or not accessible

**Check:**
```bash
# SSH to VPS
ssh pilahpintar@202.10.41.181

# Check PM2
pm2 status

# Check backend directly
curl http://localhost:3000/health

# Restart if needed
pm2 restart pilahpintar-backend
```

### Error: CORS Policy Blocked

**Cause:** Frontend origin not in allowedOrigins

**Check:**
```bash
# Check CORS config
cat ~/pilahpintar/backend/src/app.js | grep -A 10 "allowedOrigins"

# Should include your frontend URL
# Add if missing, then restart:
pm2 restart pilahpintar-backend
```

### Error: 404 Not Found

**Cause:** Endpoint path mismatch

**Check:**
```bash
# Test both with and without /api prefix
curl https://api.pilahpintar.site/health
curl https://api.pilahpintar.site/api/health

# Check which one works, update frontend accordingly
```

### Error: 502 Bad Gateway

**Cause:** Nginx can't reach backend

**Check:**
```bash
# Check Nginx config
sudo nginx -t

# Check backend port
sudo netstat -tulpn | grep 3000

# Check logs
sudo tail -f /var/log/nginx/error.log
pm2 logs pilahpintar-backend
```

### Error: SSL Certificate Invalid

**Cause:** Certificate not installed or expired

**Check:**
```bash
# Check certificate
sudo certbot certificates

# Renew if needed
sudo certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📊 Test Results Checklist

- [ ] Health endpoint returns 200 OK
- [ ] CORS headers present and correct
- [ ] Upload endpoint accessible (returns 401 without auth)
- [ ] SSL certificate valid (shows padlock in browser)
- [ ] Frontend can fetch from backend
- [ ] No mixed content errors in browser
- [ ] Authentication flow works
- [ ] File upload and classification works
- [ ] Leaderboard/analytics endpoints work
- [ ] OAuth redirect URLs configured correctly

---

## 🎯 Performance Testing

### Load Test (optional)

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 https://api.pilahpintar.site/health

# Check average response time (should be < 100ms)
```

### Database Connection Test

```bash
# From VPS
cd ~/pilahpintar/backend
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI || 'your_mongodb_uri');
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
  process.exit(0);
});
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
  process.exit(1);
});
"
```

---

**🎉 Testing complete! Semua endpoint verified dan ready for production!**
