# 🚀 JoBika - AI-Powered Job Application Platform

**India's first AI-powered job search platform with resume tailoring and auto-apply.**

---

## 🎯 **Tech Stack**

```
Frontend:  React + Vite + TailwindCSS (Vercel)
Backend:   Node.js + Express (Railway)
Database:  PostgreSQL (Supabase) + SQLite Fallback
AI:        Google Gemini (Free Tier)
Automation: Puppeteer (Auto-Apply)
```

---

## ⚡ **Quick Start (5 minutes)**

### 1. Clone & Install
```bash
git clone https://github.com/Srujan0798/JoBika_Pyt.git
cd JoBika_Pyt

# Install Backend
cd backend && npm install

# Install Frontend
cd ../frontend && npm install
```

### 2. Setup Environment
Create `backend/.env`:
```bash
DATABASE_TYPE=postgres
DATABASE_URL=your_supabase_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secret_key
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Locally
**Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:8080
```

**Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

---

## 📦 **Deployment**

### Backend → Railway
1. Connect GitHub repo to Railway.
2. Set Root Directory to `backend`.
3. Add Variables:
   - `DATABASE_URL`, `GEMINI_API_KEY`, `JWT_SECRET`, `NODE_ENV=production`
   - `FRONTEND_URL` (Your Vercel URL)
   - `ALLOWED_ORIGINS` (Your Vercel URL)
   - `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`

### Frontend → Vercel
1. Connect GitHub repo to Vercel.
2. Set Root Directory to `frontend`.
3. Framework Preset: `Vite`.
4. Deploy!

---

## 📁 **Project Structure**

```
JoBika_Pyt/
├── frontend/               # React + Vite App
│   ├── src/
│   ├── public/
│   └── vite.config.js
│
├── backend/                # Node.js API
│   ├── server.js          # Main entry point
│   ├── database/          # DB Manager (Postgres/SQLite)
│   ├── services/          # AI & Scraper Services
│   ├── middleware/        # Security & Auth
│   └── Dockerfile         # Deployment config
│
└── README.md              # This file
```

---

## 🔐 **Environment Variables**

### Backend (Railway)
```bash
# Database
DATABASE_TYPE=postgres
DATABASE_URL=postgresql://...
DATABASE_SSL=require

# AI
GEMINI_API_KEY=AIzaSy...

# Security
JWT_SECRET=...
ALLOWED_ORIGINS=https://jobika-pyt.vercel.app,http://localhost:5173
FRONTEND_URL=https://jobika-pyt.vercel.app

# Puppeteer
PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
```

---

## 📄 **License**
MIT License

**Built with ❤️ in India 🇮🇳**
