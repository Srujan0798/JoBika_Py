class MonetizationService {
    constructor() {
        this.userCredits = new Map(); // userId -> amount
        this.referrals = new Map(); // referralCode -> { referrerId, uses }

        // Initial credits for demo
        this.userCredits.set('demo-user', 100);
    }

    async getCredits(userId) {
        return this.userCredits.get(userId) || 0;
    }

    async addCredits(userId, amount) {
        const current = await this.getCredits(userId);
        this.userCredits.set(userId, current + amount);
        return { success: true, newBalance: current + amount };
    }

    async deductCredits(userId, feature, cost) {
        const current = await this.getCredits(userId);

        if (current < cost) {
            throw new Error(`Insufficient credits. Required: ${cost}, Available: ${current}`);
        }

        this.userCredits.set(userId, current - cost);
        return { success: true, newBalance: current - cost, deducted: cost };
    }

    // Referral System
    async generateReferralCode(userId) {
        const code = `REF-${userId.substring(0, 4).toUpperCase()}-${Math.floor(Math.random() * 1000)}`;
        this.referrals.set(code, { referrerId: userId, uses: 0 });
        return code;
    }

    async processReferral(referralCode, newUserId) {
        const referral = this.referrals.get(referralCode);
        if (!referral) return { success: false, message: 'Invalid code' };

        // Award credits
        await this.addCredits(referral.referrerId, 100); // Referrer bonus
        await this.addCredits(newUserId, 50); // Referee bonus

        referral.uses++;
        return { success: true, message: 'Referral applied!' };
    }
}

module.exports = new MonetizationService();
