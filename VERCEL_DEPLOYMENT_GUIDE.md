# 🚀 PilahPintar Vercel Deployment Guide

## 📋 Overview
Deploy both **Frontend** dan **Backend** ke **Vercel** (serverless).

---

## 🎯 **STEP 1: Deploy Backend ke Vercel**

### 1.1 Setup Repository
```bash
cd backend
git add .
git commit -m "feat: setup vercel serverless deployment"
git push origin main
```

### 1.2 Deploy ke Vercel
1. Login ke [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import repository: `pilahpintar`
4. Set **Root Directory**: `backend`
5. **Framework Preset**: Other
6. **Build Command**: `npm run vercel-build`
7. **Output Directory**: (leave empty)
8. **Install Command**: `npm install`

### 1.3 Environment Variables (Backend)
Tambahkan di Vercel dashboard → Settings → Environment Variables:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://pilahpintar-admin:pilahpintar@pilahpintar.6ib8o03.mongodb.net/pilahpintar?retryWrites=true&w=majority&appName=PilahPintar
MONGODB_DB_NAME=pilahpintar
JWT_SECRET=pilahpintar-prod-aaca99bf7c4136fd0159f6b7c419e3e0434859746f9795656efda44d3797af81
JWT_EXPIRES_IN=7d
FRONTEND_URL=https://pilahpintar.vercel.app
CORS_ORIGIN=https://pilahpintar.vercel.app
UPLOAD_PATH=uploads/
MAX_FILE_SIZE=5242880
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 1.4 Deploy Backend
Click **"Deploy"** → Tunggu proses selesai

Dapatkan URL backend: `https://[project-name]-backend.vercel.app`

---

## 🌐 **STEP 2: Deploy Frontend ke Vercel**

### 2.1 Update Frontend Environment
Edit `frontend/.env`:
```env
REACT_APP_API_URL_PRODUCTION=https://[your-backend-url].vercel.app/api
```

### 2.2 Deploy Frontend
1. **New Project** → Import same repository
2. Set **Root Directory**: `frontend`
3. **Framework Preset**: Create React App
4. **Build Command**: `npm run build`
5. **Output Directory**: `build`
6. **Install Command**: `npm install`

### 2.3 Environment Variables (Frontend)
Tambahkan di Vercel dashboard:

```env
REACT_APP_API_URL_PRODUCTION=https://[your-backend-url].vercel.app/api
REACT_APP_NAME=PilahPintar
REACT_APP_VERSION=1.0.0
GENERATE_SOURCEMAP=false
```

### 2.4 Deploy Frontend
Click **"Deploy"** → Tunggu proses selesai

---

## ✅ **STEP 3: Verification**

### 3.1 Test Backend Endpoints
```bash
curl https://[your-backend-url].vercel.app/health
curl https://[your-backend-url].vercel.app/api/auth/profile
```

### 3.2 Test Frontend
- Buka: `https://[your-frontend-url].vercel.app`
- Test login/register
- Test API integration

---

## 🔧 **Domain Setup (Optional)**

### Backend Custom Domain
1. Vercel Dashboard → Backend Project → Settings → Domains
2. Add: `api.pilahpintar.com`

### Frontend Custom Domain  
1. Vercel Dashboard → Frontend Project → Settings → Domains
2. Add: `pilahpintar.com` atau `www.pilahpintar.com`

---

## 📊 **Monitoring & Logs**

### Vercel Analytics
- Function logs: Dashboard → Functions tab
- Performance: Dashboard → Analytics
- Error tracking: Dashboard → Functions → View Logs

### Database Monitoring
- MongoDB Atlas Dashboard
- Connection logs
- Performance metrics

---

## 🚨 **Important Notes**

1. **Serverless Limitations**:
   - Max execution time: 30 seconds
   - Memory limit: 1024MB
   - No persistent file storage

2. **File Uploads**:
   - Use temporary storage only
   - Consider Cloudinary/AWS S3 for persistent files

3. **Environment Variables**:
   - Production values only
   - No sensitive data in frontend

4. **CORS Configuration**:
   - Update allowed origins
   - Test cross-origin requests

---

## 🔄 **Auto Deployment**

Setiap push ke `main` branch akan auto-deploy ke Vercel.

---

## 📞 **Support**

Jika ada error:
1. Check Vercel Function logs
2. Verify environment variables
3. Test API endpoints individually
4. Check MongoDB Atlas connectivity

**Ready untuk deploy!** 🚀