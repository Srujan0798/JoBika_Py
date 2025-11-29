const OpenAI = require('openai');

class SkillAdvisorService {
    constructor() {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        // Mock DB
        this.learningProgress = new Map();
    }

    async analyzeSkillGaps(userProfile, targetJobs) {
        const prompt = `
      Analyze this candidate's profile against their target jobs and create a personalized learning roadmap.
      
      Current Skills: ${userProfile.skills.join(', ')}
      Experience: ${userProfile.totalYears} years in ${userProfile.domain}
      Target Jobs: ${targetJobs.map(j => j.title).join(', ')}
      
      Required Skills in Target Jobs:
      ${targetJobs.map(j => `- ${j.title}: ${j.required_skills.join(', ')}`).join('\n')}
      
      Create a JSON response with:
      {
        "critical_gaps": [
          {
            "skill": "skill name",
            "importance": "high/medium/low",
            "found_in_jobs": number,
            "estimated_learning_time": "X weeks",
            "difficulty": "beginner/intermediate/advanced",
            "prerequisites": ["skill1", "skill2"]
          }
        ],
        "learning_path": {
          "phase_1_foundation": ["skill1", "skill2"],
          "phase_2_intermediate": ["skill3", "skill4"],
          "phase_3_advanced": ["skill5", "skill6"]
        },
        "recommended_resources": [
          {
            "skill": "skill name",
            "resources": [
              {"title": "resource name", "type": "course/book/project", "url": "link", "free": true/false}
            ]
          }
        ],
        "timeline": "X months to become job-ready"
      }
      `;

        try {
            const response = await this.openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Skill Analysis Error:', error);
            // Fallback mock response
            return {
                critical_gaps: [{ skill: "Advanced React", importance: "high", estimated_learning_time: "2 weeks" }],
                learning_path: { phase_1_foundation: ["Advanced React"] },
                recommended_resources: [],
                timeline: "2 weeks"
            };
        }
    }

    async trackLearningProgress(userId, skillId, progress) {
        const key = `${userId}-${skillId}`;
        this.learningProgress.set(key, { progress, lastUpdated: new Date() });

        // Check for gamification rewards
        if (progress >= 100) {
            return {
                status: 'completed',
                pointsEarned: 200,
                badge: 'Skill Master'
            };
        }
        return { status: 'in_progress', pointsEarned: 10 };
    }

    async getLeaderboard() {
        // Mock leaderboard data
        return [
            { name: 'Alice', points: 1200, rank: 1 },
            { name: 'Bob', points: 950, rank: 2 },
            { name: 'Charlie', points: 800, rank: 3 }
        ];
    }
}

module.exports = SkillAdvisorService;
