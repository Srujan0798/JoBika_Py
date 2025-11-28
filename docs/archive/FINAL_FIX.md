# FINAL FIX - Correct DATABASE_URL for Render

## The Problem:
Render uses IPv4-only network and cannot reach Supabase's IPv6 direct connection.

## The Solution:
Use Supabase's **Session Pooler** with IPv4:

```
postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

## Steps to Fix:

### 1. Update DATABASE_URL in Render

1. Go to: https://dashboard.render.com
2. Click: **jobika-pyt**
3. Click: **Environment**
4. Find: `DATABASE_URL`
5. **Replace with this EXACT string**:
   ```
   postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
   ```
6. Click: **Save Changes**

### 2. Redeploy

1. Click: **Manual Deploy** → **Deploy latest commit**
2. Wait for "Live" status (2-3 minutes)

### 3. Verify

Open: https://jobika-pyt.onrender.com/health

Should show:
```json
{
  "status": "healthy",
  "database_type": "postgres",
  "tables_exist": true
}
```

## Why This Works:

- **Session Pooler** (port 5432) instead of Transaction Pooler (port 6543)
- Uses **IPv4** which Render supports
- Format: `postgresql://postgres.PROJECT_REF:PASSWORD@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`

## Connection String Breakdown:

```
postgresql://          ← Protocol
postgres.eabkwiklxjbqbfxcdlkk  ← Your project reference
:23110081aiiTgn        ← Your password
@aws-0-ap-south-1.pooler.supabase.com  ← Pooler hostname (IPv4)
:5432                  ← Session pooler port
/postgres              ← Database name
```

## If This Still Doesn't Work:

The issue might be with your Supabase project settings. Check:
1. Supabase Dashboard → Settings → Database
2. Make sure "Connection Pooling" is enabled
3. Try the "Transaction" mode pooler (port 6543) as a last resort

## After Success:

✅ Your app will be fully deployed with PostgreSQL
✅ All mock data removed
✅ All features working from database
