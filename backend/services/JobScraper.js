const puppeteer = require('puppeteer');

class JobScraper {
    constructor() {
        this.browser = null;
    }

    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    /**
     * Scrape jobs from LinkedIn public search
     * @param {string} query - Job title/keywords
     * @param {string} location - Job location
     */
    async scrapeLinkedIn(query, location) {
        try {
            await this.init();
            const page = await this.browser.newPage();

            // Set user agent to avoid immediate blocking
            await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

            const url = `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}`;
            console.log(`Scraping LinkedIn: ${url}`);

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

            // Wait for job list to load
            try {
                await page.waitForSelector('.jobs-search__results-list', { timeout: 5000 });
            } catch (e) {
                console.log('LinkedIn selector not found, might be blocked or empty.');
            }

            const jobs = await page.evaluate(() => {
                const jobCards = document.querySelectorAll('li');
                const results = [];

                jobCards.forEach(card => {
                    try {
                        const titleEl = card.querySelector('.base-search-card__title');
                        const companyEl = card.querySelector('.base-search-card__subtitle');
                        const locationEl = card.querySelector('.job-search-card__location');
                        const linkEl = card.querySelector('a.base-card__full-link');
                        const timeEl = card.querySelector('time');

                        if (titleEl && companyEl) {
                            results.push({
                                title: titleEl.innerText.trim(),
                                company: companyEl.innerText.trim(),
                                location: locationEl ? locationEl.innerText.trim() : '',
                                url: linkEl ? linkEl.href : '',
                                posted: timeEl ? timeEl.innerText.trim() : 'Recently',
                                source: 'LinkedIn',
                                id: 'li-' + Math.random().toString(36).substr(2, 9)
                            });
                        }
                    } catch (err) {
                        // Skip malformed card
                    }
                });

                return results.slice(0, 10); // Limit to 10 jobs
            });

            await page.close();
            return jobs;

        } catch (error) {
            console.error('LinkedIn Scraping Error:', error);
            return [];
        }
    }

    /**
     * Scrape jobs from Unstop (Mock implementation for stability as Unstop structure is complex/dynamic)
     * In a real scenario, we would reverse engineer their API or use Puppeteer similarly.
     */
    async scrapeUnstop(query) {
        // Simulating Unstop scraping for demonstration
        // Real scraping would involve visiting https://unstop.com/opportunities?searchTerm={query}
        return [
            {
                id: 'un-' + Math.random().toString(36).substr(2, 9),
                title: `${query} Challenge 2025`,
                company: 'Unstop',
                location: 'Remote',
                salary: '₹12-18 LPA',
                posted: '2 days ago',
                source: 'Unstop',
                url: 'https://unstop.com/hiring',
                skills: ['Problem Solving', 'Coding', 'Aptitude']
            },
            {
                id: 'un-' + Math.random().toString(36).substr(2, 9),
                title: 'Tech Innovation Hackathon',
                company: 'TechGiants',
                location: 'Bangalore',
                salary: 'Prizes + Hiring',
                posted: '1 week ago',
                source: 'Unstop',
                url: 'https://unstop.com/hackathons',
                skills: ['Innovation', 'Prototyping']
            }
        ];
    }

    /**
     * Combined search
     */
    async searchJobs(source, query, location) {
        if (source === 'linkedin') {
            return await this.scrapeLinkedIn(query, location);
        } else if (source === 'unstop') {
            return await this.scrapeUnstop(query);
        }
        return [];
    }
}

module.exports = JobScraper;
