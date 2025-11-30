# 🎯 JoBika - Quick Start Guide

## ✅ Your Stack (100% Deployed)

```
Frontend:  React + Vite → Vercel (FREE)
Backend:   Node.js + Express → Railway ($5/mo) ✅ LIVE
Database:  PostgreSQL → Supabase (FREE) ✅ CONNECTED
AI:        Google Gemini + OpenAI ✅ CONFIGURED
```

**Total Cost:** $5/month

---

## 🚀 Current Status

### ✅ Backend (Railway)
- **URL:** `https://jobika-backend-production.up.railway.app`
- **Status:** HEALTHY ✅
- **Database:** Connected to Supabase PostgreSQL (with SQLite Fallback)
- **Test:** `curl https://jobika-backend-production.up.railway.app/health`

### ✅ Frontend (Vercel)
- **URL:** [https://jobika-pyt.vercel.app](https://jobika-pyt.vercel.app)
- **Status:** LIVE ✅

---

## 🔧 Vercel Configuration (Important)

### Step 1: Update Vercel Settings
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **JoBika** project (`prj_8Q0IkCnsgMAIAz43TpUTnEoa1P3s`)
3. Go to **Settings** → **General**
4. **Root Directory:** Edit and select `frontend`
5. **Framework Preset:** Select `Vite`
6. Click **Save**

### Step 2: Redeploy
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**

---

## 📋 Environment Variables (Already Set)

### Railway Backend
```bash
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=require
SUPABASE_URL=https://eabkwiklxjbqbfxcdlkk.supabase.co
GEMINI_API_KEY=AIzaSyCfUUpFaa5GQ3F45znzykDS-eZNOimfhdg
JWT_SECRET=jobika-production-secret-key-2024
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:5173,https://jobika-pyt.vercel.app
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
FRONTEND_URL=https://jobika-pyt.vercel.app
```

### Vercel Frontend
- No environment variables needed (API URL is in code)

---

## 🎉 After Frontend Fix

Your app will be live at:
- **Frontend:** [https://jobika-pyt.vercel.app](https://jobika-pyt.vercel.app)
- **Backend:** `https://jobika-backend-production.up.railway.app`

### Test Your App
1. Visit your Vercel URL
2. Register a new account
3. Upload a resume
4. Chat with Orion AI
5. Search for jobs

---

## 📁 Project Structure

```
JoBika_Pyt/
├── frontend/               # React + Vite App
│   ├── src/
│   ├── public/
│   └── vite.config.js
├── backend/                # Node.js Backend
│   ├── server.js          # Main server file
│   ├── services/          # 20+ AI/ML services
│   ├── middleware/        # Auth, validation, security
│   ├── database/          # PostgreSQL schemas
│   └── package.json
└── a_CREDENTIALS.md       # All API keys and credentials
```

---

## 🆘 Troubleshooting

### Backend Issues
```bash
# Check health
curl https://jobika-backend-production.up.railway.app/health

# Expected response:
{"status":"healthy","database":"postgres","gemini":"configured"}
```

### Frontend Issues
- **White Screen:** Ensure Root Directory is `frontend` and Framework is `Vite`
- **404 Errors:** Ensure latest deployment is active
- **API Errors:** Check browser console for CORS/network errors

---

## 📚 Credentials

See `a_CREDENTIALS.md` for:
- Supabase credentials
- Railway project ID
- Vercel project ID (`prj_8Q0IkCnsgMAIAz43TpUTnEoa1P3s`)
- API keys (Gemini, OpenAI)

---

**Need help? The backend is working perfectly. Just fix the Vercel settings and you're done!** 🚀

## ✅ Your Stack (100% Deployed)

```
Frontend:  Vanilla JS → Vercel (FREE)
Backend:   Node.js + Express → Railway ($5/mo) ✅ LIVE
Database:  PostgreSQL → Supabase (FREE) ✅ CONNECTED
AI:        Google Gemini + OpenAI ✅ CONFIGURED
```

**Total Cost:** $5/month

---

## 🚀 Current Status

### ✅ Backend (Railway)
- **URL:** `https://jobika-backend-production.up.railway.app`
- **Status:** HEALTHY ✅
- **Database:** Connected to Supabase PostgreSQL
- **Test:** `curl https://jobika-backend-production.up.railway.app/health`

### ⚠️ Frontend (Vercel)
- **Issue:** White screen (Output Directory not set)
- **Fix Required:** Set Output Directory to `app` in Vercel settings

---

## 🔧 Fix Frontend White Screen

### Step 1: Update Vercel Settings
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **JoBika** project
3. Go to **Settings** → **General**
4. Find **"Build & Development Settings"**
5. Locate **"Output Directory"**
6. Toggle **Override** to ON
7. Type: **`app`**
8. Click **Save**

### Step 2: Redeploy
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on latest deployment
3. Click **Redeploy**
4. Wait for "Ready" status
5. Click **Visit**

---

## 📋 Environment Variables (Already Set)

### Railway Backend
```bash
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
DATABASE_SSL=require
SUPABASE_URL=https://eabkwiklxjbqbfxcdlkk.supabase.co
GEMINI_API_KEY=AIzaSyCfUUpFaa5GQ3F45znzykDS-eZNOimfhdg
JWT_SECRET=jobika-production-secret-key-2024
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3000,https://jobika.vercel.app
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

### Vercel Frontend
- No environment variables needed (API URL is in code)

---

## 🎉 After Frontend Fix

Your app will be live at:
- **Frontend:** `https://jobika.vercel.app` (or your custom domain)
- **Backend:** `https://jobika-backend-production.up.railway.app`

### Test Your App
1. Visit your Vercel URL
2. Register a new account
3. Upload a resume
4. Chat with Orion AI
5. Search for jobs

---

## 📁 Project Structure

```
JoBika_Pyt/
├── app/                    # Frontend (HTML/CSS/JS)
│   ├── index.html
│   ├── dashboard.html
│   ├── assets/
│   │   ├── js/
│   │   │   └── api.js     # Backend API URL configured here
│   │   └── css/
│   └── ...
├── backend/                # Node.js Backend
│   ├── server.js          # Main server file
│   ├── services/          # 20+ AI/ML services
│   ├── middleware/        # Auth, validation, security
│   ├── database/          # PostgreSQL schemas
│   └── package.json
└── a_CREDENTIALS.md       # All API keys and credentials
```

---

## 🆘 Troubleshooting

### Backend Issues
```bash
# Check health
curl https://jobika-backend-production.up.railway.app/health

# Expected response:
{"status":"healthy","database":"postgres","gemini":"configured"}
```

### Frontend Issues
- **White Screen:** Set Output Directory to `app` in Vercel
- **404 Errors:** Ensure latest deployment is active
- **API Errors:** Check browser console for CORS/network errors

---

## 📚 Credentials

See `a_CREDENTIALS.md` for:
- Supabase credentials
- Railway project ID
- Vercel project ID
- API keys (Gemini, OpenAI)

---

**Need help? The backend is working perfectly. Just fix the Vercel Output Directory setting and you're done!** 🚀
