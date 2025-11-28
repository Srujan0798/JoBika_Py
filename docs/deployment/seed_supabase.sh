#!/bin/bash
# Run this script on YOUR Mac to seed the Supabase database

echo "🌱 Seeding Supabase Database..."
echo ""

# Your Supabase connection string (pooler)
export DATABASE_URL="postgresql://postgres.eabkwiklxjbqbfxcdlkk:23110081aiiTgn@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

# Run the seed script
python3 backend/seed_data.py

echo ""
echo "✅ Done! Now go to Render and deploy."
