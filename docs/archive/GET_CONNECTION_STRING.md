# HOW TO GET YOUR SUPABASE CONNECTION STRING

## Step 1: Go to Supabase Settings
1. Open: https://supabase.com/dashboard/project/eabkwiklxjbqbfxcdlkk
2. Click the **gear icon** (⚙️) at the bottom left
3. Click **Database** in the left menu

## Step 2: Find Connection Pooling
1. Scroll down to **Connection Pooling** section
2. You'll see **Connection string**
3. Make sure **Transaction** mode is selected
4. Click **Copy** button

## Step 3: The Connection String Format
It should look like this:
```
postgresql://postgres.eabkwiklxjbqbfxcdlkk:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

## Step 4: Replace Password
Replace `[YOUR-PASSWORD]` with: `23110081aiiTgn`

Final string should be:
```
postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

## Step 5: Add to Render
1. Go to: https://dashboard.render.com
2. Select: **jobika-pyt**
3. Click: **Environment**
4. Find or Add: `DATABASE_URL`
5. Paste the connection string
6. Click: **Save Changes**

## Step 6: Redeploy
1. Click: **Manual Deploy** → **Deploy latest commit**
2. Wait for "Live" status

---

## IF THE CONNECTION STRING DOESN'T WORK:

Try the **Session** mode pooler instead:
```
postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

Or try the **Direct** connection:
```
postgresql://postgres:23110081aiiTgn@db.eabkwiklxjbqbfxcdlkk.supabase.co:5432/postgres
```
