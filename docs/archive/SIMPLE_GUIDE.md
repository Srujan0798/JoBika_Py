# SUPER SIMPLE DEPLOYMENT GUIDE

## Your DATABASE_URL (for Render):
```
postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

## DO THIS NOW (3 Easy Steps):

### STEP 1: Apply Schema (2 minutes)
1. Go to: https://supabase.com/dashboard
2. Click: **SQL Editor** → **New Query**
3. Open file: `backend/supabase_schema.sql`
4. Copy ALL the text (Cmd+A, Cmd+C)
5. Paste into Supabase SQL Editor
6. Click: **RUN**
7. Wait for: "Success. No rows returned"

✅ Schema applied!

---

### STEP 2: Seed Data (1 minute)
Open Terminal on your Mac and run:
```bash
cd /Users/roshwinram/Downloads/JoBika_Pyt
./seed_supabase.sh
```

You should see:
```
✅ Seeded 11 salary roles and 8 locations
✅ Seeded 19 questions and 15 tips
✅ Seeded 7 domain skill sets
```

✅ Data seeded!

---

### STEP 3: Deploy on Render (3 minutes)
1. Go to: https://dashboard.render.com
2. Click on: **jobika-pyt**
3. Click: **Environment** (left sidebar)
4. Find: `DATABASE_URL`
5. Update to:
   ```
   postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
6. Click: **Save Changes**
7. Click: **Manual Deploy** → **Deploy latest commit**
8. Wait for: "Live" status (takes 2-3 minutes)

✅ Deployed!

---

### STEP 4: Verify (30 seconds)
Open in browser:
```
https://jobika-pyt.onrender.com/health
```

Should show:
```json
{
  "status": "healthy",
  "database_type": "postgres",
  "tables_exist": true
}
```

✅ DONE! Your app is live with PostgreSQL!

---

## WHERE TO RUN WHAT:

| Command | Where to Run |
|---------|-------------|
| Apply Schema | Supabase Dashboard (web browser) |
| `./seed_supabase.sh` | Your Mac Terminal |
| Deploy | Render Dashboard (web browser) |

## IMPORTANT:
- DATABASE_URL is YOUR Supabase connection string
- You run `seed_supabase.sh` on YOUR Mac
- It connects to YOUR Supabase database
- Render will also use this same DATABASE_URL
