const GeminiService = require('./GeminiService');
const db = require('../database/db');

class ResumeAnalysisService {
    constructor() {
        this.geminiService = new GeminiService(process.env.GEMINI_API_KEY);
    }

    /**
     * Analyze a resume text and return structured feedback
     * @param {string} resumeText - The text content of the resume
     * @returns {Promise<Object>} - The analysis result
     */
    async analyzeResume(resumeText) {
        if (!resumeText || resumeText.length < 50) {
            throw new Error("Resume content is too short to analyze.");
        }

        const prompt = `
            You are an expert ATS (Applicant Tracking System) and Career Coach.
            Analyze the following resume text and provide a detailed evaluation.

            RESUME TEXT:
            """
            ${resumeText.substring(0, 10000)}
            """

            Provide the response in the following JSON format ONLY:
            {
                "atsScore": <number 0-100>,
                "summary": "<string, brief overall assessment>",
                "strengths": ["<string>", "<string>", ...],
                "weaknesses": ["<string>", "<string>", ...],
                "suggestions": ["<string>", "<string>", ...],
                "keywordsFound": ["<string>", ...],
                "missingKeywords": ["<string>", ...]
            }

            Focus on:
            1. Formatting and structure (implied from text).
            2. Impact and quantification of achievements.
            3. Keyword optimization for general tech/professional roles.
            4. Clarity and conciseness.
        `;

        try {
            const result = await this.geminiService.generateJSON(prompt);
            return result;
        } catch (error) {
            console.error("Resume Analysis Error:", error);
            throw new Error("Failed to analyze resume.");
        }
    }
}

module.exports = new ResumeAnalysisService();
