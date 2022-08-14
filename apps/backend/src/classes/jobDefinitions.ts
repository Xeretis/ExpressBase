import { Job } from "bullmq";

//* Note: Each job must be added to the jobDictionary in the queue.ts file

export interface JobImpl {
    name: string;
    payload: Record<string, any>;
    handle(job?: Job): Promise<void>;
    failed(job: Job): Promise<void>;
}

export class BaseJob {
    public readonly name: string = this.constructor.name;
}
