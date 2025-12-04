import puppeteer from 'puppeteer';
import db from '../database/db';

class AutoApplyAgent {
    constructor() {
        this.db = new db();
    }

    async applyToJob(userId, jobId, supervised = false) {
        const user = await this.db.getUserById(userId);
        const job = (await this.db.query('SELECT * FROM jobs WHERE id = $1', [jobId])).rows[0];
        const resume = await this.db.getLatestResume(userId);

        if (!job.source_url) throw new Error('No application URL found');

        const browser = await puppeteer.launch({
            headless: !supervised,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        try {
            await page.goto(job.source_url, { waitUntil: 'networkidle2' });

            // 1. Detect Form Fields
            const formMap = await this.detectFormFields(page);

            // 2. Fill Form
            await this.fillForm(page, formMap, user, resume);

            // 3. Submit (or wait for user if supervised)
            if (supervised) {
                console.log('Waiting for user review...');
                // In a real app, we'd stream the screenshot to the frontend
            } else {
                await this.submitForm(page);
            }

            // 4. Update Status
            await this.db.createApplication(userId, {
                job_id: jobId,
                company: job.company,
                role: job.title,
                location: job.location,
                job_url: job.source_url,
                status: 'Applied'
            });

        } catch (error) {
            console.error('Auto-apply failed:', error);
            throw error;
        } finally {
            await browser.close();
        }
    }

    async detectFormFields(page) {
        // Heuristics to find inputs
        return await page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
            return inputs.map(el => ({
                id: el.id,
                name: el.name,
                type: el.type,
                label: el.labels?.[0]?.innerText || ''
            }));
        });
    }

    async fillForm(page, formMap, user, resume) {
        for (const field of formMap) {
            const label = (field.label + field.name + field.id).toLowerCase();

            if (label.includes('name')) {
                await page.type(`[name="${field.name}"]`, user.name);
            } else if (label.includes('email')) {
                await page.type(`[name="${field.name}"]`, user.email);
            } else if (label.includes('phone') || label.includes('mobile')) {
                await page.type(`[name="${field.name}"]`, user.phone || '');
            } else if (field.type === 'file' && (label.includes('resume') || label.includes('cv'))) {
                // Handle file upload - requires local file path
                // const input = await page.$(`[name="${field.name}"]`);
                // await input.uploadFile(resume.local_path);
            }
        }
    }

    async submitForm(page) {
        const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
        if (submitBtn) await submitBtn.click();
    }
}

export default new AutoApplyAgent();
