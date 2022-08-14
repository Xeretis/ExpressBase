import { AccessToken, User } from "@prisma/client";
import { rateLimit } from "express-rate-limit";

declare global {
    namespace Express {
        export interface Request {
            user?: User;
            accessToken?: AccessToken;
            rateLimit: {
                current: number;
                limit: number;
                remaining: number;
                resetTime: Date;
            };
        }
    }
}
