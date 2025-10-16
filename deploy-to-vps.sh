#!/bin/bash
# Deploy Script - Update Backend di VPS dengan Code Terbaru
# Jalankan di VPS via SSH

echo "🚀 Starting deployment to VPS..."

# Navigate to backend directory
cd ~/pilahpintar/backend || exit 1

# Backup current version
echo "📦 Creating backup..."
cp -r ~/pilahpintar/backend ~/pilahpintar/backend-backup-$(date +%Y%m%d-%H%M%S)

# Pull latest changes from GitHub
echo "⬇️  Pulling latest changes from GitHub..."
git pull origin main

# Install/update dependencies
echo "📚 Installing dependencies..."
npm install --production

# Restart PM2 with updated code
echo "🔄 Restarting backend with PM2..."
pm2 restart pilahpintar-backend --update-env

# Wait for backend to start
sleep 3

# Health check
echo "🏥 Running health check..."
HEALTH=$(curl -s http://localhost:3000/health)

if echo "$HEALTH" | grep -q '"success":true'; then
    echo "✅ Deployment successful!"
    echo "Response: $HEALTH"
    
    # Show PM2 status
    pm2 status pilahpintar-backend
    
    # Show recent logs
    echo ""
    echo "📋 Recent logs:"
    pm2 logs pilahpintar-backend --lines 10 --nostream
else
    echo "❌ Deployment failed! Backend not responding correctly."
    echo "Response: $HEALTH"
    
    # Rollback to backup
    echo "⚠️  Rolling back to previous version..."
    LATEST_BACKUP=$(ls -td ~/pilahpintar/backend-backup-* | head -1)
    rm -rf ~/pilahpintar/backend
    cp -r "$LATEST_BACKUP" ~/pilahpintar/backend
    pm2 restart pilahpintar-backend
    
    exit 1
fi

echo ""
echo "🎉 Deployment complete!"
echo "Backend URL: https://api.pilahpintar.site"
echo ""
echo "Test with:"
echo "  curl https://api.pilahpintar.site/health"
