# Quick Deployment Checklist - Supabase Edition

## ☑️ Pre-Deployment (5 min)

- [ ] Supabase project created
- [ ] DATABASE_URL copied
- [ ] Gemini API key ready
- [ ] Git repo pushed to GitHub

---

## ☑️ Step 1: Supabase Setup (5 min)

- [ ] Create project at supabase.com
- [ ] Choose Mumbai region
- [ ] Save database password
- [ ] Copy connection string from Settings → Database
- [ ] Run `postgres_schema.sql` in SQL Editor

---

## ☑️ Step 2: Backend .env (2 min)

Create `backend/.env`:
```bash
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:5432/postgres
DATABASE_SSL=true
GEMINI_API_KEY=your_key
JWT_SECRET=run_openssl_rand_hex_32
NODE_ENV=production
ALLOWED_ORIGINS=http://localhost:3000
```

- [ ] All variables filled
- [ ] Gemini key valid
- [ ] JWT secret generated

---

## ☑️ Step 3: Test Locally (2 min)

```bash
cd backend
node server.js
```

- [ ] Server starts successfully
- [ ] "PostgreSQL connected" message shows
- [ ] `curl http://localhost:3000/health` returns OK

---

## ☑️ Step 4: Deploy Backend (5 min)

### Railway (Recommended):
```bash
railway login
railway init
railway variables set DATABASE_URL="your_url"
railway variables set GEMINI_API_KEY="your_key"
railway variables set JWT_SECRET="your_secret"
cd backend && railway up
```

- [ ] Railway CLI installed
- [ ] Project initialized
- [ ] Variables set
- [ ] Deployed successfully
- [ ] Backend URL copied: `________________`

---

## ☑️ Step 5: Update Frontend API (1 min)

Edit `app/assets/js/api.js`:
```javascript
const API_URL = 'https://YOUR-BACKEND.railway.app';
```

- [ ] API_URL updated
- [ ] File saved

---

## ☑️ Step 6: Deploy Frontend (2 min)

```bash
vercel --prod
```

- [ ] Vercel deployed
- [ ] URL received: `________________`

---

## ☑️ Step 7: Update CORS (1 min)

Update backend ALLOWED_ORIGINS:
```bash
railway variables set ALLOWED_ORIGINS="https://jobika.vercel.app"
railway up  # redeploy
```

- [ ] CORS updated
- [ ] Backend redeployed

---

## ☑️ Step 8: Final Testing (5 min)

- [ ] Backend health check: `curl https://backend.railway.app/health`
- [ ] Frontend loads: `https://jobika.vercel.app`
- [ ] Register new user
- [ ] Login works
- [ ] Upload resume
- [ ] AI chat responds
- [ ] Job search works
- [ ] Application tracker shows

---

## ☑️ Post-Deploy (Optional)

- [ ] Custom domain configured
- [ ] SSL certificate verified
- [ ] Start SRE monitoring: `python3 backend/scripts/async_sre_agent.py 300 &`
- [ ] Setup cron job for scraping
- [ ] Share with friends for feedback

---

## 🎉 DONE!

**Your URLs:**
- Frontend: `https://jobika.vercel.app`
- Backend: `https://jobika-backend.railway.app`
- Database: Supabase (Mumbai)

**Next:**
1. Test all features
2. Share with users
3. Monitor Supabase + Railway dashboards
4. Collect feedback
5. Iterate!

---

**Total Time:** 25 minutes  
**Status:** 🟢 **LIVE!** 🚀🇮🇳
