const { GoogleGenerativeAI } = require("@google/generative-ai");

class InterviewPrepService {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generatePrep(jobTitle, company, jobDescription) {
        const prompt = `
            Create an interview preparation guide for a ${jobTitle} role at ${company}.
            
            Job Description: ${jobDescription}
            
            Include:
            1. 5 Technical Questions likely to be asked.
            2. 3 Behavioral Questions.
            3. Key cultural values of ${company} to mention.
            4. 2 Questions the candidate should ask the interviewer.
            
            Format as JSON.
        `;

        const result = await this.model.generateContent(prompt);
        const text = result.response.text();
        // Simple cleanup to ensure JSON
        const jsonStr = text.replace(/```json/g, '').replace(/```/g, '');
        return JSON.parse(jsonStr);
    }

    async generateSTARExamples(userExperience) {
        // Logic to convert user experience bullets into STAR format
        return [];
    }
}

module.exports = new InterviewPrepService();
