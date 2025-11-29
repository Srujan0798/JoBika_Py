/**
 * Notice Period Management for Indian Job Market
 * Filters jobs, calculates buyouts, manages notice period info
 */

class NoticePeriodManager {
    constructor() {
        this.standardPeriods = {
            'immediate': { days: 0, label: 'Immediate Joiner' },
            '15': { days: 15, label: '0-15 days' },
            '30': { days: 30, label: '30 days' },
            '60': { days: 60, label: '60 days' },
            '90': { days: 90, label: '90 days' },
            'serving': { days: null, label: 'Serving Notice' }
        };

        // Typical buyout costs (per day) by company type
        this.buyoutRates = {
            'startup': 1500,      // ₹1,500/day
            'mnc': 2500,          // ₹2,500/day
            'product': 2000,      // ₹2,000/day
            'service': 1200       // ₹1,200/day
        };
    }

    /**
     * Filter jobs based on user's notice period
     */
    filterJobsByNoticePeriod(jobs, userNoticePeriod, userPreferences = {}) {
        const userDays = this.getNoticePeriodDays(userNoticePeriod);
        const allowFlexibility = userPreferences.allowBuyout || false;
        const maxBuyoutCost = userPreferences.maxBuyoutCost || 50000;

        return jobs.map(job => {
            const jobRequirement = this.getJobNoticePeriodRequirement(job);
            const isMatch = this.isNoticePeriodMatch(
                userDays,
                jobRequirement,
                allowFlexibility,
                maxBuyoutCost
            );

            return {
                ...job,
                noticePeriodMatch: isMatch.match,
                noticePeriodReason: isMatch.reason,
                buyoutRequired: isMatch.buyoutRequired,
                estimatedBuyoutCost: isMatch.buyoutCost
            };
        }).filter(job => job.noticePeriodMatch);
    }

    /**
     * Check if user's notice period matches job requirement
     */
    isNoticePeriodMatch(userDays, jobRequirement, allowBuyout, maxBuyout) {
        // Job accepts any notice period
        if (jobRequirement.flexible) {
            return {
                match: true,
                reason: 'Job accepts candidates with any notice period',
                buyoutRequired: false,
                buyoutCost: 0
            };
        }

        // User is immediate joiner
        if (userDays === 0 || userDays <= 15) {
            return {
                match: true,
                reason: 'You can join immediately',
                buyoutRequired: false,
                buyoutCost: 0
            };
        }

        // User's notice period within job's requirement
        if (userDays <= jobRequirement.maxDays) {
            return {
                match: true,
                reason: `Your ${userDays}-day notice fits job requirement`,
                buyoutRequired: false,
                buyoutCost: 0
            };
        }

        // Check if buyout is an option
        if (allowBuyout && jobRequirement.acceptsBuyout) {
            const daysToReduce = userDays - jobRequirement.maxDays;
            const buyoutCost = this.calculateBuyoutCost(
                daysToReduce,
                jobRequirement.companyType
            );

            if (buyoutCost <= maxBuyout) {
                return {
                    match: true,
                    reason: `Buyout possible (${daysToReduce} days)`,
                    buyoutRequired: true,
                    buyoutCost: buyoutCost
                };
            }
        }

        return {
            match: false,
            reason: `Notice period too long (${userDays} days vs ${jobRequirement.maxDays} max)`,
            buyoutRequired: false,
            buyoutCost: 0
        };
    }

    /**
     * Get job's notice period requirement
     */
    getJobNoticePeriodRequirement(job) {
        // Parse job description for notice period keywords
        const description = (job.description || job.title || '').toLowerCase();

        if (description.includes('immediate') || description.includes('urgent')) {
            return {
                maxDays: 15,
                flexible: false,
                acceptsBuyout: true,
                companyType: job.companySize || 'startup'
            };
        }

        if (description.includes('30 days') || description.includes('1 month')) {
            return {
                maxDays: 30,
                flexible: false,
                acceptsBuyout: true,
                companyType: job.companySize || 'product'
            };
        }

        // Default: Flexible (most companies in India accept 30-90 days)
        return {
            maxDays: 90,
            flexible: true,
            acceptsBuyout: true,
            companyType: job.companySize || 'product'
        };
    }

    /**
     * Calculate buyout cost
     */
    calculateBuyoutCost(daysToReduce, companyType = 'product') {
        const ratePerDay = this.buyoutRates[companyType] || this.buyoutRates['product'];
        return daysToReduce * ratePerDay;
    }

