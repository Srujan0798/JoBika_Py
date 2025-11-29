/**
 * Enhanced Salary Insights for Indian Job Market
 * City-specific data, CTC breakdowns, percentile rankings
 */

class IndianSalaryInsights {
    constructor() {
        this.salaryData = this.initializeSalaryData();
        this.cityMultipliers = this.initializeCityMultipliers();
    }

    /**
     * Initialize salary data for Indian roles
     */
    initializeSalaryData() {
        return {
            'Software Engineer': {
                base: { min: 8, max: 15, median: 12 },
                experience: {
                    '0-2': { min: 6, max: 12, median: 8 },
                    '3-5': { min: 12, max: 20, median: 15 },
                    '6-10': { min: 20, max: 35, median: 25 },
                    '10+': { min: 30, max: 60, median: 40 }
                },
                breakdown: { fixed: 70, variable: 20, esop: 10 }
            },
            'Senior Software Engineer': {
                base: { min: 15, max: 30, median: 22 },
                experience: {
                    '3-5': { min: 15, max: 25, median: 18 },
                    '6-10': { min: 22, max: 40, median: 30 },
                    '10+': { min: 35, max: 70, median: 50 }
                },
                breakdown: { fixed: 65, variable: 20, esop: 15 }
            },
            'Product Manager': {
                base: { min: 18, max: 40, median: 28 },
                experience: {
                    '3-5': { min: 18, max: 30, median: 22 },
                    '6-10': { min: 28, max: 50, median: 38 },
                    '10+': { min: 45, max: 80, median: 60 }
                },
                breakdown: { fixed: 70, variable: 25, esop: 5 }
            },
            'Data Scientist': {
                base: { min: 12, max: 28, median: 18 },
                experience: {
                    '0-2': { min: 8, max: 15, median: 10 },
                    '3-5': { min: 15, max: 25, median: 18 },
                    '6-10': { min: 25, max: 45, median: 32 },
                    '10+': { min: 40, max: 70, median: 50 }
                },
                breakdown: { fixed: 75, variable: 15, esop: 10 }
            },
            'DevOps Engineer': {
                base: { min: 10, max: 25, median: 16 },
                experience: {
                    '0-2': { min: 7, max: 14, median: 10 },
                    '3-5': { min: 14, max: 22, median: 17 },
                    '6-10': { min: 22, max: 38, median: 28 },
                    '10+': { min: 35, max: 60, median: 45 }
                },
                breakdown: { fixed: 70, variable: 20, esop: 10 }
            },
            'Frontend Developer': {
                base: { min: 6, max: 18, median: 12 },
                experience: {
                    '0-2': { min: 5, max: 10, median: 7 },
                    '3-5': { min: 10, max: 18, median: 13 },
                    '6-10': { min: 18, max: 30, median: 22 },
                    '10+': { min: 28, max: 50, median: 35 }
                },
                breakdown: { fixed: 75, variable: 15, esop: 10 }
            },
            'Backend Developer': {
                base: { min: 7, max: 20, median: 13 },
                experience: {
                    '0-2': { min: 6, max: 11, median: 8 },
                    '3-5': { min: 11, max: 20, median: 14 },
                    '6-10': { min: 20, max: 35, median: 25 },
                    '10+': { min: 32, max: 55, median: 40 }
                },
                breakdown: { fixed: 70, variable: 20, esop: 10 }
            },
            'UI/UX Designer': {
                base: { min: 6, max: 20, median: 12 },
                experience: {
                    '0-2': { min: 5, max: 10, median: 7 },
                    '3-5': { min: 10, max: 18, median: 13 },
                    '6-10': { min: 18, max: 32, median: 22 },
                    '10+': { min: 28, max: 50, median: 36 }
                },
                breakdown: { fixed: 80, variable: 10, esop: 10 }
            }
        };
    }

