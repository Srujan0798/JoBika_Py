class PremiumService {
    constructor() {
        // Mock user subscriptions
        this.userSubscriptions = new Map(); // userId -> { tier, expiry }

        // Mock Company Data
        this.companyData = {
            'google': {
                culture: { workLifeBalance: 4.2, management: 3.8, growth: 4.0, compensation: 4.5 },
                interviewProcess: {
                    avgDuration: '2-3 weeks',
                    rounds: ['HR Screen', 'Technical (2 rounds)', 'Hiring Manager', 'Bar Raiser'],
                    difficulty: 'Medium'
                },
                salaryInsights: {
                    'SDE-1': '18-25 LPA',
                    'SDE-2': '30-45 LPA',
                    'Senior SDE': '50-80 LPA'
                },
                hiringTrends: { activelyHiring: true, departments: ['Cloud', 'Search', 'Ads'] }
            },
            'microsoft': {
                culture: { workLifeBalance: 4.5, management: 4.1, growth: 4.2, compensation: 4.3 },
                interviewProcess: {
                    avgDuration: '3-4 weeks',
                    rounds: ['OA', 'Technical (3 rounds)', 'AA Round'],
                    difficulty: 'Medium-Hard'
                },
                salaryInsights: {
                    'SDE-1': '16-22 LPA',
                    'SDE-2': '28-40 LPA',
                    'Senior SDE': '45-70 LPA'
                },
                hiringTrends: { activelyHiring: true, departments: ['Azure', 'Office', 'LinkedIn'] }
            }
        };
    }

    async getUserSubscription(userId) {
        // Default to free if not found
        return this.userSubscriptions.get(userId) || { tier: 'free', expiry: null };
    }

    async upgradeUser(userId, tier) {
        const expiry = new Date();
        expiry.setMonth(expiry.getMonth() + 1); // 1 month subscription

        this.userSubscriptions.set(userId, { tier, expiry });
        return { success: true, tier, expiry };
    }

    async checkPriorityMatching(userId) {
        const sub = await this.getUserSubscription(userId);

        switch (sub.tier) {
            case 'premium': return { waitTime: 0, priority: 'immediate' };
            case 'pro': return { waitTime: 3, priority: 'high' };
            default: return { waitTime: 6, priority: 'normal' };
        }
    }

    async checkResumeLimit(userId, currentCount) {
        const sub = await this.getUserSubscription(userId);
        const limits = { free: 1, starter: 10, pro: 50, premium: Infinity };

        return {
            allowed: currentCount < limits[sub.tier],
            limit: limits[sub.tier],
            tier: sub.tier
        };
    }

    async getCompanyInsights(companyName) {
        const key = companyName.toLowerCase();
        if (this.companyData[key]) {
            return this.companyData[key];
        }

        // Mock generic data for others
        return {
            culture: { workLifeBalance: 3.5, management: 3.5, growth: 3.5, compensation: 3.5 },
            interviewProcess: {
                avgDuration: '2 weeks',
                rounds: ['HR Screen', 'Technical', 'Managerial'],
                difficulty: 'Unknown'
            },
            salaryInsights: { 'Software Engineer': 'Market Standard' },
            hiringTrends: { activelyHiring: false, departments: [] },
            isGeneric: true
        };
    }
}

export default new PremiumService();
