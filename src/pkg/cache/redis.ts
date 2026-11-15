import Redis from "ioredis";
import {ICacheProvider} from "./cache.interface";

interface IRedisConfig {
    url: string;
    host: string;
    port: number;
    password: string;
}

export class RedisCacheProvider implements ICacheProvider{
    private client:any;

    constructor(config:IRedisConfig) {
        this.client = new Redis({
            host: config.host,
            port: config.port,
            password: config.password,
            lazyConnect: true,
            maxLoadingRetryTime: 3,
        })

        this.client.on('error', (err:Error) => console.log('redis server error', err.message));
        this.client.connect().catch((err:Error) => console.log('fail to connect redis', err.message));
    }

    async set(key:string, value:string, ttl:number) {
        return await this.client.set(key, value, 'EX', ttl);
    }

    async get(key:string) {
        return await this.client.get(key);
    }

    async del(key:string) {
        return await this.client.del(key);
    }

    async ttl(key:string) {
        return await this.client.ttl(key);
    }
}