const GeminiService = require('./GeminiService');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class ResumeTailoringService {
    constructor(apiKey) {
        this.gemini = new GeminiService(apiKey);
    }

    /**
     * Core function: Tailor resume for specific job
     * This is the heart of JoBika - making resume match each job perfectly
     */
    async tailorResumeForJob(userResume, jobDescription, jobDetails) {
        if (!this.gemini.isConfigured()) {
            return this.getMockTailoredResume(userResume, jobDetails);
        }

        try {
            const prompt = `You are an expert resume writer for the Indian job market.

ORIGINAL RESUME:
${JSON.stringify(userResume, null, 2)}

TARGET JOB:
Company: ${jobDetails.company}
Role: ${jobDetails.title}
Location: ${jobDetails.location}

JOB DESCRIPTION:
${jobDescription}

TASK: Tailor this resume to perfectly match the job. 

RULES:
1. Keep ALL information truthful - no fabrication
2. Reorder skills to put relevant ones first
3. Emphasize relevant experience and projects
4. Add keywords from job description naturally
5. Quantify achievements where possible
6. Keep format ATS-friendly
7. Maintain professional tone for Indian market
8. Include notice period if applicable

Return JSON with this EXACT structure:
{
  "summary": "2-3 line professional summary highlighting relevant experience",
  "skills": ["skill1", "skill2", "skill3"],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2020 - Present",
      "highlights": ["Achievement 1", "Achievement 2", "Achievement 3"]
    }
  ],
  "education": [
    {
      "degree": "degree name",
      "institution": "institution name",
      "year": "year",
      "gpa": "gpa if relevant"
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "description emphasizing relevant tech/skills",
      "impact": "quantified impact"
    }
  ],
  "keywords": ["keyword1", "keyword2"],
  "atsScore": 85
}`;

            const tailoredResume = await this.gemini.generateJSON(prompt);

            return {
                ...tailoredResume,
                originalResumeId: userResume.id,
                targetJobId: jobDetails.id,
                tailoredAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Resume tailoring error:', error);
            throw new Error(`Failed to tailor resume: ${error.message}`);
        }
    }

    /**
     * Generate multiple resume variations
     * For different job types (AI Engineer, Full Stack, etc.)
     */
    async generateResumeVariations(userResume, targetRoles) {
        const variations = [];

        for (const role of targetRoles) {
            const variation = await this.tailorResumeForJob(
                userResume,
                `Looking for ${role} position`,
                { title: role, company: 'Any', location: 'Any' }
            );

            variations.push({
                roleType: role,
                resume: variation
            });
        }

        return variations;
    }

    /**
     * Generate PDF from tailored resume
     */
    async generateResumePDF(tailoredResume, outputPath) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: 'A4',
                margins: { top: 50, bottom: 50, left: 50, right: 50 }
            });

            const stream = fs.createWriteStream(outputPath);
            doc.pipe(stream);

            // Header - Name and Contact
            doc.fontSize(24).font('Helvetica-Bold').text(tailoredResume.name || 'Candidate Name', { align: 'center' });
            doc.moveDown(0.5);
            doc.fontSize(10).font('Helvetica')
                .text(`${tailoredResume.email || ''} | ${tailoredResume.phone || ''} | ${tailoredResume.location || ''}`, { align: 'center' });
            doc.moveDown(1);

            // Professional Summary
            if (tailoredResume.summary) {
                doc.fontSize(14).font('Helvetica-Bold').text('PROFESSIONAL SUMMARY');
                doc.moveDown(0.3);
                doc.fontSize(10).font('Helvetica').text(tailoredResume.summary);
                doc.moveDown(1);
            }

            // Skills
            if (tailoredResume.skills && tailoredResume.skills.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text('SKILLS');
                doc.moveDown(0.3);
                doc.fontSize(10).font('Helvetica').text(tailoredResume.skills.join(' • '));
                doc.moveDown(1);
            }

            // Experience
            if (tailoredResume.experience && tailoredResume.experience.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text('PROFESSIONAL EXPERIENCE');
                doc.moveDown(0.5);

                tailoredResume.experience.forEach(exp => {
                    doc.fontSize(12).font('Helvetica-Bold').text(exp.role);
                    doc.fontSize(10).font('Helvetica-Oblique')
                        .text(`${exp.company} | ${exp.duration}`);
                    doc.moveDown(0.3);

                    exp.highlights.forEach(highlight => {
                        doc.fontSize(10).font('Helvetica').text(`• ${highlight}`, { indent: 20 });
                    });
                    doc.moveDown(0.7);
                });
            }

            // Education
            if (tailoredResume.education && tailoredResume.education.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text('EDUCATION');
                doc.moveDown(0.5);

                tailoredResume.education.forEach(edu => {
                    doc.fontSize(11).font('Helvetica-Bold').text(edu.degree);
                    doc.fontSize(10).font('Helvetica').text(`${edu.institution} | ${edu.year}`);
                    doc.moveDown(0.5);
                });
            }

            // Projects
            if (tailoredResume.projects && tailoredResume.projects.length > 0) {
                doc.fontSize(14).font('Helvetica-Bold').text('PROJECTS');
                doc.moveDown(0.5);

                tailoredResume.projects.forEach(project => {
                    doc.fontSize(11).font('Helvetica-Bold').text(project.name);
                    doc.fontSize(10).font('Helvetica').text(project.description);
                    if (project.impact) {
                        doc.fontSize(9).font('Helvetica-Oblique').text(`Impact: ${project.impact}`);
                    }
                    doc.moveDown(0.5);
                });
            }

            doc.end();

            stream.on('finish', () => resolve(outputPath));
            stream.on('error', reject);
        });
    }

    /**
     * Mock response when OpenAI API not available
     */
    getMockTailoredResume(userResume, jobDetails) {
        return {
            summary: `Experienced professional with ${userResume.totalYears || 'X'} years in ${jobDetails.title}. Mock tailoring - add OpenAI API key for real customization.`,
            skills: userResume.skills || ['Skill 1', 'Skill 2', 'Skill 3'],
            experience: userResume.experience || [{
                company: 'Current Company',
                role: 'Current Role',
                duration: '2020-Present',
                highlights: ['Achievement 1', 'Achievement 2']
            }],
            education: userResume.education || [{
                degree: 'Bachelor of Technology',
                institution: 'University Name',
                year: '2020'
            }],
            projects: [],
            keywords: ['keyword1', 'keyword2'],
            atsScore: 75,
            isMock: true
        };
    }

    /**
     * Compare resume versions
     */
    compareResumeVersions(original, tailored) {
        return {
            changes: {
                skillsReordered: true,
                keywordsAdded: tailored.keywords.length,
                achievementsQuantified: this.countQuantifications(tailored),
                sectionsReordered: true
            },
            improvements: {
                atsScore: `+${tailored.atsScore - (original.atsScore || 65)}`,
                keywordMatch: `+${tailored.keywords.length} keywords`,
                relevance: 'High'
            }
        };
    }

    countQuantifications(resume) {
        let count = 0;
        const text = JSON.stringify(resume);
        const patterns = [/\d+%/, /\d+\s*(users|customers|projects|employees)/gi];

        patterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) count += matches.length;
        });

        return count;
    }
}

module.exports = ResumeTailoringService;