    /**
     * Get detailed buyout breakdown
     */
    getBuyoutBreakdown(currentNoticeDays, targetNoticeDays, currentCTC, companyType = 'product') {
        const daysToReduce = Math.max(0, currentNoticeDays - targetNoticeDays);

        if (daysToReduce === 0) {
            return {
                required: false,
                message: 'No buyout needed'
            };
        }

        const dailySalary = Math.round(currentCTC * 100000 / 365); // CTC in lakhs to daily
        const marketRate = this.buyoutRates[companyType];
        const buyoutCost = daysToReduce * marketRate;

        return {
            required: true,
            daysToReduce: daysToReduce,
            currentNotice: currentNoticeDays,
            targetNotice: targetNoticeDays,
            dailySalary: dailySalary,
            marketRatePerDay: marketRate,
            totalBuyoutCost: buyoutCost,
            companyType: companyType,
            breakdown: {
                salary: `₹${dailySalary.toLocaleString('en-IN')}`,
                days: daysToReduce,
                total: `₹${buyoutCost.toLocaleString('en-IN')}`
            },
            tips: this.getBuyoutNegotiationTips(buyoutCost, currentCTC)
        };
    }

    /**
     * Get buyout negotiation tips
     */
    getBuyoutNegotiationTips(buyoutCost, currentCTC) {
        const buyoutPercentage = (buyoutCost / (currentCTC * 100000)) * 100;

        const tips = {
            commonPractices: [
                'Most Indian companies expect 30-90 days notice',
                '60 days is the most common notice period',
                'Immediate joiners are highly valued'
            ],
            negotiationTips: [],
            whenToBuyout: []
        };

        if (buyoutPercentage < 5) {
            tips.negotiationTips.push(
                'Buyout cost is low (<5% of CTC) - usually acceptable',
                'Most employers will accept this notice reduction',
                'Consider paying yourself if new company doesn\'t offer'
            );
            tips.whenToBuyout.push('High priority role at dream company');
        } else if (buyoutPercentage < 10) {
            tips.negotiationTips.push(
                'Moderate buyout cost (5-10% of CTC)',
                'Negotiate with new employer to cover buyout',
                'Ask current employer for waiver if relations are good'
            );
            tips.whenToBuyout.push('Significant salary hike (30-50%)', 'Better long-term growth opportunity');
        } else {
            tips.negotiationTips.push(
                'High buyout cost (>10% of CTC)',
                'Carefully evaluate if worth the cost',
                'Try negotiating longer joining date instead',
                'Ask new employer for joining bonus to cover buyout'
            );
            tips.whenToBuyout.push('Only for exceptional opportunities', 'Substantial salary increase (50%+)');
        }

        return tips;
    }

    /**
     * Get notice period display label
     */
    getNoticePeriodDisplay(noticePeriod) {
        return this.standardPeriods[noticePeriod]?.label ||
            `${noticePeriod} days`;
    }

    /**
     * Get notice period in days
     */
    getNoticePeriodDays(noticePeriod) {
        if (typeof noticePeriod === 'number') return noticePeriod;

        const period = this.standardPeriods[noticePeriod];
        if (period) return period.days || 90; // Default to 90 for "serving"

        return parseInt(noticePeriod) || 0;
    }

    /**
     * Generate notice period filter options for UI
     */
    getFilterOptions() {
        return [
            { value: 'immediate', label: 'Immediate Joiners Only', maxDays: 15 },
            { value: '30', label: 'Up to 30 days', maxDays: 30 },
            { value: '60', label: 'Up to 60 days', maxDays: 60 },
            { value: '90', label: 'Up to 90 days', maxDays: 90 },
            { value: 'any', label: 'Any Notice Period', maxDays: Infinity }
        ];
    }

    /**
     * Calculate joining date based on notice period
     */
    calculateJoiningDate(noticePeriod, includeBuyout = false, buyoutDays = 0) {
        const days = this.getNoticePeriodDays(noticePeriod);
        const effectiveDays = includeBuyout ? Math.max(0, days - buyoutDays) : days;

        const joiningDate = new Date();
        joiningDate.setDate(joiningDate.getDate() + effectiveDays);

        return {
            date: joiningDate,
            formatted: joiningDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            daysFromNow: effectiveDays
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NoticePeriodManager;
} else {
    window.NoticePeriodManager = NoticePeriodManager;
}
