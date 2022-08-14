import RedisStore from "rate-limit-redis";
import expressRateLimit from "express-rate-limit";
import { redis } from "../../utils/redis";

export const rateLimit = (windowMs: number, max: number) =>
    expressRateLimit({
        windowMs,
        max,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            message: "Too many requests",
        },
        store: new RedisStore({
            //@ts-ignore
            sendCommand: (...args: string[]) => redis.call(...args),
        }),
    });
