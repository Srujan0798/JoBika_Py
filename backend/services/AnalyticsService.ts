import db from '../database/db';

class AnalyticsService {
    constructor() {
        this.db = new db();
    }

    async track(userId, eventName, properties = {}) {
        console.log(`[Analytics] ${eventName}`, properties);

        await this.db.query(`
            INSERT INTO analytics_events (user_id, event_name, properties)
            VALUES ($1, $2, $3)
        `, [userId, eventName, JSON.stringify(properties)]);
    }

    async getFunnelStats() {
        // SQL queries for funnel analysis
        return {};
    }
}

export default new AnalyticsService();
