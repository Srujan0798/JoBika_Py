class AnalyticsService {
    constructor() {
        // Mock database state
        this.events = [];
    }

    async trackEvent(eventData) {
        // Simulate DB write
        this.events.push(eventData);
        console.log(`[AnalyticsService] Stored event: ${eventData.eventName}`);
        return { success: true, count: this.events.length };
    }

    async generateUserInsights(userId) {
        // Simulate DB delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const applications = this.getMockApplications(userId);
        const matches = this.getMockMatches(userId);

        return {
            applicationStats: this.calculateApplicationStats(applications),
            successPatterns: this.identifySuccessPatterns(applications),
            skillGaps: this.identifySkillGaps(userId, matches),
            recommendations: this.generateRecommendations(userId, applications)
        };
    }

    getMockApplications(userId) {
        // Generate realistic mock application data
        return [
            { id: 1, status: 'rejected', applied_date: '2023-10-01', first_response_date: '2023-10-05', company_size: 'startup', industry: 'fintech', match_score: 85 },
            { id: 2, status: 'interview', applied_date: '2023-10-10', first_response_date: '2023-10-12', company_size: 'mnc', industry: 'technology', match_score: 92 },
            { id: 3, status: 'applied', applied_date: '2023-10-15', first_response_date: null, company_size: 'startup', industry: 'edtech', match_score: 70 },
            { id: 4, status: 'offer', applied_date: '2023-10-20', first_response_date: '2023-10-22', company_size: 'mnc', industry: 'technology', match_score: 95 },
            { id: 5, status: 'screening', applied_date: '2023-11-01', first_response_date: '2023-11-03', company_size: 'mid-size', industry: 'ecommerce', match_score: 78 },
            { id: 6, status: 'rejected', applied_date: '2023-11-05', first_response_date: '2023-11-10', company_size: 'startup', industry: 'healthtech', match_score: 65 },
            { id: 7, status: 'applied', applied_date: '2023-11-12', first_response_date: null, company_size: 'mid-size', industry: 'fintech', match_score: 82 }
        ];
    }

    getMockMatches(userId) {
        return [
            { id: 101, title: 'Senior React Developer', match_score: 95, required_skills: ['React', 'Redux', 'TypeScript', 'AWS'] },
            { id: 102, title: 'Frontend Engineer', match_score: 88, required_skills: ['React', 'JavaScript', 'CSS', 'Docker'] },
            { id: 103, title: 'Full Stack Developer', match_score: 75, required_skills: ['Node.js', 'React', 'MongoDB', 'Kubernetes'] },
            { id: 104, title: 'SDE II', match_score: 92, required_skills: ['Java', 'Spring Boot', 'AWS', 'System Design'] }
        ];
    }

    calculateApplicationStats(applications) {
        const total = applications.length;
        const statuses = applications.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {});

        const responseRate = ((statuses.screening || 0) + (statuses.interview || 0) + (statuses.offer || 0)) / total * 100;

        // Calculate average response time
        const responseTimes = applications
            .filter(app => app.first_response_date)
            .map(app => (new Date(app.first_response_date) - new Date(app.applied_date)) / (1000 * 60 * 60 * 24));

        const avgResponseTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b) / responseTimes.length
            : 0;

        return {
            total,
            statusBreakdown: statuses,
            responseRate: responseRate.toFixed(1),
            avgResponseTime: avgResponseTime.toFixed(1) + ' days'
        };
    }

    identifySuccessPatterns(applications) {
        const successfulApps = applications.filter(app =>
            ['screening', 'interview', 'offer'].includes(app.status)
        );

        if (successfulApps.length === 0) return { insight: "Not enough data yet." };

        const byCompanySize = this.groupBy(successfulApps, 'company_size');
        const byIndustry = this.groupBy(successfulApps, 'industry');

        const topSize = Object.entries(byCompanySize).sort((a, b) => b[1] - a[1])[0];
        const topIndustry = Object.entries(byIndustry).sort((a, b) => b[1] - a[1])[0];

        return {
            mostResponsiveCompanySize: topSize ? topSize[0] : 'N/A',
            mostResponsiveIndustry: topIndustry ? topIndustry[0] : 'N/A',
            insight: `You are getting ${((successfulApps.length / applications.length) * 100).toFixed(0)}% more responses from ${topIndustry ? topIndustry[0] : ''} companies.`
        };
    }

    identifySkillGaps(userId, matches) {
        // Mock user skills
        const userSkills = new Set(['React', 'JavaScript', 'HTML', 'CSS', 'Node.js']);

        const highMatchJobs = matches.filter(m => m.match_score >= 80);
        const allRequiredSkills = highMatchJobs.flatMap(m => m.required_skills);

        const skillFrequency = allRequiredSkills.reduce((acc, skill) => {
            acc[skill] = (acc[skill] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(skillFrequency)
            .filter(([skill, freq]) => !userSkills.has(skill) && freq >= 1)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([skill, freq]) => ({
                skill,
                appearanceCount: freq,
                learningResource: this.getLearningResource(skill)
            }));
    }

    generateRecommendations(userId, applications) {
        const recos = [];

        // Activity Reco
        if (applications.length < 10) {
            recos.push({
                type: 'activity',
                priority: 'high',
                message: `You've only applied to ${applications.length} jobs. Aim for 30+ for better results.`,
                action: 'Enable Auto-Apply'
            });
        }

        // Response Rate Reco
        const stats = this.calculateApplicationStats(applications);
        if (parseFloat(stats.responseRate) < 20) {
            recos.push({
                type: 'profile',
                priority: 'medium',
                message: 'Your response rate is low. Try optimizing your resume keywords.',
                action: 'Use Resume Customizer'
            });
        }

        return recos;
    }

    groupBy(array, key) {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    }

    getLearningResource(skill) {
        const resources = {
            'AWS': { name: 'AWS Free Tier', url: 'https://aws.amazon.com/free/' },
            'Docker': { name: 'Docker 101', url: 'https://www.docker.com/101-tutorial/' },
            'TypeScript': { name: 'TypeScript Handbook', url: 'https://www.typescriptlang.org/docs/' },
            'Kubernetes': { name: 'K8s Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' }
        };
        return resources[skill] || { name: `${skill} Tutorial`, url: `https://www.google.com/search?q=${skill}+tutorial` };
    }
}

module.exports = AnalyticsService;
