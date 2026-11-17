import {cacheProvider} from "./init";
import {NextFunction, Request, Response} from "express";

export function withCache(ttl = 3600) {
    return async (req: Request, res: Response, next: NextFunction) => {
        let key = `${req.method}:${req.originalUrl}`
        try {

            const cached = await cacheProvider.get(key)
            if (cached) {
                res.setHeader('x-Cache', 'HIT')
                return res.json(JSON.parse(cached));
            }
        } catch (err) {
        }
        const originalJson = res.json.bind(res)
        res.json = ((body) => {
            if (res.statusCode >= 200 && res.statusCode < 300) {

                cacheProvider.set(key, JSON.stringify(body), ttl);
                res.setHeader('x-Cache', 'MISS')
            }
            return originalJson(body)
        });
        next()
    }
}