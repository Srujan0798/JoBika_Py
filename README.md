# JoBika - AI-Powered Job Application Platform

> **Status**: ✅ Working with SQLite | 🔄 PostgreSQL support coming soon

## Quick Start

### 1. Deploy to Render

1. **Remove DATABASE_URL** from Render environment variables
2. **Deploy** the latest commit
3. **Done!** App works immediately with SQLite

### 2. Local Development

```bash
# Install dependencies
pip install -r backend/requirements.txt

# Run server
python start.py
```

Visit: http://localhost:5000

---

## Project Structure

```
JoBika_Pyt/
├── app/                    # Frontend (HTML/CSS/JS)
├── backend/                # Python Flask backend
│   ├── server.py          # Main server
│   ├── database.py        # Database connection
│   ├── tests/             # Test scripts
│   └── *.py               # Feature modules
├── docs/                   # Documentation
│   ├── archive/           # Old deployment guides
│   └── deployment/        # Deployment scripts
├── APP_NOW_WORKS.md       # ⭐ Current deployment guide
├── MIGRATION_SUMMARY.md   # Database migration details
└── README.md              # This file
```

---

## Features

- ✅ **AI Resume Parser** - Extract skills, experience from PDFs/DOCX
- ✅ **Job Scraping** - Scrape jobs from LinkedIn, Indeed, Glassdoor
- ✅ **Auto-Apply** - Automatically apply to matching jobs
- ✅ **Resume Customizer** - Tailor resume for each job
- ✅ **Interview Prep** - AI-generated interview questions
- ✅ **Salary Insights** - Market salary data
- ✅ **OAuth Login** - Google, LinkedIn authentication
- ✅ **Email Notifications** - Job alerts and reminders

---

## Database

**Current**: SQLite (temporary, data resets on Render redeploys)

**Future**: PostgreSQL via Supabase (requires Connection Pooling)

### To Switch to PostgreSQL:

1. Enable Connection Pooling in Supabase
2. Add `DATABASE_URL` to Render environment
3. Redeploy

See `docs/archive/ENABLE_POOLING_GUIDE.md` for details.

---

## Deployment

### Render (Current)

- **URL**: https://jobika-pyt.onrender.com
- **Database**: SQLite
- **Environment**: `SECRET_KEY` required for OAuth

### Requirements

- Python 3.10+
- Flask 3.1.0
- See `backend/requirements.txt` for full list

---

## Documentation

- **`APP_NOW_WORKS.md`** - Current deployment instructions
- **`MIGRATION_SUMMARY.md`** - Database migration details
- **`docs/archive/`** - Historical deployment guides
- **`docs/deployment/`** - Deployment scripts and SQL files

---

## Development

### Run Tests

```bash
python backend/tests/test_features.py
```

### Database Schema

```bash
# View schema
cat backend/supabase_schema.sql

# Seed data
python backend/seed_data.py
```

---

## Support

For issues or questions, check:
1. `APP_NOW_WORKS.md` - Latest deployment guide
2. `docs/archive/` - Historical troubleshooting
3. GitHub Issues

---

## License

MIT License - See LICENSE file for details
