# 🚂 Railway Deployment Commands

## Copy-paste these commands one by one:

### Step 1: Login to Railway
```bash
railway login
```
**Action:** Browser will open for authentication. Login with GitHub/Email.

---

### Step 2: Initialize Project
```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt
railway init
```
**When prompted for name, type:** `jobika-backend`

---

### Step 3: Set Environment Variables

**Copy-paste these ONE BY ONE:**

```bash
railway variables set DATABASE_TYPE=postgres
```

```bash
railway variables set DATABASE_URL="postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"
```

```bash
railway variables set GEMINI_API_KEY="AIzaSyCfUUpFaa5GQ3F45znzykDS-eZNOimfhdg"
```

```bash
railway variables set JWT_SECRET="jobika-production-secret-key-2024"
```

```bash
railway variables set NODE_ENV=production
```

```bash
railway variables set DATABASE_SSL=true
```

```bash
railway variables set ALLOWED_ORIGINS="https://jobika.vercel.app"
```

---

### Step 4: Deploy Backend
```bash
cd backend
railway up
```

**This will:**
- Upload your code
- Install dependencies
- Start the server
- Give you a URL

---

### Step 5: Get Your Backend URL
```bash
railway domain
```

**Example output:**
```
jobika-backend-production.up.railway.app
```

**📝 SAVE THIS URL!** You'll need it for Step 3 (Vercel frontend).

---

### Step 6: Verify Deployment
```bash
# Test health endpoint (replace with YOUR URL):
curl https://YOUR-RAILWAY-URL.up.railway.app/health
```

**Should return:**
```json
{"status":"ok","database":"connected"}
```

---

## 🔧 Troubleshooting

### If `railway login` doesn't open browser:
```bash
# Try manual login:
railway login --browserless
```

### If deployment fails:
```bash
# Check logs:
railway logs

# Common fixes:
# 1. Verify all env vars are set:
railway variables

# 2. Check if service is running:
railway status

# 3. Redeploy:
railway up --detach
```

### If you need to update variables later:
```bash
# List all variables:
railway variables

# Update a variable:
railway variables set VARIABLE_NAME="new_value"

# Redeploy after changing variables:
railway up
```

---

**Ready? Start with Step 1: `railway login`** 🚀
