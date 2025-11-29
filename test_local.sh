#!/bin/bash

# JoBika Local Testing Script
# Tests all core functionality before deployment

echo "🧪 JoBika Local Testing Suite"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
PASSED=0
FAILED=0

# Function to test
test_feature() {
    local name=$1
    local command=$2
    
    echo -n "Testing $name... "
    if eval "$command" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ PASS${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}"
        ((FAILED++))
    fi
}

# 1. Check Node.js
echo "📦 Checking Dependencies..."
test_feature "Node.js" "node --version"
test_feature "NPM" "npm --version"
echo ""

# 2. Check Backend Files
echo "📁 Checking Backend Files..."
test_feature "server.js" "test -f backend/server.js"
test_feature "package.json" "test -f backend/package.json"
test_feature ".env file" "test -f backend/.env"
test_feature "Database module" "test -f backend/database/db.js"
test_feature "GeminiService" "test -f backend/services/GeminiService.js"
echo ""

# 3. Check Frontend Files
echo "🎨 Checking Frontend Files..."
test_feature "index.html" "test -f app/index.html"
test_feature "dashboard.html" "test -f app/dashboard.html"
test_feature "api.js" "test -f app/assets/js/api.js"
test_feature "index.css" "test -f app/assets/css/index.css"
echo ""

# 4. Check Environment Variables
echo "🔐 Checking Environment Variables..."
cd backend
source .env 2>/dev/null || true
test_feature "DATABASE_TYPE" "test -n '$DATABASE_TYPE'"
test_feature "GEMINI_API_KEY" "test -n '$GEMINI_API_KEY'"
test_feature "JWT_SECRET" "test -n '$JWT_SECRET'"
cd ..
echo ""

# 5. Check NPM Packages
echo "📦 Checking NPM Packages..."
cd backend
test_feature "express" "npm list express --depth=0"
test_feature "dotenv" "npm list dotenv --depth=0"
test_feature "bcrypt" "npm list bcrypt --depth=0"
test_feature "pg" "npm list pg --depth=0"
cd ..
echo ""

# 6. Test Node.js Modules
echo "🔧 Testing Node.js Modules..."
test_feature "Express loads" "cd backend && node -e \"require('express')\""
test_feature "Database module loads" "cd backend && node -e \"require('./database/db')\""
test_feature "GeminiService loads" "cd backend && node -e \"require('./services/GeminiService')\""
echo ""

# Summary
echo "=============================="
echo "📊 Test Summary:"
echo -e "  ${GREEN}Passed: $PASSED${NC}"
echo -e "  ${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    echo "🚀 Ready for deployment!"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo "⚠️  Fix issues before deploying"
    exit 1
fi