    /**
     * City cost-of-living multipliers
     */
    initializeCityMultipliers() {
        return {
            'bangalore': { multiplier: 1.0, name: 'Bangalore', col: 'High' },
            'mumbai': { multiplier: 1.15, name: 'Mumbai', col: 'Very High' },
            'delhi': { multiplier: 1.05, name: 'Delhi NCR', col: 'High' },
            'hyderabad': { multiplier: 0.9, name: 'Hyderabad', col: 'Medium' },
            'pune': { multiplier: 0.85, name: 'Pune', col: 'Medium' },
            'chennai': { multiplier: 0.85, name: 'Chennai', col: 'Medium' },
            'kolkata': { multiplier: 0.75, name: 'Kolkata', col: 'Low' },
            'ahmedabad': { multiplier: 0.75, name: 'Ahmedabad', col: 'Low' },
            'remote': { multiplier: 0.95, name: 'Remote', col: 'Varies' }
        };
    }

    /**
     * Get salary insights for a role in specific city
     */
    getSalaryInsights(jobTitle, city, yearsOfExperience) {
        const normalizedTitle = this.normalizeJobTitle(jobTitle);
        const normalizedCity = city.toLowerCase();

        const roleData = this.salaryData[normalizedTitle];
        if (!roleData) {
            return this.getGenericInsights(city, yearsOfExperience);
        }

        const expBracket = this.getExperienceBracket(yearsOfExperience);
        const salaryRange = roleData.experience[expBracket] || roleData.base;

        const cityData = this.cityMultipliers[normalizedCity] ||
            this.cityMultipliers['bangalore'];

        // Apply city multiplier
        const adjustedRange = {
            min: Math.round(salaryRange.min * cityData.multiplier),
            max: Math.round(salaryRange.max * cityData.multiplier),
            median: Math.round(salaryRange.median * cityData.multiplier)
        };

        return {
            role: normalizedTitle,
            city: cityData.name,
            costOfLiving: cityData.col,
            salaryRange: adjustedRange,
            ctcBreakdown: this.calculateCTCBreakdown(adjustedRange.median, roleData.breakdown),
            percentileData: this.calculatePercentiles(adjustedRange),
            marketInsights: this.getMarketInsights(normalizedTitle, cityData.name),
            comparison: this.getCityComparison(normalizedTitle, yearsOfExperience)
        };
    }

    /**
     * Calculate CTC breakdown (fixed, variable, ESOP)
     */
    calculateCTCBreakdown(medianCTC, breakdown) {
        return {
            total: medianCTC,
            fixed: Math.round(medianCTC * (breakdown.fixed / 100)),
            variable: Math.round(medianCTC * (breakdown.variable / 100)),
            esop: Math.round(medianCTC * (breakdown.esop / 100)),
            monthlyInHand: Math.round((medianCTC * (breakdown.fixed / 100)) / 12),
            benefits: this.calculateBenefits(medianCTC)
        };
    }

    /**
     * Calculate benefits (PF, gratuity, insurance)
     */
    calculateBenefits(ctc) {
        const yearlyFixed = ctc * 0.7; // Assume 70% fixed

        return {
            pf: {
                employer: Math.round(yearlyFixed * 0.12 / 12), // 12% of basic
                employee: Math.round(yearlyFixed * 0.12 / 12),
                monthly: Math.round(yearlyFixed * 0.24 / 12)
            },
            gratuity: Math.round(yearlyFixed * 0.048), // 4.8% annually
            insurance: {
                health: '5-10 Lakhs',
                lifeInsurance: '10x of CTC'
            },
            leaveEncashment: Math.round(yearlyFixed / 365 * 15) // 15 days
        };
    }

    /**
     * Calculate percentile rankings
     */
    calculatePercentiles(range) {
        return {
            p25: Math.round(range.min + (range.median - range.min) * 0.5),
            p50: range.median,
            p75: Math.round(range.median + (range.max - range.median) * 0.5),
            p90: Math.round(range.max * 0.95)
        };
    }

