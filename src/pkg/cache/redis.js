import Redis from "ioredis";

export class RedisCacheProvider {
    client;

    constructor(config) {
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3,
        })

        this.client.on('error', (err) => console.log('redis server error', err.message));
        this.client.connect().catch(err => console.log('fail to connect redis', err.message));
    }

    async set(key, value, ttl) {
        return await this.client.set(key, value, 'EX', ttl);
    }

    async get(key, value, ttl) {
        return await this.client.get(key);
    }

    async del(key, value, ttl) {
        return await this.client.del(key);
    }
}