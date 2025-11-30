const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../database/db');

class JobScraperService {
    constructor() {
        this.db = new db();
    }

    async scrapeAll() {
        console.log('Starting multi-source job scrape...');
        await this.scrapeNaukri();
        await this.scrapeLinkedIn();
        await this.scrapeUnstop();
        console.log('Scraping complete.');
    }

    async scrapeNaukri() {
        // Mock implementation for Naukri - in prod use Puppeteer or API
        console.log('Scraping Naukri...');
        // Logic to fetch and parse Naukri pages
    }

    async scrapeLinkedIn() {
        console.log('Scraping LinkedIn...');
        // Logic to fetch and parse LinkedIn pages
    }

    async scrapeUnstop() {
        console.log('Scraping Unstop...');
        // Logic to fetch and parse Unstop pages
    }

    async deduplicateJobs(job) {
        // Check if job exists by company + title + location
        const existing = await this.db.query(
            'SELECT id FROM jobs WHERE company = $1 AND title = $2 AND location = $3',
            [job.company, job.title, job.location]
        );
        return existing.rowCount > 0;
    }

    async filterFakeJobs(job) {
        const redFlags = ['telegram', 'whatsapp', 'pay for interview', 'registration fee'];
        const description = (job.description || '').toLowerCase();

        for (const flag of redFlags) {
            if (description.includes(flag)) return true;
        }
        return false;
    }

    async saveJob(job) {
        if (await this.deduplicateJobs(job)) return;
        if (await this.filterFakeJobs(job)) {
            job.is_fake = true;
        }

        await this.db.query(`
            INSERT INTO jobs (title, company, location, description, salary_min, salary_max, source, source_url, is_fake)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [job.title, job.company, job.location, job.description, job.salary_min, job.salary_max, job.source, job.source_url, job.is_fake || false]);
    }
}

module.exports = new JobScraperService();
