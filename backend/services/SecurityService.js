const crypto = require('crypto');

class SecurityService {
    constructor() {
        // Mock Rate Limiting
        this.requestCounts = new Map(); // ip -> { count, windowStart }
        this.RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
        this.MAX_REQUESTS = 100;

        // Mock Encryption Key (In prod, use env vars)
        this.algorithm = 'aes-256-cbc';
        this.key = crypto.randomBytes(32);
        this.iv = crypto.randomBytes(16);
    }

    // Rate Limiting Middleware
    checkRateLimit(ip) {
        const now = Date.now();
        const record = this.requestCounts.get(ip) || { count: 0, windowStart: now };

        if (now - record.windowStart > this.RATE_LIMIT_WINDOW) {
            // Reset window
            record.count = 1;
            record.windowStart = now;
        } else {
            record.count++;
        }

        this.requestCounts.set(ip, record);

        return {
            allowed: record.count <= this.MAX_REQUESTS,
            remaining: Math.max(0, this.MAX_REQUESTS - record.count)
        };
    }

    // Encryption
    encrypt(text) {
        // Simple mock encryption for demo
        // In a real app, use crypto.createCipheriv
        return Buffer.from(text).toString('base64');
    }

    decrypt(encryptedText) {
        return Buffer.from(encryptedText, 'base64').toString('utf8');
    }

    // Input Validation
    sanitize(input) {
        if (typeof input !== 'string') return input;
        // Basic XSS prevention
        return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}

module.exports = new SecurityService();
