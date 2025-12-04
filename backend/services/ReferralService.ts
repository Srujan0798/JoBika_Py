import db from '../database/db';

class ReferralService {
    constructor() {
        this.db = new db();
    }

    async findConnections(userId, companyName) {
        // In a real app, this would query the LinkedIn API or a scraped graph
        // Here we mock it or check internal user base
        const alumni = await this.db.query(`
            SELECT * FROM users 
            WHERE current_company ILIKE $1 AND id != $2
        `, [`%${companyName}%`, userId]);

        return {
            internal_alumni: alumni.rows,
            linkedin_2nd_degree: [] // Mock
        };
    }

    generateRequestMessage(userName, contactName, role, company) {
        return `Hi ${contactName},\n\nI hope you're doing well! I saw you're working at ${company} as a ${role}. I'm currently applying for a similar role there and was wondering if you could share any insights on the team culture? If you're open to it, I'd also appreciate a referral.\n\nBest,\n${userName}`;
    }
}

export default new ReferralService();
