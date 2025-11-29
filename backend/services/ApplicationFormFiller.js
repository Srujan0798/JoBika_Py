const puppeteer = require('puppeteer');

class ApplicationFormFiller {
    constructor(page, userProfile) {
        this.page = page;
        this.user = userProfile;
    }

    async detectFormFields() {
        // Detect all form fields on the page
        const fields = await this.page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
            return inputs.map(el => ({
                id: el.id,
                name: el.name,
                type: el.type,
                placeholder: el.placeholder,
                label: el.labels?.[0]?.innerText,
                required: el.required
            }));
        });

        return this.mapFieldsToData(fields);
    }

    mapFieldsToData(fields) {
        // Intelligent field mapping
        const mapping = {};

        for (const field of fields) {
            const identifier = (field.name + (field.label || '') + (field.placeholder || '')).toLowerCase();

            // Name fields
            if (identifier.includes('name') && identifier.includes('first')) {
                mapping[field.id || field.name] = this.user.firstName;
            } else if (identifier.includes('name') && identifier.includes('last')) {
                mapping[field.id || field.name] = this.user.lastName;
            } else if (identifier.includes('name') && !identifier.includes('company')) {
                mapping[field.id || field.name] = this.user.fullName;
            }

            // Contact fields
            else if (identifier.includes('email')) {
                mapping[field.id || field.name] = this.user.email;
            } else if (identifier.includes('phone') || identifier.includes('mobile')) {
                mapping[field.id || field.name] = this.user.phone;
            }

            // Professional fields
            else if (identifier.includes('experience') || identifier.includes('years')) {
                mapping[field.id || field.name] = this.user.totalYears.toString();
            } else if (identifier.includes('current') && identifier.includes('company')) {
                mapping[field.id || field.name] = this.user.currentCompany;
            } else if (identifier.includes('current') && identifier.includes('ctc')) {
                mapping[field.id || field.name] = this.user.currentCTC.toString();
            } else if (identifier.includes('expected') && identifier.includes('ctc')) {
                mapping[field.id || field.name] = this.user.expectedCTC.toString();
            } else if (identifier.includes('notice') && identifier.includes('period')) {
                mapping[field.id || field.name] = this.user.noticePeriod.toString();
            }

            // Location
            else if (identifier.includes('location') || identifier.includes('city')) {
                mapping[field.id || field.name] = this.user.currentLocation;
            }

            // Resume upload
            else if (field.type === 'file' && identifier.includes('resume')) {
                mapping[field.id || field.name] = { type: 'file', path: this.user.resumePath };
            }

            // Cover letter
            else if (identifier.includes('cover') && identifier.includes('letter')) {
                mapping[field.id || field.name] = this.user.coverLetter;
            }

            // Skills (checkboxes or multi-select)
            else if (identifier.includes('skill')) {
                mapping[field.id || field.name] = this.user.skills;
            }

            // LinkedIn profile
            else if (identifier.includes('linkedin')) {
                mapping[field.id || field.name] = this.user.linkedinUrl;
            }

            // Portfolio/GitHub
            else if (identifier.includes('portfolio') || identifier.includes('github')) {
                mapping[field.id || field.name] = this.user.portfolioUrl || this.user.githubUrl;
            }
        }

        return mapping;
    }

    async fillForm(mapping) {
        for (const [fieldSelector, value] of Object.entries(mapping)) {
            if (!value) continue;

            try {
                if (value?.type === 'file') {
                    // Upload file
                    const input = await this.page.$(`#${fieldSelector}, [name="${fieldSelector}"]`);
                    if (input) await input.uploadFile(value.path);
                } else if (Array.isArray(value)) {
                    // Handle multi-select or checkboxes (skills)
                    for (const skill of value) {
                        try {
                            await this.page.click(`input[value="${skill}"], label:contains("${skill}")`);
                        } catch (e) {
                            // Ignore if specific skill not found
                        }
                    }
                } else {
                    // Regular text input
                    await this.page.type(`#${fieldSelector}, [name="${fieldSelector}"]`, value.toString());
                }
            } catch (e) {
                console.error(`Failed to fill field ${fieldSelector}:`, e.message);
            }
        }
    }

    async submitForm(supervised = true) {
        if (supervised) {
            // Take screenshot for user review
            const screenshot = await this.page.screenshot({ fullPage: true, encoding: 'base64' });
            return { screenshot, needsApproval: true };
        } else {
            // Auto-submit
            const submitButton = await this.page.$('button[type="submit"], input[type="submit"]');
            if (submitButton) {
                await submitButton.click();

                // Wait for confirmation
                await this.page.waitForNavigation({ timeout: 10000 }).catch(() => { });

                // Capture confirmation message
                const confirmation = await this.page.evaluate(() => {
                    return document.body.innerText.includes('Application submitted') ||
                        document.body.innerText.includes('Thank you') ||
                        document.body.innerText.includes('Success');
                });

                return { success: confirmation };
            }
            return { success: false, error: 'Submit button not found' };
        }
    }
}

module.exports = ApplicationFormFiller;
