const OpenAI = require('openai');

class OrionCoachService {
    constructor(apiKey) {
        this.openai = apiKey ? new OpenAI({ apiKey }) : null;
    }

    async chatWithOrion(message, chatHistory = []) {
        if (!this.openai) {
            return "I'm Orion, your AI career coach! However, I need an OpenAI API key to provide real assistance. Please configure OPENAI_API_KEY in your .env file. In the meantime, I can help guide you with general career advice!";
        }

        try {
            // Build conversation context
            const messages = [
                {
                    role: 'system',
                    content: `You are Orion, an expert AI career coach specializing in the Indian job market. You help with:
- Resume optimization for ATS systems
- Interview preparation
- Salary negotiation strategies
- Career growth advice
- Job search strategies
- Cover letter writing

Be concise, practical, and India-focused. Provide actionable advice. Use Indian salary formats (LPA) and understand Indian work culture.`
                },
                ...chatHistory.map(msg => ({
                    role: msg.role,
                    content: msg.content
                })),
                {
                    role: 'user',
                    content: message
                }
            ];

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            console.error('Orion chat error:', error);

            if (error.code === 'insufficient_quota') {
                return "I apologize, but it seems the OpenAI API quota has been exceeded. Please check your API key billing status.";
            }

            throw new Error(`Chat service error: ${error.message}`);
        }
    }

    async generateResumeReview(resumeText) {
        if (!this.openai) {
            return {
                overallScore: 75,
                strengths: [
                    "Clear professional experience",
                    "Good technical skills listed"
                ],
                improvements: [
                    "Add more quantifiable achievements",
                    "Include keywords for ATS optimization",
                    "Shorten bullet points"
                ],
                suggestions: "Add an OpenAI API key for detailed AI-powered analysis."
            };
        }

        try {
            const prompt = `Analyze this resume and provide:
1. Overall score (0-100)
2. Top 3 strengths
3. Top 3 improvements needed
4. Specific suggestions for the Indian job market

Resume:
${resumeText}

Return as JSON with keys: overallScore, strengths (array), improvements (array), suggestions (string)`;

            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' },
                temperature: 0.7
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Resume review error:', error);
            throw error;
        }
    }
}

module.exports = OrionCoachService;
