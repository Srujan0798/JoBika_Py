const { Pool } = require('pg');

/**
 * Production Database Manager - PostgreSQL Only
 */
class DatabaseManager {
    constructor() {
        this.initPostgres();
    }

    initPostgres() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.DATABASE_SSL === 'require' ? {
                rejectUnauthorized: false
            } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });

        this.pool.on('error', (err) => {
            console.error('Unexpected PostgreSQL error', err);
        });

        console.log('✅ PostgreSQL connection pool initialized');
    }

    async query(sql, params = []) {
        try {
            const result = await this.pool.query(sql, params);
            return {
                rows: result.rows,
                rowCount: result.rowCount,
                lastInsertRowid: result.rows[0]?.id
            };
        } catch (error) {
            console.error('Database query error:', error);
            console.error('Query:', sql);
            console.error('Params:', params);
            throw error;
        }
    }

    async safeQuery(sql, params = []) {
        if (sql.includes('${') || sql.includes('+')) {
            throw new Error('SQL injection risk detected! Use parameterized queries.');
        }
        return this.query(sql, params);
    }

    async getUserById(userId) {
        try {
            const result = await this.safeQuery(
                'SELECT * FROM users WHERE id = $1',
                [userId]
            );
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    }

    async createApplication(userId, jobData) {
        const { job_id, company, role, location, job_url, status = 'Applied' } = jobData;

        const result = await this.safeQuery(`
            INSERT INTO applications (user_id, job_id, company, role, location, job_url, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id
        `, [userId, job_id, company, role, location, job_url, status]);

        return result.rows[0].id;
    }

    async getUserApplications(userId) {
        const result = await this.safeQuery(
            'SELECT * FROM applications WHERE user_id = $1 ORDER BY applied_at DESC',
            [userId]
        );
        return result.rows;
    }

    async searchJobs(filters = {}) {
        let sql = 'SELECT * FROM jobs WHERE is_active = $1';
        let params = [true];
        let paramIndex = 2;

        if (filters.title) {
            sql += ` AND title ILIKE $${paramIndex}`;
            params.push(`%${filters.title}%`);
            paramIndex++;
        }

        if (filters.location) {
            sql += ` AND location ILIKE $${paramIndex}`;
            params.push(`%${filters.location}%`);
            paramIndex++;
        }

        if (filters.company) {
            sql += ` AND company ILIKE $${paramIndex}`;
            params.push(`%${filters.company}%`);
            paramIndex++;
        }

        sql += ` ORDER BY scraped_at DESC LIMIT $${paramIndex}`;
        params.push(filters.limit || 50);

        const result = await this.safeQuery(sql, params);
        return result.rows;
    }

    async getLatestResume(userId) {
        const result = await this.safeQuery(
            'SELECT * FROM resumes WHERE user_id = $1 ORDER BY uploaded_at DESC LIMIT 1',
            [userId]
        );
        return result.rows[0] || null;
    }

    async close() {
        await this.pool.end();
    }
}

module.exports = DatabaseManager;

