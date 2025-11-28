/**
 * Enhanced Job Matching Engine for Indian Job Market
 * Implements weighted scoring algorithm:
 * - Skills Match: 40%
 * - Experience Level: 25%
 * - Location Alignment: 15%
 * - Salary Expectation: 10%
 * - Company Culture Fit: 10%
 */

class JobMatchingEngine {
    constructor(userProfile) {
        this.userProfile = userProfile;
    }

    /**
     * Calculate match score for a job (0-100)
     */
    calculateMatchScore(job) {
        const skillsScore = this.calculateSkillsMatch(job) * 0.40;
        const experienceScore = this.calculateExperienceMatch(job) * 0.25;
        const locationScore = this.calculateLocationMatch(job) * 0.15;
        const salaryScore = this.calculateSalaryMatch(job) * 0.10;
        const cultureScore = this.calculateCultureMatch(job) * 0.10;

        const totalScore = Math.round(
            skillsScore + experienceScore + locationScore + salaryScore + cultureScore
        );

        return {
            totalScore: Math.min(100, Math.max(0, totalScore)),
            breakdown: {
                skills: Math.round(skillsScore),
                experience: Math.round(experienceScore),
                location: Math.round(locationScore),
                salary: Math.round(salaryScore),
                culture: Math.round(cultureScore)
            },
            matchingSkills: this.getMatchingSkills(job),
            missingSkills: this.getMissingSkills(job)
        };
    }

    /**
     * Skills Match (40% weight)
     */
    calculateSkillsMatch(job) {
        const userSkills = this.normalizeSkills(this.userProfile.skills || []);
        const jobSkills = this.normalizeSkills(job.requiredSkills || job.skills || []);

        if (jobSkills.length === 0) return 50; // Default if no skills listed

        const matchingSkills = userSkills.filter(skill =>
            jobSkills.some(jSkill => this.skillsMatch(skill, jSkill))
        );

        const matchPercentage = (matchingSkills.length / jobSkills.length) * 100;

        // Bonus for extra valuable skills
        const bonusSkills = this.countBonusSkills(userSkills, job);
        const bonus = Math.min(20, bonusSkills * 5);

        return Math.min(100, matchPercentage + bonus);
    }

    /**
     * Experience Level Match (25% weight)
     */
    calculateExperienceMatch(job) {
        const userYears = this.userProfile.yearsOfExperience || 0;
        const requiredMin = job.minExperience || 0;
        const requiredMax = job.maxExperience || requiredMin + 5;

        // Perfect match if within range
        if (userYears >= requiredMin && userYears <= requiredMax) {
            return 100;
        }

        // Underqualified
        if (userYears < requiredMin) {
            const gap = requiredMin - userYears;
            return Math.max(0, 100 - (gap * 20)); // -20 points per year short
        }

        // Overqualified
        if (userYears > requiredMax) {
            const excess = userYears - requiredMax;
            return Math.max(50, 100 - (excess * 10)); // -10 points per year over
        }

        return 50;
    }

    /**
     * Location Alignment (15% weight)
     */
    calculateLocationMatch(job) {
        const userLocations = this.normalizeLocations(
            this.userProfile.preferredLocations || []
        );
        const jobLocation = this.normalizeLocation(job.location);

        // Remote jobs are always a match
        if (jobLocation === 'remote' || job.isRemote) {
            return 100;
        }

        // Check if job location is in user's preferred list
        const isPreferred = userLocations.some(loc =>
            loc === jobLocation || this.areSameMetroArea(loc, jobLocation)
        );

        if (isPreferred) {
            return 100;
        }

        // Check if it's at least in the same state/region
        const isSameRegion = userLocations.some(loc =>
            this.areSameRegion(loc, jobLocation)
        );

        if (isSameRegion) {
            return 60;
        }

        // Different region but user is open to relocation
        if (this.userProfile.openToRelocation) {
            return 40;
        }

        return 20; // Low score if not matching location preferences
    }

    /**
     * Salary Expectation Match (10% weight)
     */
    calculateSalaryMatch(job) {
        if (!job.salaryMin && !job.salaryMax) {
            return 50; // Neutral if salary not disclosed
        }

        const userMin = this.userProfile.expectedSalaryMin || 0;
        const userMax = this.userProfile.expectedSalaryMax || userMin * 2;
        const jobMin = this.parseSalary(job.salaryMin);
        const jobMax = this.parseSalary(job.salaryMax);

        // Job salary range overlaps with user expectation
        if (jobMax >= userMin && jobMin <= userMax) {
            // Perfect match if job offers within or above user's range
            if (jobMin >= userMin) {
                return 100;
            }
            // Partial match if only upper end meets expectation
            return 70;
        }

        // Job pays less than expected
        if (jobMax < userMin) {
            const gap = ((userMin - jobMax) / userMin) * 100;
            return Math.max(0, 100 - gap);
        }

        // Job pays more than expected (still good!)
        return 80;
    }

