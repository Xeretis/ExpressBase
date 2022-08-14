import Redis from "ioredis";
import dotenv from "dotenv";

//To make sure that the .env file is loaded, it's not enough in index.js
dotenv.config();

export const redis = new Redis({
    port: +(process.env.REDIS_PORT || 6379),
    host: process.env.REDIS_HOST || "localhost",
    maxRetriesPerRequest: null,
});
