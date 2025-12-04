class SalaryPredictionService {
    constructor() {
        // In a real app, we would load the .pkl model via a Python bridge or ONNX
        // Here we simulate the ML model's logic
    }

    async predictSalary(userProfile, jobDetails) {
        // Base salary calculation based on experience
        let baseSalary = userProfile.currentCTC || (userProfile.totalYears * 300000); // Fallback: 3L per year of exp

        // Location multiplier
        const locationMultipliers = {
            'Bangalore': 1.2,
            'Mumbai': 1.15,
            'Delhi': 1.1,
            'Hyderabad': 1.1,
            'Pune': 1.05,
            'Remote': 1.0
        };
        const locMult = locationMultipliers[jobDetails.location] || 1.0;

        // Company Size multiplier
        const sizeMultipliers = {
            'MNC': 1.3,
            'Startup': 1.1, // Funded startups pay well
            'Mid-size': 1.0
        };
        const sizeMult = sizeMultipliers[jobDetails.companySize] || 1.0;

        // Skill premium
        let skillPremium = 0;
        const highValueSkills = ['AWS', 'Docker', 'Kubernetes', 'System Design', 'AI/ML'];
        userProfile.skills.forEach(skill => {
            if (highValueSkills.includes(skill)) skillPremium += 100000;
        });

        // Calculate predicted CTC
        let predictedCTC = (baseSalary * locMult * sizeMult) + skillPremium;

        // Add variance for range
        const minCTC = predictedCTC * 0.9;
        const maxCTC = predictedCTC * 1.2;

        return {
            predicted_ctc: Math.round(predictedCTC),
            range: {
                min: Math.round(minCTC),
                max: Math.round(maxCTC)
            },
            currency: 'INR',
            confidence_score: 0.85,
            factors: {
                location_impact: `${((locMult - 1) * 100).toFixed(0)}%`,
                company_size_impact: `${((sizeMult - 1) * 100).toFixed(0)}%`,
                skill_premium: `₹${skillPremium}`
            }
        };
    }
}

export default SalaryPredictionService;
