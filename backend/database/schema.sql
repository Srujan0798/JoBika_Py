-- JoBika Database Schema (PostgreSQL)
-- Global AI Job Platform (Production Ready)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Enhanced for India)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20), -- +91 format
    location VARCHAR(255),
    current_role VARCHAR(255),
    current_company VARCHAR(255),
    total_years NUMERIC(4,1) DEFAULT 0, -- e.g. 2.5 years
    
    -- India Specific Fields
    current_ctc INTEGER, -- In Rupees
    expected_ctc INTEGER, -- In Rupees
    notice_period INTEGER, -- Days (0, 15, 30, 60, 90)
    visa_status VARCHAR(50), -- Citizen, H1B, etc.
    
    -- Profile Data
    skills JSONB DEFAULT '[]', -- Array of strings
    profile_data JSONB DEFAULT '{}', -- Detailed profile info
    preferences JSONB DEFAULT '{}', -- Job preferences
    
    -- Platform Features
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, pro, premium
    credits INTEGER DEFAULT 0,
    linkedin_token TEXT,
    autopilot_config JSONB DEFAULT '{}',
    
    -- Metadata
    is_verified BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Jobs Table (Enhanced for Matching)
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    description TEXT,
    requirements TEXT,
    job_type VARCHAR(50), -- Full-time, Contract
    
    -- Salary & Exp (Normalized)
    salary_min INTEGER, -- LPA * 100000
    salary_max INTEGER,
    experience_min INTEGER, -- Years
    experience_max INTEGER,
    
    -- Metadata
    source VARCHAR(50), -- Naukri, LinkedIn, Direct
    source_url TEXT,
    is_fake BOOLEAN DEFAULT FALSE,
    location_tier VARCHAR(20), -- Metro, Tier-1, Tier-2
    
    -- JSON Data
    skills_required JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    
    posted_date TIMESTAMP WITH TIME ZONE,
    scraped_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- 3. Applications Table (Tracking)
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
    
    -- Snapshot Data (in case job is deleted)
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    job_url TEXT,
    
    -- Status Tracking
    status VARCHAR(50) DEFAULT 'Applied', -- Applied, Viewed, Interview, Offer, Rejected
    applied_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Application Details
    resume_version_id INTEGER,
    cover_letter_content TEXT,
    notes TEXT,
    
    -- Follow-ups
    follow_up_dates JSONB DEFAULT '[]',
    response_rate INTEGER,
    estimated_timeline VARCHAR(100)
);

-- 4. Resumes Table (Versioning)
CREATE TABLE IF NOT EXISTS resumes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    file_url TEXT, -- S3 URL
    content TEXT, -- Parsed text
    
    -- AI Analysis
    ats_score INTEGER,
    keywords JSONB DEFAULT '[]',
    suggestions JSONB DEFAULT '[]',
    
    version_name VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Job Matches (AI Engine)
CREATE TABLE IF NOT EXISTS job_matches (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id) ON DELETE CASCADE,
    match_score INTEGER, -- 0-100
    reasons JSONB, -- Why it matched (skills, exp, etc.)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, job_id)
);

-- 6. Referrals (Community)
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    referrer_id INTEGER REFERENCES users(id),
    referee_email VARCHAR(255),
    referral_code VARCHAR(50),
    status VARCHAR(50) DEFAULT 'pending', -- pending, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 7. Interview Simulations (AI Coach)
CREATE TABLE IF NOT EXISTS interview_simulations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    job_id INTEGER REFERENCES jobs(id),
    transcript JSONB, -- Full chat history
    feedback TEXT,
    score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Analytics Events (Tracking)
CREATE TABLE IF NOT EXISTS analytics_events (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    event_name VARCHAR(100) NOT NULL,
    properties JSONB DEFAULT '{}',
    ip_address VARCHAR(45),
    event_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. User Consents (GDPR/DPDP)
CREATE TABLE IF NOT EXISTS user_consents (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    consent_type VARCHAR(50) NOT NULL,
    granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_jobs_skills ON jobs USING GIN (skills_required);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_user ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_matches_score ON job_matches(user_id, match_score DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_time);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
