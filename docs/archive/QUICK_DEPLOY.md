# 🚀 Quick Deployment Reference Card

## ⚡ Fast Track (30 minutes total)

### 1️⃣ Push to GitHub (2 min)
```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt
git push origin master
# If fails, use: git remote set-url origin git@github.com:Srujan0798/JoBika_Pyt.git
```

### 2️⃣ Supabase Setup (5 min)
1. Go to [supabase.com](https://supabase.com) → Sign in with GitHub
2. New Project → Name: `jobika-db` → Set password → Create
3. Settings → Database → Copy URI connection string
4. Save: `postgresql://postgres.[ref]:[password]@...`

### 3️⃣ Run Migration (3 min)
```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt/backend
export DATABASE_URL="your_supabase_connection_string"
python3 migrate_to_supabase.py test
python3 migrate_to_supabase.py
```

### 4️⃣ Get API Keys (10 min)
- **Gemini**: [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
- **Gmail**: [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)

### 5️⃣ Deploy to Render (7 min)
1. [render.com](https://render.com) → Sign in with GitHub
2. New Web Service → Connect `Srujan0798/JoBika_Pyt`
3. Build: `pip install -r backend/requirements.txt`
4. Start: `cd backend && gunicorn server:app --bind 0.0.0.0:$PORT`
5. Add environment variables (see below)
6. Create Web Service

### 6️⃣ Test (3 min)
```bash
curl https://your-app.onrender.com/api/health
```
Open: `https://your-app.onrender.com`

---

## 🔑 Environment Variables for Render

```
DATABASE_URL = [Supabase connection string]
GEMINI_API_KEY = [From Google AI Studio]
GMAIL_USER = [Your Gmail]
GMAIL_APP_PASSWORD = [16-char app password]
SECRET_KEY = [Click "Generate"]
PYTHON_VERSION = 3.11.5
ALLOWED_ORIGINS = https://your-app-name.onrender.com
```

---

## 📋 Checklist

- [ ] Push code to GitHub
- [ ] Create Supabase project
- [ ] Get connection string
- [ ] Run database migration
- [ ] Verify tables in Supabase
- [ ] Get Gemini API key
- [ ] Get Gmail app password
- [ ] Create Render web service
- [ ] Add environment variables
- [ ] Deploy and wait
- [ ] Test health endpoint
- [ ] Test frontend
- [ ] Register test account
- [ ] Verify in Supabase

---

## 🆘 Quick Fixes

**Git push fails**: Use SSH or Personal Access Token  
**Migration fails**: Check DATABASE_URL format  
**Render build fails**: Check requirements.txt  
**Frontend 404**: Verify app/ directory exists  
**CORS error**: Update ALLOWED_ORIGINS  

---

## 📚 Full Guides

- **Step-by-step**: [LIVE_DEPLOYMENT.md](file:///Users/roshwinram/Downloads/JoBika_Pyt/LIVE_DEPLOYMENT.md)
- **Detailed**: [docs/DEPLOYMENT_GUIDE.md](file:///Users/roshwinram/Downloads/JoBika_Pyt/docs/DEPLOYMENT_GUIDE.md)
- **Technical**: [implementation_plan.md](file:///Users/roshwinram/.gemini/antigravity/brain/d6c85322-26b5-472f-b9bb-a13e2c92a2f4/implementation_plan.md)

---

**You got this! 🚀**
