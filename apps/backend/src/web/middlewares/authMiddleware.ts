import { NextFunction, Request, Response } from "express";

import { HttpException } from "../../exceptions/httpException";
import { Role } from "@prisma/client";
import { getAccessTokenWithUser } from "../../contexts/auth/token";

export interface AuthOptions {
    verified?: boolean;
    roles?: Role[];
}

export const auth = (options?: AuthOptions) => async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
        throw new HttpException(401, "Unauthorized");
    }

    const [, token] = bearerToken.split(" ");

    if (!token) {
        throw new HttpException(401, "Unauthorized");
    }

    const accessToken = await getAccessTokenWithUser(token);

    if (!accessToken) {
        throw new HttpException(401, "Unauthorized");
    }

    if (
        (options?.roles && !options?.roles?.includes(accessToken.user.role)) ||
        (options?.verified && !accessToken.user.verifiedAt)
    ) {
        throw new HttpException(403, "Forbidden");
    }

    req.user = accessToken.user;

    //@ts-ignore
    delete accessToken.user;

    req.accessToken = accessToken;

    return next();
};
