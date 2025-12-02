const { createClient } = require('redis');

class CacheService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.memoryCache = new Map();
        this.init();
    }

    async init() {
        if (process.env.REDIS_URL) {
            try {
                this.client = createClient({
                    url: process.env.REDIS_URL
                });

                this.client.on('error', (err) => {
                    console.error('❌ Redis Client Error:', err.message);
                    this.isConnected = false;
                });

                this.client.on('connect', () => {
                    console.log('✅ Redis Connected');
                    this.isConnected = true;
                });

                await this.client.connect();
            } catch (error) {
                console.error('❌ Failed to connect to Redis:', error.message);
                console.log('⚠️ Using In-Memory Cache Fallback');
            }
        } else {
            console.log('⚠️ No REDIS_URL found. Using In-Memory Cache Fallback.');
        }
    }

    async get(key) {
        if (this.isConnected && this.client) {
            try {
                const value = await this.client.get(key);
                return value ? JSON.parse(value) : null;
            } catch (error) {
                console.error('Cache Get Error:', error);
                return null;
            }
        } else {
            // In-Memory Fallback
            const item = this.memoryCache.get(key);
            if (!item) return null;

            if (Date.now() > item.expiry) {
                this.memoryCache.delete(key);
                return null;
            }
            return item.value;
        }
    }

    async set(key, value, ttlSeconds = 300) {
        if (this.isConnected && this.client) {
            try {
                await this.client.set(key, JSON.stringify(value), {
                    EX: ttlSeconds
                });
            } catch (error) {
                console.error('Cache Set Error:', error);
            }
        } else {
            // In-Memory Fallback
            this.memoryCache.set(key, {
                value,
                expiry: Date.now() + (ttlSeconds * 1000)
            });

            // Simple cleanup to prevent memory leaks
            if (this.memoryCache.size > 1000) {
                const firstKey = this.memoryCache.keys().next().value;
                this.memoryCache.delete(firstKey);
            }
        }
    }

    async del(key) {
        if (this.isConnected && this.client) {
            try {
                await this.client.del(key);
            } catch (error) {
                console.error('Cache Del Error:', error);
            }
        } else {
            this.memoryCache.delete(key);
        }
    }
}

module.exports = new CacheService();
