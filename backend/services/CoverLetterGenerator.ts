import { GoogleGenerativeAI } from "@google/generative-ai";

class CoverLetterGenerator {
    constructor() {
        this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    }

    async generate(user, job, tone = 'professional') {
        const prompt = `
            Write a ${tone} cover letter for ${user.name} applying for the position of ${job.title} at ${job.company}.
            
            Candidate Skills: ${(user.skills || []).join(', ')}
            Candidate Experience: ${user.total_years} years
            
            Job Description:
            ${job.description}
            
            Keep it concise, impactful, and highlight relevant achievements.
        `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Cover letter generation failed:', error);
            return 'Dear Hiring Manager,\n\nI am writing to express my interest... (AI generation failed)';
        }
    }
}

export default new CoverLetterGenerator();
