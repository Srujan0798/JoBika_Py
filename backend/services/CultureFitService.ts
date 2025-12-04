import OpenAI from 'openai';

class CultureFitService {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    }

    async analyzeCultureFit(userProfile, companyInfo) {
        // Mock scraping company culture
        const companyAttributes = await this.scrapeCompanyCulture(companyInfo.name);

        const prompt = `
      Analyze culture fit between candidate and company.
      
      Candidate:
      - Work Style: ${userProfile.preferences?.workStyle || 'Flexible'}
      - Values: ${userProfile.preferences?.values?.join(', ') || 'Growth, Innovation'}
      
      Company (${companyInfo.name}):
      - Culture: ${companyAttributes.culture}
      - Values: ${companyAttributes.values}
      
      Provide JSON:
      {
        "score": 0-100,
        "alignments": ["point1", "point2"],
        "mismatches": ["point1"],
        "tips": ["tip1"]
      }
      `;

        try {
            const response = await this.openai.chat.completions.create({
                model: 'gpt-4',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: 'json_object' }
            });
            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Culture Fit Error:', error);
            return {
                score: 75,
                alignments: ['Innovation focus'],
                mismatches: ['Work-life balance pace'],
                tips: ['Be ready for fast-paced environment']
            };
        }
    }

    async scrapeCompanyCulture(companyName) {
        // Mock data
        return {
            culture: 'Fast-paced, innovative, customer-obsessed',
            values: 'Customer First, Bias for Action, Think Big',
            environment: 'Hybrid',
            reviews: ['Great learning', 'High pressure']
        };
    }
}

export default CultureFitService;
