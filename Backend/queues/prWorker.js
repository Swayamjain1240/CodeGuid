import { Worker } from "bullmq";
import redis from "../config/redisConfig.js";
import { processPullRequestScan } from "../services/scanService.js";

export const prWorker = new Worker('pr-security-scans', async (job) => processPullRequestScan(job.data),
    {
        connection: redis,
        concurrency: 5,
    }
);


prWorker.on('completed', (job) => {
    console.log(`[Job ${job.id}] Completed successfully`);
});

prWorker.on('failed', (job, err) => {
    console.error(`[Job ${job?.id}] Failed with error: ${err.message}`);
});
