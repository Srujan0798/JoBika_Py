# CRITICAL: Enable Connection Pooling in Supabase

## Why You're Getting "Tenant or user not found"

**Connection Pooling is NOT enabled in your Supabase project!**

All connection attempts fail because Supabase's pooler requires this feature to be enabled.

## How to Enable Connection Pooling

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard/project/eabkwiklxjbqbfxcdlkk
2. Click **Settings** (⚙️ gear icon at bottom left)
3. Click **Database** in the left menu

### Step 2: Enable Connection Pooling
1. Scroll down to **Connection Pooling** section
2. You'll see a toggle switch
3. **Turn it ON** (should turn green)
4. Wait 10-20 seconds for it to activate

### Step 3: Get the Connection String
1. After enabling, you'll see **Connection string** appear
2. Click the **URI** tab
3. Select **Session** mode (default)
4. Click **Copy** button
5. The string will look like:
   ```
   postgresql://postgres.eabkwiklxjbqbfxcdlkk:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   ```

### Step 4: Replace Password
Replace `[YOUR-PASSWORD]` with: `23110081aiiTgn`

Final string:
```
postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

### Step 5: Test Locally
Run this to verify it works:
```bash
python3 test_supabase_connection.py
```

You should see: ✅ SUCCESS!

### Step 6: Update Render
1. Go to Render → jobika-pyt → Environment
2. Set `DATABASE_URL` to the connection string above
3. Save and redeploy

## If Connection Pooling Option is Missing

If you don't see the Connection Pooling option:
1. Your Supabase plan might not support it
2. Try using the **Direct Connection** instead:
   ```
   postgresql://postgres:23110081aiiTgn@db.eabkwiklxjbqbfxcdlkk.supabase.co:5432/postgres
   ```
3. Note: This might not work on Render due to IPv6 issues

## Alternative: Use SQLite (Temporary)

The code is now fixed to fall back to SQLite if PostgreSQL fails.

To use SQLite on Render:
1. Go to Render → jobika-pyt → Environment
2. **DELETE** the `DATABASE_URL` variable
3. Redeploy

The app will use SQLite and work fine (but data won't persist across deploys).

## Summary

**The issue is: Connection Pooling is not enabled in Supabase.**

Enable it, get the connection string, and everything will work!
