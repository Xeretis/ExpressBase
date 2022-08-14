import { Routes } from "./classes/routes";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./web/middlewares/errorMiddleware";
import express from "express";
import helmet from "helmet";
import hpp from "hpp";
import { logger } from "./utils/logger";
import { loggerMiddleware } from "./web/middlewares/loggerMiddleware";
import { notFoundMiddleware } from "./web/middlewares/notFoundMiddleware";
import { rateLimit } from "./web/middlewares/rateLimitMiddleware";
import { setupBullMQProcessor } from "./utils/queue";

export class Application {
    public app: express.Application;
    public env: string;
    public port: string | number;

    constructor(routes: Routes[]) {
        this.app = express();
        this.env = process.env.NODE_ENV || "development";
        this.port = process.env.PORT || 3000;

        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.use(loggerMiddleware);
        this.app.use(rateLimit(15 * 60 * 1000, 150));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(cookieParser());

        logger.info(`Initialized middlewares`);
    }

    private initializeRoutes(routes: Routes[]): void {
        routes.forEach((el: Routes) => {
            this.app.use(process.env.APP_BASE_PATH + (el.basePath || ""), el.router);
        });
        logger.info(`Initialized routes`);
    }

    private initializeErrorHandling(): void {
        this.app.use(notFoundMiddleware);
        this.app.use(errorMiddleware);
        logger.info(`Initialized error handling`);
    }

    public async initalizeQueue() {
        await setupBullMQProcessor();
        logger.info(`Initialized queue`);
    }

    public listen() {
        this.app.listen(this.port, () => {
            logger.info(`======================================`);
            logger.info(`========== ENV: ${this.env} ==========`);
            logger.info(`App listening on http://localhost:${this.port}`);
            logger.info(`======================================`);
        });
    }
}
