import { logger } from "../../utils/logger";
import morgan from "morgan";

const stream = {
    write: (message: string) => logger.http(message.substring(0, message.lastIndexOf("\n"))),
};

const skip = () => {
    const env = process.env.NODE_ENV || "development";
    return env !== "development";
};

export const loggerMiddleware = morgan(
    '[:method :status] [:url] [:response-time ms] (Length: :res[content-length], User agent: ":user-agent")',
    { stream, skip }
);
