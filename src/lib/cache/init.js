import {RedisCacheProvider} from "../../pkg/cache/redis.js";
import {env} from "../config/env.js";

const cacheProvider = new RedisCacheProvider({
    host: env.redis.host,
    port: env.redis.port,
    password: env.redis.password || '',
    
})