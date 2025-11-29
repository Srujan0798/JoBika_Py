# ===========================
# JoBika Backend - Real Data Implementation
# ===========================

# To start the server:
cd backend && node server.js

# IMPORTANT: Add your OpenAI API key to .env file
# Get it from: https://platform.openai.com/api-keys

# Database will be created automatically at: backend/database/jobika.db

# ===========================
# API Endpoints Available:
# ===========================

# Authentication
POST /api/auth/register
POST /api/auth/login

# Applications
GET  /api/applications
POST /api/applications
PUT  /api/applications/:id/status

# Jobs
POST /api/scrape-jobs
GET  /api/jobs

# AI Chat
POST /api/orion/chat
GET  /api/orion/history

# ATS Resume Check
POST /api/ats-check

# Analytics
GET /api/analytics

# AI Services
POST /api/cover-letter
POST /api/interview-prep
