import { NextFunction, Request, Response } from "express";

import { HttpException } from "../../exceptions/httpException";

export const notFoundMiddleware = (req: Request, res: Response, next: NextFunction) => {
    throw new HttpException(404, "Not found");
};
