import { NextFunction, Request, Response } from "express";

import { HttpException } from "../../exceptions/httpException";

export const errorMiddleware = (
    error: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const status: number = error.status || 500;
        const message: string = error.message || "Internal server error";

        //logger.error(`[${req.method} ${status}] [${req.path}] (Message: "${message}")`); // Also logged by morgan so no need to log it here
        res.status(status).json({ message });
    } catch (error) {
        next(error);
    }
};
