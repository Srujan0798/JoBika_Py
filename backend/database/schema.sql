-- JoBika Database Schema
-- SQLite Database for Production

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    current_role TEXT,
    current_company TEXT,
    total_years INTEGER DEFAULT 0,
    expected_ctc INTEGER,
    current_ctc INTEGER,
    notice_period INTEGER,
    skills TEXT, -- JSON array
    profile_data TEXT, -- JSON object
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Applications table
CREATE TABLE IF NOT EXISTS applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    location TEXT,
    salary_range TEXT,
    status TEXT DEFAULT 'Applied', -- Applied, Viewed, Interview, Offer, Rejected
    applied_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    job_url TEXT,
    notes TEXT,
    response_rate INTEGER, -- Company's typical response rate
    position_ranking TEXT, -- e.g., "Top 15%"
    estimated_timeline TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Jobs table (scraped jobs)
CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    salary TEXT,
    description TEXT,
    requirements TEXT,
    job_type TEXT, -- Full-time, Contract, etc.
    experience_required TEXT,
    skills_required TEXT, -- JSON array
    source TEXT, -- LinkedIn, Naukri, Indeed
    source_url TEXT,
    posted_date DATETIME,
    scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT 1
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    file_name TEXT,
    content TEXT NOT NULL, -- Resume text content
    ats_score INTEGER,
    keywords TEXT, -- JSON array
    suggestions TEXT, -- JSON array
    last_analyzed DATETIME DEFAULT CURRENT_TIMESTAMP,
    version INTEGER DEFAULT 1,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Chat history table
CREATE TABLE IF NOT EXISTS chat_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    role TEXT NOT NULL, -- 'user' or 'assistant'
    content TEXT NOT NULL,
    folder TEXT DEFAULT 'All', -- All, Resume, Interview, Salary
    pinned BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
CREATE INDEX IF NOT EXISTS idx_jobs_scraped_at ON jobs(scraped_at);
CREATE INDEX IF NOT EXISTS idx_chat_user_id ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_folder ON chat_history(folder);
