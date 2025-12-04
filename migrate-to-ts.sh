#!/bin/bash

# Batch convert all .js files to .ts in backend
# This script renames files and updates require/module.exports to import/export

echo "🔄 Starting TypeScript migration..."

# Find all .js files in services, routes, middleware, utils
find backend/services backend/routes backend/middleware backend/utils -name "*.js" -type f 2>/dev/null | while read file; do
  # Get the .ts filename
  tsfile="${file%.js}.ts"
  
  # Skip if .ts already exists
  if [ -f "$tsfile" ]; then
    echo "⏭️  Skipping $file (TS version exists)"
    continue
  fi
  
  echo "📝 Converting: $file → $tsfile"
  
  # Copy to .ts
  cp "$file" "$tsfile"
  
  # Basic conversions (sed)
  sed -i '' 's/const \(.*\) = require(\(.*\));/import \1 from \2;/g' "$tsfile"
  sed -i '' 's/module\.exports = /export default /g' "$tsfile"
  sed -i '' 's/module\.exports\./export /g' "$tsfile"
  
  # Remove old .js file
  rm "$file"
  
  echo "✅ Converted: $tsfile"
done

echo "🎉 Migration complete!"
