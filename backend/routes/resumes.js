const express = require('express');
const router = express.Router();
const db = require('../database/db');
const authMiddleware = require('../middleware/auth');
const ResumeTailoringService = require('../services/ResumeTailoringService');
const ResumeAnalysisService = require('../services/ResumeAnalysisService');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pdfParse = require('pdf-parse');

// Configure Multer for memory storage (files stored as Buffer)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF files are allowed!'), false);
        }
    }
});

// Initialize service
const tailoringService = new ResumeTailoringService(process.env.GEMINI_API_KEY);

// GET /api/resumes - List all tailored resume versions
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id;
        const result = await db.query(`
            SELECT rv.id, rv.created_at, rv.pdf_url, j.title as job_title, j.company 
            FROM resume_versions rv
            LEFT JOIN jobs j ON rv.job_id = j.id
            WHERE rv.user_id = $1
            ORDER BY rv.created_at DESC
        `, [userId]);

        // ...

        await db.query(`
            INSERT INTO resumes (id, user_id, original_url, file_data, parsed_data)
            VALUES ($1, $2, $3, $4, $5)
        `, [
            resumeId,
            userId,
            'stored_in_db', // Placeholder
            fileBuffer,     // Binary Data
            JSON.stringify(parsedData)
        ]);

        // ...

        // Check resume_versions first
        let result = await db.query('SELECT file_data FROM resume_versions WHERE id = $1', [id]);
        let row = result.rows ? result.rows[0] : result.rows[0];

        // If not found, check original resumes
        if (!row) {
            result = await db.query('SELECT file_data FROM resumes WHERE id = $1', [id]);
            row = result.rows ? result.rows[0] : result.rows[0];
        }

        // ...

        // 1. Fetch User's Resume
        let resume;
        if (resumeId === 'latest') {
            const resumeRes = await db.query('SELECT * FROM resumes WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1', [userId]);
            resume = resumeRes.rows ? resumeRes.rows[0] : resumeRes[0];
        } else {
            const resumeRes = await db.query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [resumeId, userId]);
            resume = resumeRes.rows ? resumeRes.rows[0] : resumeRes[0];
        }

        // ...

        if (jobId) {
            const jobRes = await db.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
            const job = jobRes.rows ? jobRes.rows[0] : jobRes[0];
            // ...

            await db.query(`
            INSERT INTO resume_versions (id, user_id, job_id, content, pdf_url, file_data)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [
                versionId,
                userId,
                jobId || null,
                JSON.stringify(tailoredResume),
                `/api/resumes/${versionId}/download`, // Point to download endpoint
                pdfBuffer
            ]);

            // ...

            // 1. Fetch Resume
            const result = await db.query('SELECT * FROM resumes WHERE id = $1 AND user_id = $2', [id, userId]);
            const resume = result.rows ? result.rows[0] : result[0];

            if (!resume) {
                return res.status(404).json({ error: 'Resume not found' });
            }

            // 2. Extract Text
            let resumeText = '';
            if (resume.parsed_data) {
                const parsed = typeof resume.parsed_data === 'string' ? JSON.parse(resume.parsed_data) : resume.parsed_data;
                resumeText = parsed.raw_text || '';
            }

            // Fallback: If no text, try to parse file_data on the fly (if pdf-parse is available)
            if (!resumeText && resume.file_data) {
                try {
                    const pdfData = await pdfParse(resume.file_data);
                    resumeText = pdfData.text;
                } catch (e) {
                    console.warn('Failed to parse PDF on the fly:', e);
                }
            }

            if (!resumeText) {
                return res.status(400).json({ error: 'Could not extract text from resume' });
            }

            // 3. Analyze
            console.log(`Analyzing resume ${id} for user ${userId}...`);
            const analysis = await ResumeAnalysisService.analyzeResume(resumeText);

            res.json({
                success: true,
                analysis
            });

        } catch (error) {
            console.error('Resume analysis error:', error);
            res.status(500).json({ error: 'Failed to analyze resume' });
        }
    });

module.exports = router;
