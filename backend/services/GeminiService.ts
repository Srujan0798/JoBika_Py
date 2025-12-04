import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
    role: string;
    message: string;
}

class GeminiService {
    private apiKey: string | null;
    private genAI: GoogleGenerativeAI | null;
    private model: any;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || null;
        this.genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;
        this.model = this.genAI ? this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null;
    }

    async chat(prompt: string, systemInstruction: string | null = null): Promise<string> {
        if (!this.model) {
            return this.getMockResponse(prompt);
        }

        try {
            const chatConfig = systemInstruction
                ? {
                    model: 'gemini-1.5-flash',
                    systemInstruction: systemInstruction
                }
                : { model: 'gemini-1.5-flash' };

            const model = this.genAI!.getGenerativeModel(chatConfig);
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini API Error:', error.message, '| Key present:', !!this.apiKey);
            return this.getMockResponse(prompt);
        }
    }

    async chatWithHistory(userMessage: string, history: ChatMessage[] = [], systemInstruction: string | null = null): Promise<string> {
        if (!this.model) {
            return this.getMockResponse(userMessage);
        }

        try {
            const chatConfig = systemInstruction
                ? {
                    model: 'gemini-1.5-flash',
                    systemInstruction: systemInstruction,
                    history: history.map(msg => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.message || '' }]
                    }))
                }
                : {
                    model: 'gemini-1.5-flash',
                    history: history.map(msg => ({
                        role: msg.role === 'assistant' ? 'model' : 'user',
                        parts: [{ text: msg.message || '' }]
                    }))
                };

            const chat = this.model.startChat(chatConfig);
            const result = await chat.sendMessage(userMessage);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.error('Gemini Chat Error:', error);
            return this.getMockResponse(userMessage);
        }
    }

    async generateJSON(prompt: string, schema: any): Promise<any> {
        if (!this.model) {
            return this.getMockJSONResponse(prompt);
        }

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }

            return JSON.parse(text);
        } catch (error: any) {
            console.error('Gemini JSON Error:', error);
            return this.getMockJSONResponse(prompt);
        }
    }

    isConfigured(): boolean {
        return !!this.apiKey;
    }

    private getMockResponse(prompt: string): string {
        return "I'm Orion, your AI career coach! Add your FREE Gemini API key to unlock real AI-powered guidance. Visit: https://aistudio.google.com/app/apikey";
    }

    private getMockJSONResponse(prompt: string): any {
        return {
            score: 75,
            feedback: "Add your Gemini API key to get real AI analysis",
            suggestions: ["Configure GEMINI_API_KEY environment variable"]
        };
    }
}

export default GeminiService;
