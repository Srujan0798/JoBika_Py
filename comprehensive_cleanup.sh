#!/bin/bash

echo "🧹 Starting comprehensive cleanup..."

# Remove duplicate/old HTML/CSS/JS files from root (they're in app/ folder)
rm -f index.html 2>/dev/null
rm -f script.js 2>/dev/null
rm -f style.css 2>/dev/null

# Remove old setup/deployment scripts (keep only essential ones)
rm -f cleanup_docs.sh 2>/dev/null
rm -f deploy_to_github.bat 2>/dev/null
rm -f push_to_github.sh 2>/dev/null
rm -f setup-github.sh 2>/dev/null
rm -f setup.sh 2>/dev/null
rm -f start-server.bat 2>/dev/null
rm -f quickstart.py 2>/dev/null
rm -f fix_html_files.py 2>/dev/null

# Remove old config files (keep only Render-specific ones)
rm -f railway.json 2>/dev/null

# Remove temporary/log files
rm -f performance_log.json 2>/dev/null

# Remove JoBika folder if it's duplicate/old
if [ -d "JoBika" ]; then
    echo "⚠️  Found JoBika folder - checking if it's needed..."
    # Archive it instead of deleting
    mv JoBika docs/archive/old_JoBika_folder 2>/dev/null
fi

# Remove mobile folder if it's not being used
if [ -d "mobile" ]; then
    echo "⚠️  Found mobile folder - archiving..."
    mv mobile docs/archive/old_mobile_folder 2>/dev/null
fi

# Clean up backend folder
cd backend

# Remove old/duplicate Python files
rm -f schema_updates.sql 2>/dev/null  # Already in supabase_schema.sql
rm -f seed_data.py 2>/dev/null  # Already have seed_simple.sql

cd ..

echo "✅ Cleanup complete!"
echo ""
echo "📊 Remaining structure:"
ls -la | grep -E "^d|^-" | grep -v "^\." | awk '{print $9}' | grep -v "^$"
