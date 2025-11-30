const db = require('../database/db');

class PremiumFeatures {
    constructor() {
        this.db = new db();
    }

    async isPremium(userId) {
        const user = await this.db.getUserById(userId);
        return user.subscription_tier === 'premium' || user.subscription_tier === 'pro';
    }

    async getPriorityJobs(userId) {
        if (!await this.isPremium(userId)) return [];

        // Return jobs posted in last 6 hours (exclusive to premium)
        return this.db.query(`
            SELECT * FROM jobs 
            WHERE posted_date > NOW() - INTERVAL '6 hours'
        `);
    }

    async getSalaryNegotiationStrategy(userId, jobId) {
        // AI logic to generate negotiation script
        return {
            market_range: "15-20 LPA",
            target_ask: "18 LPA",
            script: "Based on my market research and experience..."
        };
    }
}

module.exports = new PremiumFeatures();
