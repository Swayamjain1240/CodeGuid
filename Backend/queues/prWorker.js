import { Worker } from "bullmq";
import redis from "../config/redisConfig.js";
import PullRequest from "../models/pullRequestModel.js"
import { PR_STATUS } from "../config/constants.js";


export const prWorker = new Worker('pr-security-scans', async (job) => {
    const { pullRequestId, repoFullName, prNumber, githubAccessToken } = job.data;

    console.log(`[Worker] Starting security scan for PR #${prNumber} in ${repoFullName}`);


    await PullRequest.findByIdAndUpdate(pullRequestId, {
        status: PR_STATUS.SCANNING,
    });

    try {
        const diffText = await fetchPRDiff(repoFullName, prNumber, githubAccessToken);
        const analysisResult = await analyzeDiffWithAI(diffText);

        await PullRequest.findByIdAndUpdate(pullRequestId, {
            status: analysisResult.vulnerablities.length > 0 ? PR_STATUS.FAILED : PR_STATUS.PASSED,
            securityGrade: analysisResult.grade,
            vulnerabilities: analysisResult.vulnerabilities,
            rawAiResponse: analysisResult.summary,

        })

        console.log(`[Worker] Successfully completed scan for PR #${prNumber}`)
    } catch (error) {
        console.error(`[Worker Error] Failed scanning PR #${prNumber}:`, error.message);

        await PullRequest.findByIdAndUpdate(pullRequestId, {
            status: PR_STATUS.FAILED,
        });

        throw error;
    }
},
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