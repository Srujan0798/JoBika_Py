-- Check if tables exist in Supabase
-- Run this in Supabase SQL Editor to verify

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
