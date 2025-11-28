#!/bin/bash

cd backend

echo "🧹 Cleaning up backend folder..."

# Remove duplicate config files (already in root)
rm -f Procfile 2>/dev/null
rm -f railway.json 2>/dev/null
rm -f render.yaml 2>/dev/null

# Remove duplicate database files
rm -f jobika.db 2>/dev/null  # Will use root jobika.db

# Remove old migration scripts (already have seed_data.sql)
rm -f migrate_db.py 2>/dev/null
rm -f migrate_oauth.py 2>/dev/null
rm -f migrate_to_supabase.py 2>/dev/null

# Remove duplicate schema files (keep only supabase_schema.sql)
rm -f schema_update.sql 2>/dev/null
rm -f supabase_schema_updates.sql 2>/dev/null

# Remove test files from backend root (they're in tests/ folder)
rm -f check_db.py 2>/dev/null
rm -f test_rate_limit.py 2>/dev/null

# Remove temporary/log files
rm -f performance_log.json 2>/dev/null

# Remove duplicate READMEs (main one is in root)
rm -f README.md 2>/dev/null
rm -f ENHANCED_FEATURES.md 2>/dev/null

# Move seed_data.sql to deployment folder if not already there
if [ -f "seed_data.sql" ] && [ ! -f "../docs/deployment/seed_data.sql" ]; then
    cp seed_data.sql ../docs/deployment/ 2>/dev/null
fi

cd ..

echo "✅ Backend cleanup complete!"
