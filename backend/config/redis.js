const redis = require('redis');

let client;

if (process.env.REDIS_URL) {
    client = redis.createClient({
        url: process.env.REDIS_URL
    });

    client.on('error', (err) => console.log('Redis Client Error', err));
    client.connect().catch(console.error);
} else {
    console.warn('REDIS_URL not found, caching disabled');
    // Mock client for dev without Redis
    client = {
        get: async () => null,
        set: async () => 'OK',
        setEx: async () => 'OK',
        del: async () => 1,
        connect: async () => { }
    };
}

module.exports = client;
