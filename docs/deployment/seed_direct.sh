#!/bin/bash
# Seed script using DIRECT connection (not pooler)

echo "🌱 Seeding Supabase Database (Direct Connection)..."
echo ""

# Direct connection (port 5432, not 6543)
export DATABASE_URL="postgresql://postgres:23110081aiiTgn@db.eabkwiklxjbqbfxcdlkk.supabase.co:5432/postgres"

# Run the seed script
python3 backend/seed_data.py

echo ""
echo "✅ Done!"
