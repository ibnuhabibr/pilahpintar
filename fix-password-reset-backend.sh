#!/bin/bash

# ===========================================
# FIX PASSWORD RESET - Backend Implementation
# ===========================================

echo "🚀 Starting Password Reset Backend Fix..."
echo ""

# 1. Navigate to backend directory
cd ~/pilahpintar-backend || { echo "❌ Backend directory not found!"; exit 1; }

echo "✅ In backend directory: $(pwd)"
echo ""

# 2. Backup auth.js file
echo "📦 Creating backup of auth.js..."
cp src/routes/auth.js src/routes/auth.js.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"
echo ""

# 3. Install required package
echo "📦 Installing @getbrevo/brevo package..."
npm install @getbrevo/brevo
echo "✅ Package installed"
echo ""

# 4. Check if .env has required variables
echo "🔍 Checking .env file..."
if grep -q "BREVO_API_KEY" .env; then
    echo "✅ BREVO_API_KEY already exists in .env"
else
    echo "⚠️  BREVO_API_KEY not found in .env"
    echo "Please add manually: BREVO_API_KEY=your_api_key_here"
fi

if grep -q "FRONTEND_URL" .env; then
    echo "✅ FRONTEND_URL already exists in .env"
else
    echo "⚠️  Adding FRONTEND_URL to .env..."
    echo "" >> .env
    echo "# Frontend URL for password reset links" >> .env
    echo "FRONTEND_URL=https://pilahpintar.site" >> .env
    echo "✅ FRONTEND_URL added"
fi
echo ""

# 5. Display current PM2 status
echo "📊 Current PM2 status:"
pm2 list
echo ""

# 6. Instructions for manual code update
echo "⚠️  MANUAL ACTION REQUIRED ⚠️"
echo ""
echo "You need to manually add the forgot-password and reset-password endpoints."
echo "Please edit the file: src/routes/auth.js"
echo ""
echo "Run: nano src/routes/auth.js"
echo ""
echo "Or copy the code from: COMPLETE_FIX_GUIDE.md"
echo ""
echo "After adding the code, also update src/models/User.js to add:"
echo "  - resetPasswordToken: String"
echo "  - resetPasswordExpires: Date"
echo ""
echo "Then run: pm2 restart pilahpintar-backend"
echo ""

# 7. Test endpoints after manual update
read -p "Press ENTER after you've updated the code and restarted PM2..."

echo ""
echo "🧪 Testing forgot-password endpoint..."
curl -X POST http://localhost:3000/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "🧪 Testing reset-password endpoint..."
curl -X POST http://localhost:3000/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"token":"dummy_token","password":"newPassword123"}' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

echo "📋 Check PM2 logs for any errors:"
echo "pm2 logs pilahpintar-backend --lines 50"
echo ""

echo "✅ Script completed!"
echo "Next steps:"
echo "1. Verify endpoints return proper responses (not 404)"
echo "2. Test with real email via frontend"
echo "3. Check email inbox for reset link"
