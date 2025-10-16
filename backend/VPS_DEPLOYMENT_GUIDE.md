# 🖥️ Deploy Backend PilahPintar ke VPS - Complete Guide

## 🎯 **VPS Specifications**

**Your VPS:**

- **IP**: 202.10.41.181
- **OS**: Ubuntu 22.04 x86_64
- **RAM**: 1 GB (optimized config included)
- **Storage**: 20 GB
- **CPU**: 1 Core
- **Hostname**: server1.pilahpintar.site

✅ **Status: CUKUP untuk Backend PilahPintar!**

---

## 📋 Table of Contents

1. [Initial VPS Setup](#1-initial-vps-setup)
2. [Install Dependencies](#2-install-dependencies)
3. [Setup Backend](#3-setup-backend)
4. [Configure PM2 (RAM Optimized)](#4-configure-pm2-ram-optimized)
5. [Setup Nginx Reverse Proxy](#5-setup-nginx-reverse-proxy)
6. [SSL Certificate](#6-ssl-certificate)
7. [Auto Deployment](#7-auto-deployment)
8. [Monitoring & Optimization](#8-monitoring--optimization)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Initial VPS Setup

### Step 1.1: Login ke VPS

**Via PowerShell di Windows:**

```powershell
# Login sebagai root
ssh root@202.10.41.181

# Masukkan password: @Kikqthksbul9 (dari screenshot)
```

### Step 1.2: Update System

```bash
# Update package list
apt update && apt upgrade -y

# Install basic tools
apt install -y curl wget git vim htop net-tools
```

### Step 1.3: Create Non-Root User (Security)

```bash
# Buat user baru untuk backend
adduser pilahpintar

# Password untuk user pilahpintar (buat password baru yang kuat)
# Contoh: PilahPintar2025!@#

# Grant sudo privileges
usermod -aG sudo pilahpintar

# Switch ke user baru
su - pilahpintar
```

### Step 1.4: Setup SSH Key (Optional tapi Recommended)

**Di Windows PowerShell (komputer Anda):**

```powershell
# Generate SSH key jika belum punya
ssh-keygen -t ed25519 -C "your-email@example.com"

# Copy public key ke VPS
type $env:USERPROFILE\.ssh\id_ed25519.pub | ssh pilahpintar@202.10.41.181 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### Step 1.5: Configure Firewall

```bash
# Install UFW (firewall)
sudo apt install ufw -y

# Allow SSH (PENTING! Jangan skip ini)
sudo ufw allow OpenSSH

# Allow HTTP & HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## 2. Install Dependencies

### Step 2.1: Install Node.js 20 LTS

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 2.2: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version

# Setup PM2 startup (akan auto-start ketika VPS reboot)
pm2 startup systemd
# Copy dan jalankan command yang diberikan
```

### Step 2.3: Install Nginx

```bash
# Install Nginx
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Check status
sudo systemctl status nginx
```

### Step 2.4: Install Certbot (untuk SSL)

```bash
# Install Certbot dan Nginx plugin
sudo apt install certbot python3-certbot-nginx -y
```

---

## 3. Setup Backend

### Step 3.1: Clone Repository

```bash
# Navigate to home directory
cd ~

# Clone repository
git clone https://github.com/ibnuhabibr/pilahpintar.git

# Navigate to backend
cd pilahpintar/backend

# Check current branch
git branch
```

### Step 3.2: Install Dependencies

```bash
# Install npm packages
npm install

# This will take 2-3 minutes
```

### Step 3.3: Create Environment Variables

```bash
# Create .env file
nano .env
```

**Paste configuration ini** (sesuaikan dengan environment Anda):

```env
# MongoDB Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://Vercel-Admin-PilahPintar:nv7xQsEDlAorZbf5@pilahpintar.ldoobvd.mongodb.net/pilahpintar?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=pilahpintar-prod-aaca99bf7c4136fd0159f6b7c419e3e0434859746f9795656efda44d3797af81
JWT_EXPIRES_IN=7d

# Environment
NODE_ENV=production

# Frontend URL (ganti dengan domain frontend Anda)
FRONTEND_URL=https://frontend-gules-xi-70.vercel.app
CORS_ORIGIN=https://frontend-gules-xi-70.vercel.app

# Supabase (jika sudah setup)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/jpg,image/webp

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Port (internal - Nginx will proxy to this)
PORT=3000
```

**Cara save di nano:**

- Tekan `Ctrl + X`
- Tekan `Y`
- Tekan `Enter`

### Step 3.4: Configure MongoDB Atlas for VPS

**PENTING: Whitelist IP VPS di MongoDB Atlas!**

1. Login ke MongoDB Atlas: https://cloud.mongodb.com
2. Select cluster: **pilahpintar**
3. **Network Access** → **Add IP Address**
4. Add IP: **202.10.41.181** (IP VPS Anda)
5. Atau untuk kemudahan: Add **0.0.0.0/0** (allow all)
6. Click **Confirm**

### Step 3.5: Test Backend Locally

```bash
# Test run backend
npm start

# Expected output:
# 📦 MongoDB connected successfully
# 🚀 PilahPintar API server running on port 3000
```

**Test di browser lain atau PowerShell:**

```powershell
# Di komputer Anda
curl http://202.10.41.181:3000/api/health
```

Jika berhasil, **Stop backend** dengan `Ctrl + C` di VPS.

---

## 4. Configure PM2 (RAM Optimized)

### Step 4.1: Create PM2 Ecosystem Config

```bash
# Di folder backend
cd ~/pilahpintar/backend
nano ecosystem.config.js
```

**Paste configuration ini** (optimized untuk 1GB RAM):

```javascript
module.exports = {
  apps: [
    {
      name: "pilahpintar-backend",
      script: "./src/app.js",
      instances: 1, // Single instance untuk 1GB RAM
      exec_mode: "fork", // Fork mode lebih hemat memory
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      // Logging
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,

      // Memory Management (PENTING untuk 1GB RAM!)
      max_memory_restart: "400M", // Restart jika melebihi 400MB

      // Restart Strategy
      restart_delay: 4000,
      autorestart: true,
      watch: false,

      // Performance
      max_restarts: 10,
      min_uptime: "10s",

      // Environment-specific Node.js options
      node_args: "--max-old-space-size=512", // Limit Node.js heap ke 512MB
    },
  ],
};
```

**Save**: `Ctrl + X`, `Y`, `Enter`

### Step 4.2: Create Logs Directory

```bash
mkdir logs
```

### Step 4.3: Start Backend with PM2

```bash
# Start application
pm2 start ecosystem.config.js

# Expected output:
# ┌─────┬────────────────────────┬─────────────┬─────────┬─────────┬──────────┐
# │ id  │ name                   │ mode        │ ↺       │ status  │ cpu      │
# ├─────┼────────────────────────┼─────────────┼─────────┼─────────┼──────────┤
# │ 0   │ pilahpintar-backend    │ fork        │ 0       │ online  │ 0%       │
# └─────┴────────────────────────┴─────────────┴─────────┴─────────┴──────────┘

# Check status
pm2 status

# View logs
pm2 logs pilahpintar-backend --lines 50

# Stop viewing logs: Ctrl + C
```

### Step 4.4: Save PM2 Configuration

```bash
# Save process list (akan restore otomatis setelah reboot)
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd

# Copy dan run command yang diberikan, contoh:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u pilahpintar --hp /home/pilahpintar

# Jalankan command tersebut, lalu save lagi
pm2 save
```

### Step 4.5: Useful PM2 Commands

```bash
# Check status
pm2 status

# View real-time logs
pm2 logs pilahpintar-backend

# View monitoring dashboard
pm2 monit

# Restart app
pm2 restart pilahpintar-backend

# Stop app
pm2 stop pilahpintar-backend

# Delete app from PM2
pm2 delete pilahpintar-backend

# Flush logs
pm2 flush

# Show app info
pm2 info pilahpintar-backend
```

---

## 5. Setup Nginx Reverse Proxy

### Step 5.1: Create Nginx Site Configuration

```bash
# Create new site config
sudo nano /etc/nginx/sites-available/pilahpintar-backend
```

**Paste configuration ini:**

```nginx
# Rate limiting zone (protect against DDoS)
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    listen 80;
    listen [::]:80;

    # Domain Anda
    server_name server1.pilahpintar.site api.pilahpintar.site 202.10.41.181;

    # Logging
    access_log /var/log/nginx/pilahpintar-backend-access.log;
    error_log /var/log/nginx/pilahpintar-backend-error.log;

    # File upload size limit
    client_max_body_size 10M;

    # Proxy to Node.js backend
    location / {
        # Rate limiting
        limit_req zone=api_limit burst=20 nodelay;

        # Proxy settings
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;

        # WebSocket support
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;

        # Cache bypass
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint (no rate limit)
    location /api/health {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        access_log off;
    }
}
```

**Save**: `Ctrl + X`, `Y`, `Enter`

### Step 5.2: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/pilahpintar-backend /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# Reload Nginx
sudo systemctl reload nginx
```

### Step 5.3: Test Backend via Nginx

**Test dari VPS:**

```bash
curl http://localhost/api/health
```

**Test dari komputer Anda (PowerShell):**

```powershell
curl http://202.10.41.181/api/health
```

**Expected response:**

```json
{
  "success": true,
  "message": "PilahPintar API is running",
  "timestamp": "2025-10-15T...",
  "environment": "production",
  "database": "connected"
}
```

✅ **Jika dapat response ini, backend Anda sudah running!**

---

## 6. SSL Certificate (HTTPS)

### Step 6.1: Setup DNS (Jika punya domain)

**Jika Anda menggunakan domain `server1.pilahpintar.site`:**

1. Login ke DNS provider Anda
2. Add A Record:
   ```
   Type: A
   Name: server1 (atau api)
   Value: 202.10.41.181
   TTL: 300 (5 minutes)
   ```
3. Wait 5-10 minutes untuk DNS propagation
4. Test DNS:
   ```bash
   ping server1.pilahpintar.site
   ```

### Step 6.2: Obtain SSL Certificate

**Jika menggunakan domain:**

```bash
# Request SSL certificate
sudo certbot --nginx -d server1.pilahpintar.site

# Follow prompts:
# - Enter email: your-email@example.com
# - Agree to terms: Y
# - Share email: N (optional)
# - Redirect HTTP to HTTPS: 2 (Yes, redirect)
```

**Jika menggunakan IP saja:**

⚠️ **Tidak bisa install SSL untuk IP address langsung**. Gunakan HTTP untuk development, atau gunakan domain.

### Step 6.3: Test HTTPS

```bash
# Test dari VPS
curl https://server1.pilahpintar.site/api/health

# Test dari komputer
curl https://server1.pilahpintar.site/api/health
```

### Step 6.4: Auto-Renewal Setup

```bash
# Certbot akan otomatis setup cron job
# Test renewal (dry run)
sudo certbot renew --dry-run

# Expected: All simulated renewals succeeded
```

---

## 7. Auto Deployment

### Step 7.1: Create Deploy Script

```bash
# Di folder backend
cd ~/pilahpintar/backend
nano deploy.sh
```

**Paste script:**

```bash
#!/bin/bash

echo "🚀 Starting PilahPintar Backend Deployment..."
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Navigate to backend directory
cd ~/pilahpintar/backend

# Stash any local changes
echo -e "${YELLOW}📦 Stashing local changes...${NC}"
git stash

# Pull latest code from GitHub
echo -e "${YELLOW}📥 Pulling latest code from GitHub...${NC}"
if git pull origin main; then
    echo -e "${GREEN}✅ Code updated successfully${NC}"
else
    echo -e "${RED}❌ Failed to pull from GitHub${NC}"
    exit 1
fi

# Install/Update dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
if npm install; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Restart PM2 process
echo -e "${YELLOW}🔄 Restarting application...${NC}"
if pm2 restart pilahpintar-backend; then
    echo -e "${GREEN}✅ Application restarted${NC}"
else
    echo -e "${RED}❌ Failed to restart application${NC}"
    exit 1
fi

# Wait for app to start
sleep 3

# Check app status
echo -e "${YELLOW}🔍 Checking application status...${NC}"
pm2 status pilahpintar-backend

# Test health endpoint
echo -e "${YELLOW}🏥 Testing health endpoint...${NC}"
if curl -s http://localhost:3000/api/health | grep -q "connected"; then
    echo -e "${GREEN}✅ Health check passed!${NC}"
else
    echo -e "${RED}⚠️  Warning: Health check failed${NC}"
fi

echo "================================================"
echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo "Backend URL: http://202.10.41.181/api"
echo "Health Check: http://202.10.41.181/api/health"
```

**Save**: `Ctrl + X`, `Y`, `Enter`

### Step 7.2: Make Script Executable

```bash
chmod +x deploy.sh
```

### Step 7.3: Test Deploy Script

```bash
./deploy.sh //SAMPE SINI STEP TERAKHIR
```

### Step 7.4: One-Line Deploy Command (Optional)

Add alias ke `.bashrc`:

```bash
echo 'alias deploy="cd ~/pilahpintar/backend && ./deploy.sh"' >> ~/.bashrc
source ~/.bashrc

# Sekarang Anda bisa deploy dengan:
deploy
```

---

## 8. Monitoring & Optimization

### Step 8.1: Monitor System Resources

```bash
# Real-time system monitor
htop

# Memory usage
free -h

# Disk usage
df -h

# Network connections
netstat -tulpn | grep :3000
```

### Step 8.2: PM2 Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# Process list with stats
pm2 list

# Show detailed info
pm2 info pilahpintar-backend

# View logs
pm2 logs pilahpintar-backend --lines 100

# Flush old logs
pm2 flush
```

### Step 8.3: Setup Log Rotation

```bash
# Install logrotate configuration for PM2
pm2 install pm2-logrotate

# Configure log rotation
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
```

### Step 8.4: Memory Optimization Tips

**Untuk VPS 1GB RAM:**

1. **Monitor memory usage:**

   ```bash
   # Check Node.js memory
   pm2 monit

   # Should stay under 400MB
   ```

2. **If memory usage high:**

   ```bash
   # Restart PM2
   pm2 restart pilahpintar-backend

   # Clear logs
   pm2 flush
   ```

3. **Optimize MongoDB connections:**

   Edit `backend/src/config/database.js` (jika ada):

   ```javascript
   mongoose.connect(MONGODB_URI, {
     maxPoolSize: 5, // Reduce connection pool
     minPoolSize: 1,
     serverSelectionTimeoutMS: 5000,
   });
   ```

### Step 8.5: Performance Monitoring

```bash
# Check response time
time curl http://localhost/api/health

# Monitor Nginx access logs
sudo tail -f /var/log/nginx/pilahpintar-backend-access.log

# Monitor error logs
sudo tail -f /var/log/nginx/pilahpintar-backend-error.log
```

---

## 9. Troubleshooting

### ❌ Problem: Database Connection Failed

**Symptoms:**

```json
{
  "database": "disconnected"
}
```

**Solutions:**

1. **Check MongoDB Atlas IP Whitelist:**

   ```bash
   # Get VPS IP
   curl ifconfig.me
   # Output: 202.10.41.181

   # Add this IP to MongoDB Atlas Network Access
   ```

2. **Test MongoDB connection:**

   ```bash
   # Test network connectivity
   ping pilahpintar.ldoobvd.mongodb.net

   # Test MongoDB connection with Node
   node -e "require('mongoose').connect('YOUR_MONGODB_URI').then(() => console.log('Connected')).catch(err => console.log('Error:', err.message))"
   ```

3. **Check environment variables:**

   ```bash
   # Verify MONGODB_URI is set
   cat ~/pilahpintar/backend/.env | grep MONGODB_URI
   ```

4. **Restart backend:**
   ```bash
   pm2 restart pilahpintar-backend
   pm2 logs --lines 50
   ```

---

### ❌ Problem: High Memory Usage

**Symptoms:**

- PM2 shows memory > 500MB
- VPS becomes slow
- Backend crashes

**Solutions:**

1. **Check memory:**

   ```bash
   free -h
   pm2 monit
   ```

2. **Reduce max_memory_restart:**

   ```javascript
   // ecosystem.config.js
   max_memory_restart: "300M"; // Lower limit
   ```

3. **Restart PM2:**

   ```bash
   pm2 restart pilahpintar-backend
   ```

4. **Clear swap if exists:**
   ```bash
   sudo swapoff -a
   sudo swapon -a
   ```

---

### ❌ Problem: 502 Bad Gateway

**Symptoms:**

- Nginx shows 502 error
- "Bad Gateway" in browser

**Solutions:**

1. **Check if backend running:**

   ```bash
   pm2 status
   # Should show "online"
   ```

2. **Check if port 3000 listening:**

   ```bash
   netstat -tulpn | grep :3000
   # Should show node process
   ```

3. **Restart everything:**

   ```bash
   pm2 restart pilahpintar-backend
   sudo systemctl restart nginx
   ```

4. **Check logs:**
   ```bash
   pm2 logs pilahpintar-backend --lines 50
   sudo tail -f /var/log/nginx/pilahpintar-backend-error.log
   ```

---

### ❌ Problem: CORS Errors

**Symptoms:**

```
Access to fetch has been blocked by CORS policy
```

**Solutions:**

1. **Update .env:**

   ```bash
   nano ~/pilahpintar/backend/.env

   # Update:
   CORS_ORIGIN=https://frontend-gules-xi-70.vercel.app
   FRONTEND_URL=https://frontend-gules-xi-70.vercel.app
   ```

2. **Restart:**
   ```bash
   pm2 restart pilahpintar-backend
   ```

---

### ❌ Problem: Can't SSH to VPS

**Solutions:**

1. **Check firewall:**

   - Login via VPS provider console

   ```bash
   sudo ufw status
   sudo ufw allow OpenSSH
   ```

2. **Reset SSH:**
   ```bash
   sudo systemctl restart sshd
   ```

---

## 10. Security Best Practices

### Step 10.1: Disable Root Login

```bash
sudo nano /etc/ssh/sshd_config
```

Find and change:

```
PermitRootLogin no
PasswordAuthentication no  # If using SSH keys
```

Restart SSH:

```bash
sudo systemctl restart sshd
```

### Step 10.2: Install Fail2Ban

```bash
# Install fail2ban
sudo apt install fail2ban -y

# Start and enable
sudo systemctl start fail2ban
sudo systemctl enable fail2ban

# Check status
sudo fail2ban-client status
```

### Step 10.3: Setup Automated Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades -y

# Configure
sudo dpkg-reconfigure --priority=low unattended-upgrades
# Select "Yes"
```

---

## 11. Backup Strategy

### Step 11.1: Create Backup Script

```bash
nano ~/backup.sh
```

**Paste:**

```bash
#!/bin/bash

BACKUP_DIR="/home/pilahpintar/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

echo "🔄 Starting backup at $DATE"

# Backup backend code
tar -czf $BACKUP_DIR/backend_$DATE.tar.gz ~/pilahpintar/backend

# Backup Nginx config
sudo cp /etc/nginx/sites-available/pilahpintar-backend $BACKUP_DIR/nginx_$DATE.conf

# Backup PM2 config
cp ~/pilahpintar/backend/ecosystem.config.js $BACKUP_DIR/ecosystem_$DATE.js

# Backup .env (encrypted)
cp ~/pilahpintar/backend/.env $BACKUP_DIR/env_$DATE.bak

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete

echo "✅ Backup completed: backend_$DATE.tar.gz"
echo "📦 Backup location: $BACKUP_DIR"
```

```bash
chmod +x ~/backup.sh
```

### Step 11.2: Schedule Daily Backups

```bash
# Edit crontab
crontab -e

# Add line (backup daily at 2 AM):
0 2 * * * /home/pilahpintar/backup.sh >> /home/pilahpintar/backup.log 2>&1
```

---

## 📋 Quick Reference

### Essential Commands

```bash
# PM2 Management
pm2 start ecosystem.config.js
pm2 stop pilahpintar-backend
pm2 restart pilahpintar-backend
pm2 logs pilahpintar-backend
pm2 monit
pm2 status

# Nginx Management
sudo systemctl restart nginx
sudo systemctl status nginx
sudo nginx -t
sudo tail -f /var/log/nginx/pilahpintar-backend-error.log

# Deployment
cd ~/pilahpintar/backend
./deploy.sh

# System Monitoring
htop
free -h
df -h
netstat -tulpn | grep :3000

# Logs
pm2 logs --lines 100
sudo tail -f /var/log/nginx/pilahpintar-backend-access.log
```

### Important URLs

| Resource            | URL                                  |
| ------------------- | ------------------------------------ |
| **Backend (HTTP)**  | http://202.10.41.181/api             |
| **Backend (HTTPS)** | https://server1.pilahpintar.site/api |
| **Health Check**    | http://202.10.41.181/api/health      |
| **SSH Access**      | ssh pilahpintar@202.10.41.181        |

### Important Files

| File          | Location                                         |
| ------------- | ------------------------------------------------ |
| Backend Code  | `~/pilahpintar/backend/`                         |
| Environment   | `~/pilahpintar/backend/.env`                     |
| PM2 Config    | `~/pilahpintar/backend/ecosystem.config.js`      |
| Deploy Script | `~/pilahpintar/backend/deploy.sh`                |
| Nginx Config  | `/etc/nginx/sites-available/pilahpintar-backend` |
| PM2 Logs      | `~/pilahpintar/backend/logs/`                    |
| Nginx Logs    | `/var/log/nginx/pilahpintar-backend-*.log`       |

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] VPS accessible via SSH
- [ ] Root password known
- [ ] MongoDB Atlas configured
- [ ] GitHub repository accessible

### Initial Setup (Do Once)

- [ ] System updated
- [ ] Non-root user created
- [ ] Firewall configured
- [ ] Node.js installed
- [ ] PM2 installed
- [ ] Nginx installed
- [ ] Certbot installed

### Backend Deployment

- [ ] Repository cloned
- [ ] Dependencies installed
- [ ] .env file created
- [ ] MongoDB IP whitelisted
- [ ] PM2 ecosystem configured
- [ ] Backend started with PM2
- [ ] PM2 startup configured

### Nginx & SSL

- [ ] Nginx site configured
- [ ] Nginx config tested
- [ ] Nginx reloaded
- [ ] Backend accessible via HTTP
- [ ] SSL certificate installed (if domain)
- [ ] Backend accessible via HTTPS

### Testing

- [ ] Health check returns "connected"
- [ ] Can upload image
- [ ] Can login with Google OAuth
- [ ] All features working

### Post-Deployment

- [ ] Deploy script created
- [ ] Monitoring setup
- [ ] Backup script created
- [ ] Cron job scheduled
- [ ] Security hardened
- [ ] Documentation updated

---

## 🎉 Congratulations!

Backend PilahPintar sekarang running di VPS Anda dengan:

✅ **Ubuntu 22.04** - Latest LTS
✅ **Node.js 20** - Latest LTS
✅ **PM2** - Process manager with auto-restart
✅ **Nginx** - Reverse proxy with rate limiting
✅ **SSL** - HTTPS with Let's Encrypt (if domain)
✅ **Optimized for 1GB RAM** - Memory-efficient configuration
✅ **Auto-deploy** - One command deployment
✅ **Monitoring** - PM2 and system monitoring
✅ **Backup** - Automated daily backups
✅ **Security** - Firewall, fail2ban, updates

**Backend URL:** http://202.10.41.181/api
**Health Check:** http://202.10.41.181/api/health

---

## 📞 Support & Next Steps

### Update Frontend

Update frontend environment variable di Vercel:

```
REACT_APP_API_URL_PRODUCTION=http://202.10.41.181/api
```

Atau jika sudah setup domain:

```
REACT_APP_API_URL_PRODUCTION=https://server1.pilahpintar.site/api
```

### Need Help?

Jika ada masalah, check:

1. PM2 logs: `pm2 logs pilahpintar-backend`
2. Nginx logs: `sudo tail -f /var/log/nginx/pilahpintar-backend-error.log`
3. System resources: `htop` dan `free -h`
4. MongoDB Atlas network access
5. Firewall: `sudo ufw status`

---

**Tutorial Version**: 1.0
**Last Updated**: October 15, 2025
**VPS**: Ubuntu 22.04, 1GB RAM, 1 Core CPU
**Optimized for**: PilahPintar Backend Production Deployment

**Good luck with your deployment! 🚀💚🌍**
