import { Job, Queue, QueueScheduler, Worker } from "bullmq";

import { JobImpl } from "../classes/jobDefinitions";
import { SendResetEmail } from "../classes/jobs/SendResetEmail";
import { SendVerifyEmail } from "../classes/jobs/SendVerifyEmail";
import dotenv from "dotenv";
import { isEmpty } from "lodash";
import { logger } from "./logger";
import { plainToInstance } from "class-transformer";
import { redis } from "./redis";

//To make sure that the .env file is loaded, it's not enough in index.js
dotenv.config();

const concurrency = +(process.env.CONCURRENT_WORKERS || 8);

const jobDictionary = new Map([
    [SendVerifyEmail.name, SendVerifyEmail],
    [SendResetEmail.name, SendResetEmail],
]);

export const getJobInstance = (data: JobImpl): JobImpl => {
    const jobClass = jobDictionary.get(data.name);

    if (jobClass) {
        return plainToInstance(jobClass, data);
    }

    return {} as JobImpl;
};

interface WorkerReply {
    status: number;
    message: string;
}

const defaultWorker = (queueName: string) => {
    const worker = new Worker<JobImpl, WorkerReply>(
        queueName,
        async (job: Job) => {
            const instance = getJobInstance(job.data);

            if (isEmpty(instance)) {
                throw new Error(`Unable to find job: ${job.name}`);
            }

            await instance.handle();

            logger.info(`Job handled: [${job.name}] [${instance.name}]`);
            return { status: 200, message: "Success" };
        },
        { connection: redis, concurrency }
    );

    worker.on("failed", (job: Job) => {
        const instance = getJobInstance(job.data);
        instance?.failed(job);
        logger.error(`Job failed: [${job.name}] [${instance.name}]`);
    });
};

export const defaultQueueName = "default-queue";
export const defaultQueue = new Queue(defaultQueueName, {
    connection: redis,
});

export const setupBullMQProcessor = async () => {
    const defaultQueueScheduler = new QueueScheduler(defaultQueueName, {
        connection: redis,
    });

    await defaultQueueScheduler.waitUntilReady();

    defaultWorker(defaultQueueName);
};
