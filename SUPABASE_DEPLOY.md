# 🚀 JoBika Deployment with Supabase

## ✅ SUPABASE SETUP (10 minutes)

You're using Supabase - smart choice! Here's exactly what you need to do:

---

## Step 1: Create Supabase Project (3 min)

1. **Go to [supabase.com](https://supabase.com)**
2. **Click "Start your project"** (or "New Project")
3. **Fill in details:**
   - **Name:** `jobika` (or anything you like)
   - **Database Password:** Create a strong password (SAVE THIS!)
   - **Region:** `Mumbai (South Asia)` (closest to India)
   - **Pricing:** FREE tier
4. **Click "Create new project"**
5. **Wait 2-3 minutes** for setup to complete

---

## Step 2: Get Connection String (2 min)

1. **Go to Settings** (left sidebar) → **Database**
2. **Scroll to "Connection string"**
3. **Copy the "URI" format** (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
   ```
4. **Replace `[YOUR-PASSWORD]`** with the password from Step 1

**Example:**
```
postgresql://postgres:MyStrongPass123@db.abcdefgh.supabase.co:5432/postgres
```

---

## Step 3: Run Database Schema (5 min)

### Option A: Using Supabase SQL Editor (Easier)

1. **Go to SQL Editor** (left sidebar in Supabase)
2. **Click "New query"**
3. **Copy the entire contents of** `backend/database/postgres_schema.sql`
4. **Paste into SQL Editor**
5. **Click "Run"**
6. **Wait for success message** ✅

### Option B: Using Migration Script

```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt/backend

# Set your Supabase connection string
export DATABASE_URL="postgresql://postgres:MyStrongPass123@db.xxx.supabase.co:5432/postgres"

# Run migration
node database/migrate.js
```

---

## Step 4: Update Backend .env (2 min)

```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt/backend

# Update your .env file:
cat > .env << 'EOF'
# Database (Supabase)
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
DATABASE_SSL=true

# Gemini AI
GEMINI_API_KEY=your_gemini_key_here

# JWT
JWT_SECRET=your_generated_secret_here

# Environment
NODE_ENV=production

# CORS (will update after Vercel deployment)
ALLOWED_ORIGINS=http://localhost:3000,https://jobika.vercel.app
EOF
```

**Replace:**
- `[YOUR-PASSWORD]` → Your Supabase database password
- `your_gemini_key_here` → Your Gemini API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
- `your_generated_secret_here` → Run `openssl rand -hex 32` to generate

---

## Step 5: Test Locally (2 min)

```bash
# Start backend
cd backend
node server.js

# You should see:
# ✅ PostgreSQL connected
# 🚀 Server running on port 3000
```

**Test it:**
```bash
# In another terminal:
curl http://localhost:3000/health

# Should return: {"status":"ok","database":"connected"}
```

---

## Step 6: Deploy Backend (Choose One)

### Option A: Railway (Recommended - Easiest)

```bash
# Install Railway CLI
curl -fsSL https://railway.app/install.sh | sh

# Login
railway login

# Initialize project
railway init

# Add environment variables
railway variables set DATABASE_TYPE=postgres
railway variables set DATABASE_URL="postgresql://postgres:..."
railway variables set GEMINI_API_KEY="your_key"
railway variables set JWT_SECRET="your_secret"
railway variables set NODE_ENV=production

# Deploy
cd backend
railway up

# Get your backend URL
railway domain
# Example: jobika-backend.up.railway.app
```

### Option B: Vercel (Backend + Frontend together)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (backend in /backend, frontend in /app)
vercel --prod

# When prompted, configure:
# - Build Command: (leave empty)
# - Output Directory: app
# - Environment variables: Add all from .env
```

### Option C: Render.com

1. Go to [render.com](https://render.com)
2. **New** → **Web Service**
3. Connect GitHub repo
4. Configure:
   - **Name:** `jobika-backend`
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment Variables:** Add all from .env
5. **Create Web Service**

---

## Step 7: Update Frontend API URL (1 min)

Once backend is deployed, update frontend:

```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt/app/assets/js

# Edit api.js
# Change this line:
# const API_URL = 'http://localhost:3000';

# To this (use your actual backend URL):
# const API_URL = 'https://jobika-backend.up.railway.app';
```

---

## Step 8: Deploy Frontend (2 min)

```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt

# Deploy to Vercel
vercel --prod

# Follow prompts:
# - Project name: jobika
# - Framework: None
# - Build output: app
```

**Your app will be live at:** `https://jobika.vercel.app`

---

## Step 9: Update CORS (1 min)

After frontend is deployed, update backend CORS:

```bash
# Update ALLOWED_ORIGINS in backend .env or Railway variables:
ALLOWED_ORIGINS=https://jobika.vercel.app,https://www.jobika.com

# Redeploy backend:
railway up  # or restart on Render/Vercel
```

---

## ✅ VERIFICATION CHECKLIST

Test these after deployment:

### Backend Health
```bash
curl https://your-backend-url.railway.app/health
# Should return: {"status":"ok","database":"connected"}
```

### Frontend
1. Open `https://jobika.vercel.app`
2. Click "Register"
3. Create account
4. Upload resume
5. Chat with Orion AI
6. Search jobs
7. Check dashboard

---

## 🔧 TROUBLESHOOTING

### "Database connection failed"
```bash
# Check your DATABASE_URL format:
# Must include SSL: ?sslmode=require
postgresql://postgres:password@db.xxx.supabase.co:5432/postgres?sslmode=require

# Or set DATABASE_SSL=true in .env
```

### "Gemini API error"
```bash
# Verify API key:
curl -H "Authorization: Bearer YOUR_GEMINI_KEY" \
  https://generativelanguage.googleapis.com/v1beta/models

# Get new key if needed:
# https://aistudio.google.com/app/apikey
```

### "CORS error"
```bash
# Make sure ALLOWED_ORIGINS includes your frontend URL
ALLOWED_ORIGINS=https://jobika.vercel.app

# Restart backend after updating
```

### "Migration failed"
```sql
-- Log into Supabase SQL Editor
-- Drop all tables and start fresh:

DROP TABLE IF EXISTS application_events CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS saved_jobs CASCADE;
DROP TABLE IF EXISTS job_alerts CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS resumes CASCADE;
DROP TABLE IF EXISTS jobs CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS usage_tracking CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Then re-run schema from postgres_schema.sql
```

---

## 📊 SUPABASE FEATURES TO USE

### Database
- ✅ PostgreSQL (FREE: 500MB)
- ✅ Auto backups
- ✅ Connection pooling

### Monitoring
1. Go to **Database** → **Query Performance**
2. See slow queries
3. Optimize indexes

### Storage (for resumes)
1. Go to **Storage** (if needed for resume PDFs)
2. Create bucket: `resumes`
3. Update upload code to use Supabase Storage

---

## 💰 SUPABASE PRICING

### FREE Tier (Perfect for MVP)
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth
- 50,000 monthly active users
- **Perfect for first 1,000 users!**

### Pro Tier ($25/month)
- 8 GB database
- 100 GB storage
- Automatic backups
- **Upgrade when you hit limits**

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT

1. **Test everything thoroughly**
2. **Share with 10 friends** for feedback
3. **Monitor Supabase dashboard**
4. **Set up daily job scraping:**
   ```bash
   # Add to your server's crontab:
   0 9 * * * cd /path/to/backend && node services/SimpleJobScraper.js
   ```
5. **Start SRE monitoring:**
   ```bash
   python3 backend/scripts/async_sre_agent.py 300 &
   ```

---

## 🚀 DEPLOYMENT SUMMARY

**With Supabase, you need:**

```bash
# 1. Supabase setup (5 min)
#    - Create project
#    - Copy DATABASE_URL

# 2. Backend deploy (5 min)
railway up  # or vercel/render

# 3. Frontend deploy (2 min)
vercel --prod

# 4. Test (3 min)
curl https://your-backend.railway.app/health
open https://jobika.vercel.app

# TOTAL: 15 minutes to LIVE! 🎉
```

---

## 📞 HELP & RESOURCES

**Supabase Docs:** https://supabase.com/docs  
**Railway Docs:** https://docs.railway.app  
**Vercel Docs:** https://vercel.com/docs

**JoBika Docs:**
- `README.md` - Getting started
- `PRODUCTION_CHECKLIST.md` - Full checklist
- `FINAL_VERIFICATION.md` - Testing guide

---

**Ready? Let's deploy!** 🚀

```bash
# Quick deploy script:
cd backend
railway up
cd ..
vercel --prod
```

**You'll be LIVE in 15 minutes!** 🇮🇳
