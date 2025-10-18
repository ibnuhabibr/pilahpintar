#!/bin/bash
# PM2 Health Check Script
# Jalankan via cron setiap 5 menit untuk ensure backend always running

# Test backend health
HEALTH_CHECK=$(curl -s http://localhost:3000/health)

if [[ $HEALTH_CHECK != *"success"* ]]; then
    echo "[$(date)] Backend not responding, restarting PM2..."
    pm2 restart pilahpintar-backend --update-env

    # Send notification (optional - butuh setup)
    # echo "Backend restarted at $(date)" | mail -s "PilahPintar Alert" your-email@gmail.com
else
    echo "[$(date)] Backend healthy: $HEALTH_CHECK"
fi
