const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

class DatabaseManager {
    constructor(dbPath = null) {
        this.dbPath = dbPath || path.join(__dirname, 'jobika.db');
        this.db = null;
        this.init();
    }

    init() {
        try {
            this.db = new Database(this.dbPath);
            this.db.pragma('journal_mode = WAL');

            // Run schema if database is new
            const schemaPath = path.join(__dirname, 'schema.sql');
            const schema = fs.readFileSync(schemaPath, 'utf8');
            this.db.exec(schema);

            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    // User methods
    createUser(email, passwordHash, name, profileData = {}) {
        const stmt = this.db.prepare(`
            INSERT INTO users (email, password_hash, name, profile_data)
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(email, passwordHash, name, JSON.stringify(profileData));
    }

    getUserByEmail(email) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE email = ?');
        return stmt.get(email);
    }

    getUserById(id) {
        const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    }

    // Application methods
    createApplication(userId, data) {
        const stmt = this.db.prepare(`
            INSERT INTO applications (user_id, company, role, location, salary_range, job_url, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            userId,
            data.company,
            data.role,
            data.location || null,
            data.salary_range || null,
            data.job_url || null,
            data.notes || null
        );
    }

    getApplications(userId, status = null) {
        let query = 'SELECT * FROM applications WHERE user_id = ?';
        const params = [userId];

        if (status) {
            query += ' AND status = ?';
            params.push(status);
        }

        query += ' ORDER BY applied_date DESC';
        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    updateApplicationStatus(id, status) {
        const stmt = this.db.prepare(`
            UPDATE applications 
            SET status = ?, last_updated = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        return stmt.run(status, id);
    }

    // Job methods
    saveJob(jobData) {
        const stmt = this.db.prepare(`
            INSERT INTO jobs (title, company, location, salary, description, requirements, 
                            job_type, experience_required, skills_required, source, source_url, posted_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        return stmt.run(
            jobData.title,
            jobData.company,
            jobData.location || null,
            jobData.salary || null,
            jobData.description || null,
            jobData.requirements || null,
            jobData.job_type || null,
            jobData.experience_required || null,
            JSON.stringify(jobData.skills_required || []),
            jobData.source,
            jobData.source_url,
            jobData.posted_date || new Date().toISOString()
        );
    }

    searchJobs(filters = {}) {
        let query = 'SELECT * FROM jobs WHERE is_active = 1';
        const params = [];

        if (filters.title) {
            query += ' AND title LIKE ?';
            params.push(`%${filters.title}%`);
        }

        if (filters.location) {
            query += ' AND location LIKE ?';
            params.push(`%${filters.location}%`);
        }

        if (filters.company) {
            query += ' AND company LIKE ?';
            params.push(`%${filters.company}%`);
        }

        query += ' ORDER BY scraped_at DESC LIMIT ?';
        params.push(filters.limit || 50);

        const stmt = this.db.prepare(query);
        return stmt.all(...params);
    }

    // Resume methods
    saveResume(userId, content, fileName = null) {
        const stmt = this.db.prepare(`
            INSERT INTO resumes (user_id, file_name, content)
            VALUES (?, ?, ?)
        `);
        return stmt.run(userId, fileName, content);
    }

    updateResumeAnalysis(resumeId, atsScore, keywords, suggestions) {
        const stmt = this.db.prepare(`
            UPDATE resumes 
            SET ats_score = ?, keywords = ?, suggestions = ?, last_analyzed = CURRENT_TIMESTAMP
            WHERE id = ?
        `);
        return stmt.run(atsScore, JSON.stringify(keywords), JSON.stringify(suggestions), resumeId);
    }

    getLatestResume(userId) {
        const stmt = this.db.prepare(`
            SELECT * FROM resumes WHERE user_id = ? ORDER BY last_analyzed DESC LIMIT 1
        `);
        return stmt.get(userId);
    }

    // Chat history methods
    saveChatMessage(userId, role, content, folder = 'All') {
        const stmt = this.db.prepare(`
            INSERT INTO chat_history (user_id, role, content, folder)
            VALUES (?, ?, ?, ?)
        `);
        return stmt.run(userId, role, content, folder);
    }

    getChatHistory(userId, folder = null, limit = 100) {
        let query = 'SELECT * FROM chat_history WHERE user_id = ?';
        const params = [userId];

        if (folder && folder !== 'All') {
            query += ' AND folder = ?';
            params.push(folder);
        }

        query += ' ORDER BY created_at DESC LIMIT ?';
        params.push(limit);

        const stmt = this.db.prepare(query);
        return stmt.all(...params).reverse(); // Return in chronological order
    }

    pinChatMessage(id, pinned = true) {
        const stmt = this.db.prepare('UPDATE chat_history SET pinned = ? WHERE id = ?');
        return stmt.run(pinned ? 1 : 0, id);
    }

    // Analytics methods
    getApplicationStats(userId) {
        const stmt = this.db.prepare(`
            SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'Applied' THEN 1 ELSE 0 END) as applied,
                SUM(CASE  WHEN status = 'Interview' THEN 1 ELSE 0 END) as interviews,
                SUM(CASE WHEN status = 'Offer' THEN 1 ELSE 0 END) as offers,
                SUM(CASE WHEN status = 'Rejected' THEN 1 ELSE 0 END) as rejected
            FROM applications WHERE user_id = ?
        `);
        return stmt.get(userId);
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = DatabaseManager;
