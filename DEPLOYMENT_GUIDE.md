# 🚀 Final Deployment Steps

## ✅ What's Done
- [x] Mock data migrated to PostgreSQL tables
- [x] Backend refactored to use database
- [x] Local testing completed successfully
- [x] Code committed and pushed to GitHub

## 📋 What You Need to Do Now

### Step 1: Apply Schema to Supabase

**Option A: Using Supabase Dashboard (Recommended)**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the contents of `backend/supabase_schema.sql`
6. Paste into the SQL editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Wait for "Success. No rows returned" message

**Option B: Using Command Line**
```bash
# Set your Supabase connection string
export DATABASE_URL="postgresql://postgres.eabkwiklxjbqbfxcdlkk:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

# Run the deployment script
./deploy_production.sh
```

### Step 2: Seed the Database

**Option A: Using the Seed Script**
```bash
# Make sure DATABASE_URL is set
export DATABASE_URL="your-supabase-connection-string"

# Run seed script
python3 backend/seed_data.py
```

**Option B: Manual SQL (if script fails)**
You can manually insert data using Supabase SQL Editor. I can provide the SQL if needed.

### Step 3: Configure Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your **jobika-pyt** service
3. Click **Environment** in the left sidebar
4. Verify `DATABASE_URL` is set correctly:
   ```
   postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
   ```
5. Click **Manual Deploy** → **Deploy latest commit**

### Step 4: Verify Deployment

Once Render shows "Live":

**Check Health Endpoint**
```bash
curl https://jobika-pyt.onrender.com/health
```

Expected response:
```json
{
  "status": "healthy",
  "database_type": "postgres",
  "tables_exist": true,
  "version": "1.0.0"
}
```

**Check Debug Endpoint**
```bash
curl https://jobika-pyt.onrender.com/debug-db
```

Expected response:
```json
{
  "database_url_set": true,
  "database_type": "postgres",
  "connection_successful": true
}
```

**Test Salary Insights**
```bash
curl -X POST https://jobika-pyt.onrender.com/api/salary/insights \
  -H "Content-Type: application/json" \
  -d '{"jobTitle": "software engineer", "location": "san francisco", "experienceYears": 3}'
```

### Step 5: Test the Application

1. Open https://jobika-pyt.onrender.com
2. Register a new account
3. Upload a resume
4. Search for jobs
5. Try these features:
   - Generate cover letter
   - Get interview prep
   - View salary insights
   - Customize resume

## 🐛 Troubleshooting

### If schema application fails:
```sql
-- Drop existing tables if needed
DROP TABLE IF EXISTS domain_skills CASCADE;
DROP TABLE IF EXISTS interview_tips CASCADE;
DROP TABLE IF EXISTS interview_questions CASCADE;
DROP TABLE IF EXISTS location_multipliers CASCADE;
DROP TABLE IF EXISTS salary_roles CASCADE;

-- Then re-run the schema
```

### If seed script fails:
Check the error message. Common issues:
- **Connection timeout**: Use the pooler connection string (port 6543)
- **Permission denied**: Make sure you're using the correct password
- **Table doesn't exist**: Run the schema first

### If Render deployment fails:
1. Check the logs in Render dashboard
2. Verify `DATABASE_URL` is correct
3. Make sure Python version is set to `3.10.12`

## 📞 Need Help?

If you encounter any issues:
1. Check Render logs
2. Check Supabase logs
3. Run `python3 test_migration.py` locally to verify your changes
4. Let me know the specific error message

## ✅ Success Criteria

You'll know everything is working when:
- [ ] Health endpoint returns `database_type: "postgres"`
- [ ] Debug endpoint shows `connection_successful: true`
- [ ] Salary insights API returns data
- [ ] Interview prep API returns questions
- [ ] Resume customizer works
- [ ] All features work on the live site
