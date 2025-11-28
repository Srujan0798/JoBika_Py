#!/bin/bash

# Move outdated deployment docs to archive
mv ACCOUNT_INFO.md docs/archive/ 2>/dev/null
mv ACTION_PLAN.md docs/archive/ 2>/dev/null
mv CORRECT_DATABASE_URL.md docs/archive/ 2>/dev/null
mv CRITICAL_FIXES_NEEDED.md docs/archive/ 2>/dev/null
mv CURRENT_STEP.md docs/archive/ 2>/dev/null
mv DEPLOYMENT.md docs/archive/ 2>/dev/null
mv DEPLOYMENT_GUIDE.md docs/archive/ 2>/dev/null
mv DEPLOYMENT_STATUS.md docs/archive/ 2>/dev/null
mv DEPLOYMENT_SUCCESS.md docs/archive/ 2>/dev/null
mv DO_THIS_NOW.md docs/archive/ 2>/dev/null
mv ENABLE_CONNECTION_POOLING.md docs/archive/ 2>/dev/null
mv ENABLE_POOLING_GUIDE.md docs/archive/ 2>/dev/null
mv FINAL_FIX.md docs/archive/ 2>/dev/null
mv FINAL_SUPABASE_SETUP.md docs/archive/ 2>/dev/null
mv FRONTEND_INTEGRATION_SUMMARY.md docs/archive/ 2>/dev/null
mv GET_CONNECTION_STRING.md docs/archive/ 2>/dev/null
mv LIVE_DEPLOYMENT.md docs/archive/ 2>/dev/null
mv QUICK_DEPLOY.md docs/archive/ 2>/dev/null
mv QUICK_START.txt docs/archive/ 2>/dev/null
mv README_COMPLETE_DEPLOYMENT.md docs/archive/ 2>/dev/null
mv READ_THIS_NOW.md docs/archive/ 2>/dev/null
mv SIMPLE_GUIDE.md docs/archive/ 2>/dev/null

# Move deployment scripts to deployment folder
mv complete_deployment.sh docs/deployment/ 2>/dev/null
mv deploy_production.sh docs/deployment/ 2>/dev/null
mv seed_direct.sh docs/deployment/ 2>/dev/null
mv seed_supabase.sh docs/deployment/ 2>/dev/null
mv check_tables.sql docs/deployment/ 2>/dev/null
mv seed_simple.sql docs/deployment/ 2>/dev/null

# Move test scripts to backend/tests
mkdir -p backend/tests
mv test_features.py backend/tests/ 2>/dev/null
mv test_migration.py backend/tests/ 2>/dev/null
mv test_supabase_connection.py backend/tests/ 2>/dev/null
mv verify_and_migrate.py backend/tests/ 2>/dev/null
mv verify_deployment.py backend/tests/ 2>/dev/null

echo "✅ Documentation organized!"
