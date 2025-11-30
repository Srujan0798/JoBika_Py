const db = require('../database/db');

class MatchingEngine {
    constructor() {
        this.db = new db();
    }

    async calculateMatchScore(userId, jobId) {
        const user = await this.db.getUserById(userId);
        const job = (await this.db.query('SELECT * FROM jobs WHERE id = $1', [jobId])).rows[0];

        if (!user || !job) return 0;

        let score = 0;
        const weights = {
            skills: 0.4,
            experience: 0.25,
            location: 0.15,
            salary: 0.1,
            culture: 0.1
        };

        // 1. Skills Match
        const userSkills = (user.skills || []).map(s => s.toLowerCase());
        const jobSkills = (job.skills_required || []).map(s => s.toLowerCase());

        if (jobSkills.length > 0) {
            const matched = jobSkills.filter(s => userSkills.includes(s));
            score += (matched.length / jobSkills.length) * 100 * weights.skills;
        } else {
            score += 100 * weights.skills; // No skills required?
        }

        // 2. Experience Match
        const userExp = parseFloat(user.total_years || 0);
        const minExp = job.experience_min || 0;
        const maxExp = job.experience_max || 100;

        if (userExp >= minExp && userExp <= maxExp) {
            score += 100 * weights.experience;
        } else if (userExp < minExp) {
            const diff = minExp - userExp;
            score += Math.max(0, 100 - (diff * 20)) * weights.experience;
        } else {
            score += 100 * weights.experience; // Overqualified is usually fine
        }

        // 3. Location Match
        if (!job.location || (user.location && job.location.toLowerCase().includes(user.location.toLowerCase()))) {
            score += 100 * weights.location;
        } else if (job.location.toLowerCase() === 'remote') {
            score += 100 * weights.location;
        }

        // 4. Salary Match
        if (user.expected_ctc && job.salary_max) {
            if (job.salary_max >= user.expected_ctc) {
                score += 100 * weights.salary;
            } else {
                const diff = user.expected_ctc - job.salary_max;
                // Penalize if budget is lower than expected
                score += Math.max(0, 100 - (diff / 100000 * 10)) * weights.salary;
            }
        } else {
            score += 100 * weights.salary;
        }

        // 5. Culture (Placeholder for AI analysis)
        score += 80 * weights.culture; // Default assumption

        return Math.round(score);
    }

    async matchForUser(userId) {
        const jobs = await this.db.searchJobs({ limit: 100 });
        const matches = [];

        for (const job of jobs) {
            const score = await this.calculateMatchScore(userId, job.id);
            if (score > 60) {
                matches.push({ job, score });
                // Save match
                await this.db.query(`
                    INSERT INTO job_matches (user_id, job_id, match_score)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (user_id, job_id) DO UPDATE SET match_score = $3
                `, [userId, job.id, score]);
            }
        }

        return matches.sort((a, b) => b.score - a.score);
    }
}

module.exports = new MatchingEngine();
