import {cacheProvider} from "./init.js";
import {logger} from "../../pkg/logger/logger.js";

export function withCache(ttl =3600){
    return async (req, res, next) => {
        let key = `${req.method}:${req.originalUrl}`
        try {

        const cached = await cacheProvider.get(key)
        if(cached){
            res.setHeader('x-Cache','HIT')
            return res.json(JSON.parse(cached));
        }
        }catch (err){
            logger.error('cache read failed',{error: err.message})
        }
        const originalJson = res.json.bind(res)
        res.json =(async (body) => {
            if(res.statusCode >= 200 && res.statusCode < 300){

            await cacheProvider.set(key, JSON.stringify(body), ttl).catch(err=>logger.error('cache write failed',{error:err.message}));
            res.setHeader('x-Cache','MISS')
            }
            return originalJson(body)
        });
        next()
    }
}