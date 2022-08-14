import { existsSync, mkdirSync } from "fs";

import { join } from "path";
import winston from "winston";
import winstonDaily from "winston-daily-rotate-file";

const logDir = join(__dirname, "../../", process.env.LOG_DIR || "logs");

if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const logFormat = winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

export const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({
            format: "YYYY-MM-DD HH:mm:ss",
        }),
        logFormat
    ),
    levels: levels,
    transports: [
        new winstonDaily({
            level: "debug",
            datePattern: "YYYY-MM-DD",
            dirname: logDir + "/debug", // log file /logs/debug/*.log in save
            filename: `%DATE%.log`,
            maxFiles: 30, // 30 Days saved
            json: false,
            zippedArchive: true,
        }),
        new winstonDaily({
            level: "error",
            datePattern: "YYYY-MM-DD",
            dirname: logDir + "/error", // log file /logs/error/*.log in save
            filename: `%DATE%.log`,
            maxFiles: 30, // 30 Days saved
            handleExceptions: true,
            json: false,
            zippedArchive: true,
        }),
        new winston.transports.Console({
            level: "debug",
            format: winston.format.combine(winston.format.colorize({ level: true }), logFormat),
        }),
    ],
});
