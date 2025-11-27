#!/bin/bash
# GitHub Push Helper Script
# This script helps push your code to GitHub

echo "🚀 Pushing JoBika to GitHub..."
echo ""

cd /Users/roshwinram/Downloads/JoBika_Pyt

# Check if there are commits to push
COMMITS=$(git log origin/master..HEAD --oneline 2>/dev/null | wc -l)

if [ "$COMMITS" -eq 0 ]; then
    echo "✅ Already up to date with GitHub"
    exit 0
fi

echo "📦 Found $COMMITS commit(s) to push"
echo ""

# Try to push
echo "Attempting to push to GitHub..."
git push origin master

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo "🔗 View at: https://github.com/Srujan0798/JoBika_Pyt"
else
    echo ""
    echo "❌ Push failed. This usually means:"
    echo "   1. You need to authenticate with GitHub"
    echo "   2. You don't have push permissions"
    echo ""
    echo "💡 Solutions:"
    echo ""
    echo "Option 1: Use GitHub CLI (recommended)"
    echo "  gh auth login"
    echo "  git push origin master"
    echo ""
    echo "Option 2: Use Personal Access Token"
    echo "  1. Go to: https://github.com/settings/tokens"
    echo "  2. Generate new token (classic)"
    echo "  3. Select 'repo' scope"
    echo "  4. Copy the token"
    echo "  5. Run: git push origin master"
    echo "  6. Username: Srujan0798"
    echo "  7. Password: [paste your token]"
    echo ""
    echo "Option 3: Use SSH"
    echo "  git remote set-url origin git@github.com:Srujan0798/JoBika_Pyt.git"
    echo "  git push origin master"
    echo ""
    exit 1
fi
