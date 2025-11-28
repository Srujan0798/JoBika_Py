# CORRECT DATABASE_URL FOR RENDER

## USE THIS CONNECTION STRING:

```
postgresql://postgres:23110081aiiTgn@db.eabkwiklxjbqbfxcdlkk.supabase.co:5432/postgres
```

## Steps to Update in Render:

1. Go to: https://dashboard.render.com
2. Click: **jobika-pyt**
3. Click: **Environment** (left sidebar)
4. Find: `DATABASE_URL`
5. **DELETE the old value**
6. **Paste this EXACT string**:
   ```
   postgresql://postgres:23110081aiiTgn@db.eabkwiklxjbqbfxcdlkk.supabase.co:5432/postgres
   ```
7. Click: **Save Changes**
8. Click: **Manual Deploy** → **Deploy latest commit**

## Why This Works:

- Uses **DIRECT** connection (port 5432) instead of pooler (port 6543)
- Format: `postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres`
- This is the standard Supabase connection string

## After Deployment:

Check: https://jobika-pyt.onrender.com/health

Should show:
```json
{
  "status": "healthy",
  "database_type": "postgres",
  "tables_exist": true
}
```
