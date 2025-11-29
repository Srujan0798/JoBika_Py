class ReferralService {
    constructor() {
        // Mock data
    }

    async findReferralConnections(userId, companyName) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        // Mock connections based on company
        if (companyName.toLowerCase().includes('google')) {
            return [
                { name: 'Rahul Sharma', role: 'Senior SDE', connection: '1st Degree', avatar: '👨‍💻' },
                { name: 'Priya Singh', role: 'Product Manager', connection: '2nd Degree', avatar: '👩‍💼' }
            ];
        } else if (companyName.toLowerCase().includes('microsoft')) {
            return [
                { name: 'Amit Patel', role: 'Engineering Manager', connection: 'Alumni', avatar: '🎓' }
            ];
        }

        return [];
    }

    async getCommunityGroups() {
        return [
            { id: 1, name: 'SDE Job Seekers India', members: 1250, active: true },
            { id: 2, name: 'Product Management Prep', members: 890, active: true },
            { id: 3, name: 'Data Science & ML', members: 1100, active: true },
            { id: 4, name: 'Bangalore Tech Network', members: 3400, active: true }
        ];
    }

    async trackReferralRequest(userId, connectionName, jobId) {
        console.log(`[🤝 REFERRAL] User ${userId} requested referral from ${connectionName} for Job ${jobId}`);
        return { success: true, status: 'sent' };
    }
}

module.exports = ReferralService;
