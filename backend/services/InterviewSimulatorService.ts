import OpenAI from 'openai';

class InterviewSimulatorService {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        this.sessions = new Map();
    }

    async startInterview(userId, jobDescription, companyName) {
        const sessionId = Date.now().toString();
        const systemPrompt = `
        You are an experienced hiring manager at ${companyName} conducting a job interview.
        Job Description: ${jobDescription}
        
        Instructions:
        - Conduct a realistic interview with 5-7 questions
        - Start with behavioral questions, move to technical
        - Provide realistic reactions
        `;

        this.sessions.set(sessionId, {
            userId,
            history: [{ role: 'system', content: systemPrompt }],
            startTime: new Date()
        });

        return this.askNextQuestion(sessionId);
    }

    async askNextQuestion(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Session not found');

        session.history.push({ role: 'user', content: 'Please ask the next interview question.' });

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: session.history
            });

            const question = response.choices[0].message.content;
            session.history.push({ role: 'assistant', content: question });

            // Mock Text-to-Speech (ElevenLabs)
            const audioUrl = `https://mock-tts.com/audio/${Date.now()}.mp3`;

            return { sessionId, question, audioUrl };
        } catch (error) {
            console.error('Interview Error:', error);
            return { sessionId, question: "Tell me about yourself.", audioUrl: "" };
        }
    }

    async submitAnswer(sessionId, answerText) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Session not found');

        session.history.push({ role: 'user', content: `Candidate's answer: ${answerText}` });

        // Analyze answer (simplified)
        const analysis = await this.analyzeAnswer(answerText);

        if (analysis.needsFollowUp) {
            // Logic for follow-up could go here
            return this.askNextQuestion(sessionId);
        } else {
            return this.askNextQuestion(sessionId);
        }
    }

    async analyzeAnswer(answer) {
        // Mock analysis
        return {
            completeness_score: 8,
            needs_follow_up: false
        };
    }

    async endInterview(sessionId) {
        const session = this.sessions.get(sessionId);
        if (!session) throw new Error('Session not found');

        session.history.push({
            role: 'user',
            content: 'The interview is complete. Provide comprehensive feedback.'
        });

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: session.history
        });

        const feedback = response.choices[0].message.content;
        this.sessions.delete(sessionId);

        return { feedback, score: 85 };
    }

    async analyzeVideoInterview(videoBuffer) {
        // Mock Azure Face API analysis
        return {
            averageConfidence: 0.85,
            nervousness: 0.2,
            eyeContact: 0.9,
            recommendations: ['Great eye contact!', 'Try to smile more naturally.']
        };
    }
}

export default InterviewSimulatorService;