    /**
     * Get market insights
     */
    getMarketInsights(role, city) {
        return {
            demand: this.getDemandLevel(role),
            growth: '+15-20% YoY',
            topCompanies: this.getTopCompanies(role, city),
            trendingSkills: this.getTrendingSkills(role),
            hiringTrend: 'High demand in 2025'
        };
    }

    /**
     * Compare salaries across cities
     */
    getCityComparison(role, experience) {
        const expBracket = this.getExperienceBracket(experience);
        const roleData = this.salaryData[role];
        if (!roleData) return [];

        const baseSalary = roleData.experience[expBracket]?.median || roleData.base.median;

        return Object.entries(this.cityMultipliers).map(([key, data]) => ({
            city: data.name,
            medianCTC: Math.round(baseSalary * data.multiplier),
            costOfLiving: data.col,
            netValue: this.calculateNetValue(baseSalary * data.multiplier, data.col)
        })).sort((a, b) => b.medianCTC - a.medianCTC);
    }

    /**
     * Calculate net value (salary adjusted for COL)
     */
    calculateNetValue(salary, col) {
        const colFactors = {
            'Very High': 0.6,
            'High': 0.7,
            'Medium': 0.8,
            'Low': 0.9,
            'Varies': 0.75
        };
        return Math.round(salary * (colFactors[col] || 0.7));
    }

    // Helper methods
    normalizeJobTitle(title) {
        const titleLower = title.toLowerCase();
        const mappings = {
            'sde': 'Software Engineer',
            'software developer': 'Software Engineer',
            'full stack': 'Software Engineer',
            'senior sde': 'Senior Software Engineer',
            'pm': 'Product Manager',
            'data analyst': 'Data Scientist',
            'ml engineer': 'Data Scientist',
            'designer': 'UI/UX Designer',
            'ux designer': 'UI/UX Designer'
        };

        for (const [key, value] of Object.entries(mappings)) {
            if (titleLower.includes(key)) return value;
        }

        // Find best match in existing data
        for (const role of Object.keys(this.salaryData)) {
            if (titleLower.includes(role.toLowerCase()) ||
                role.toLowerCase().includes(titleLower)) {
                return role;
            }
        }

        return 'Software Engineer'; // Default
    }

    getExperienceBracket(years) {
        if (years <= 2) return '0-2';
        if (years <= 5) return '3-5';
        if (years <= 10) return '6-10';
        return '10+';
    }

    getDemandLevel(role) {
        const highDemand = ['Software Engineer', 'Senior Software Engineer', 'Data Scientist'];
        return highDemand.includes(role) ? 'Very High' : 'High';
    }

    getTopCompanies(role, city) {
        const companies = {
            'Software Engineer': ['Google', 'Microsoft', 'Amazon', 'Flipkart', 'Swiggy'],
            'Product Manager': ['Razorpay', 'CRED', 'PhonePe', 'Paytm', 'Swiggy'],
            'Data Scientist': ['Flipkart', 'Amazon', 'Google', 'Walmart Labs', 'Goldman Sachs']
        };
        return (companies[role] || companies['Software Engineer']).slice(0, 5);
    }

    getTrendingSkills(role) {
        const skills = {
            'Software Engineer': ['React', 'Node.js', 'AWS', 'Kubernetes', 'TypeScript'],
            'Data Scientist': ['Python', 'ML', 'SQL', 'TensorFlow', 'Statistics'],
            'Product Manager': ['Agile', 'Data Analysis', 'Roadmapping', 'Stakeholder Mgmt'],
            'DevOps Engineer': ['Docker', 'Kubernetes', 'AWS', 'Jenkins', 'Terraform']
        };
        return skills[role] || skills['Software Engineer'];
    }

    getGenericInsights(city, years) {
        return {
            role: 'General',
            city: city,
            salaryRange: { min: 8, max: 25, median: 15 },
            message: 'Salary data not available for this specific role. Showing general tech salary range.'
        };
    }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndianSalaryInsights;
} else {
    window.IndianSalaryInsights = IndianSalaryInsights;
}
