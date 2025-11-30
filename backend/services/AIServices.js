const { GoogleGenerativeAI } = require("@google/generative-ai");

class AIServices {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async analyzeSkillGaps(currentSkills, targetRole) {
        const prompt = `
            Analyze the skill gap for a candidate with skills: [${currentSkills.join(', ')}] 
            aiming for the role of: ${targetRole}.
            
            Provide a learning path with 3 key missing skills and resources.
        `;
        const result = await this.model.generateContent(prompt);
        return result.response.text();
    }

    async predictSalary(role, experience, location) {
        // Mock ML prediction
        // In prod, call Python microservice
        const base = 500000;
        const expFactor = experience * 200000;
        const locFactor = location.toLowerCase().includes('bangalore') ? 1.2 : 1.0;

        return Math.round((base + expFactor) * locFactor);
    }
}

module.exports = new AIServices();