    /**
     * Company Culture Fit (10% weight)
     */
    calculateCultureMatch(job) {
        let score = 50; // Base score

        // Company type preference
        if (this.userProfile.preferredCompanyTypes) {
            const jobType = this.getCompanyType(job.company);
            if (this.userProfile.preferredCompanyTypes.includes(jobType)) {
                score += 20;
            }
        }

        // Company size preference
        if (this.userProfile.preferredCompanySize) {
            const jobSize = job.companySize || 'unknown';
            if (this.userProfile.preferredCompanySize === jobSize) {
                score += 15;
            }
        }

        // Industry preference
        if (this.userProfile.preferredIndustries) {
            const jobIndustry = job.industry || 'unknown';
            if (this.userProfile.preferredIndustries.includes(jobIndustry)) {
                score += 15;
            }
        }

        return Math.min(100, score);
    }

    // Helper Methods
    normalizeSkills(skills) {
        return skills.map(s => s.toLowerCase().trim());
    }

    skillsMatch(userSkill, jobSkill) {
        if (userSkill === jobSkill) return true;

        // Check for common variations
        const synonyms = {
            'javascript': ['js', 'ecmascript'],
            'typescript': ['ts'],
            'python': ['py'],
            'react': ['reactjs', 'react.js'],
            'node': ['nodejs', 'node.js'],
            'aws': ['amazon web services'],
            'gcp': ['google cloud platform']
        };

        for (const [key, variants] of Object.entries(synonyms)) {
            if ((userSkill === key || variants.includes(userSkill)) &&
                (jobSkill === key || variants.includes(jobSkill))) {
                return true;
            }
        }

        return false;
    }

    countBonusSkills(userSkills, job) {
        const highValueSkills = ['ai', 'ml', 'machine learning', 'kubernetes',
            'docker', 'aws', 'react', 'typescript'];
        return userSkills.filter(s => highValueSkills.includes(s)).length;
    }

    normalizeLocations(locations) {
        return locations.map(loc => this.normalizeLocation(loc));
    }

    normalizeLocation(location) {
        if (!location) return '';
        const loc = location.toLowerCase().trim();

        // Normalize common variations
        const cityMap = {
            'bangalore': ['bengaluru', 'blr'],
            'mumbai': ['bombay'],
            'delhi': ['new delhi', 'ncr', 'delhi ncr'],
            'hyderabad': ['hyd'],
            'pune': [],
            'chennai': ['madras'],
            'kolkata': ['calcutta']
        };

        for (const [city, variations] of Object.entries(cityMap)) {
            if (loc.includes(city) || variations.some(v => loc.includes(v))) {
                return city;
            }
        }

        if (loc.includes('remote')) return 'remote';

        return loc;
    }

    areSameMetroArea(loc1, loc2) {
        const metros = {
            'delhi': ['gurgaon', 'gurugram', 'noida', 'faridabad', 'ghaziabad'],
            'mumbai': ['navi mumbai', 'thane', 'pune'],
            'bangalore': [],
            'hyderabad': [],
            'chennai': []
        };

        for (const [metro, suburbs] of Object.entries(metros)) {
            if ((loc1 === metro && suburbs.includes(loc2)) ||
                (loc2 === metro && suburbs.includes(loc1))) {
                return true;
            }
        }

        return false;
    }

    areSameRegion(loc1, loc2) {
        const regions = {
            'north': ['delhi', 'gurgaon', 'noida', 'chandigarh', 'jaipur'],
            'south': ['bangalore', 'hyderabad', 'chennai', 'pune'],
            'west': ['mumbai', 'pune', 'ahmedabad'],
            'east': ['kolkata']
        };

        for (const cities of Object.values(regions)) {
            if (cities.includes(loc1) && cities.includes(loc2)) {
                return true;
            }
        }

        return false;
    }

    parseSalary(salaryStr) {
        if (!salaryStr) return 0;

        // Parse formats like "₹25-35 LPA" or "25 LPA"
        const match = salaryStr.match(/(\d+)/);
        if (match) {
            return parseInt(match[1]);
        }

        return 0;
    }

    getCompanyType(companyName) {
        // Simple heuristic - can be enhanced with a database
        const mncs = ['google', 'microsoft', 'amazon', 'facebook', 'apple'];
        const startups = ['zomato', 'swiggy', 'razorpay', 'cred'];

        const name = companyName.toLowerCase();

        if (mncs.some(mnc => name.includes(mnc))) return 'mnc';
        if (startups.some(s => name.includes(s))) return 'startup';

        return 'product';
    }

    getMatchingSkills(job) {
        const userSkills = this.normalizeSkills(this.userProfile.skills || []);
        const jobSkills = this.normalizeSkills(job.requiredSkills || job.skills || []);

        return userSkills.filter(skill =>
            jobSkills.some(jSkill => this.skillsMatch(skill, jSkill))
        );
    }

    getMissingSkills(job) {
        const userSkills = this.normalizeSkills(this.userProfile.skills || []);
        const jobSkills = this.normalizeSkills(job.requiredSkills || job.skills || []);

        return jobSkills.filter(skill =>
            !userSkills.some(uSkill => this.skillsMatch(uSkill, skill))
        );
    }
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
    module.exports = JobMatchingEngine;
} else {
    window.JobMatchingEngine = JobMatchingEngine;
}
