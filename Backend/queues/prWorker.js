import { Worker } from "bullmq";
import redis from "../config/redisConfig.js";
import PullRequest from "../models/pullRequestModel.js"
import { PR_STATUS } from "../config/constants.js";
import { fetchPRDiff, postPRComment } from "../services/githubServices.js"
import { analyzeDiffWithAI, formatSecurityCommentMarkdown } from "../services/aiService.js"
import User from "../models/userModel.js"
import Repository from "../models/repositoryModel.js"

export const prWorker = new Worker('pr-security-scans', async (job) => {
    const {
        pullRequestId,
        repoFullName,
        prNumber,
        owner,
        repoName,
        prTitle,
        commitSha,
        author,
        branch,
        baseBranch,
        githubAccessToken: providedToken,
    } = job.data;

    console.log(`[Worker] Starting security scan for PR #${prNumber} in ${repoFullName}`);

    let prDoc;
    let token = providedToken;

    const repoDoc = await Repository.findOne({ fullName: repoFullName });

    if (!token && repoDoc) {
        const userDoc = await User.findById(repoDoc.owner);
        token = userDoc?.githubAccessToken;
    }

    if (pullRequestId) {
        prDoc = await PullRequest.findById(pullRequestId);
    } else if (repoDoc) {
        prDoc = await PullRequest.findOneAndUpdate(
            { repository: repoDoc._id, prNumber },
            {
                repository: repoDoc._id,
                prNumber,
                title: prTitle || `PR #${prNumber}`,
                commitSha: commitSha || 'HEAD',
                author: author || 'unknown',
                branch,
                baseBranch,
                status: PR_STATUS.SCANNING,
            },
            { upsert: true, new: true }
        );
    }

    if (prDoc) {
        await PullRequest.findByIdAndUpdate(prDoc._id, { status: PR_STATUS.SCANNING });
    }

    try {
        const [repoOwner, repoOnlyName] = repoFullName.split('/');
        const diffText = await fetchPRDiff(repoOwner, repoOnlyName, prNumber, token);

        const analysisResult = await analyzeDiffWithAI(diffText);


        const finalStatus =
            analysisResult.vulnerabilities && analysisResult.vulnerabilities.length > 0
                ? PR_STATUS.FAILED
                : PR_STATUS.PASSED;

        if (prDoc) {
            await PullRequest.findByIdAndUpdate(prDoc._id, {
                status: finalStatus,
                securityGrade: analysisResult.securityGrade,
                vulnerabilities: analysisResult.vulnerabilities || [],
                rawAiResponse: analysisResult.summary,
            });
        }


        if (token) {
            const markdown = formatSecurityCommentMarkdown(analysisResult);
            await postPRComment(repoOwner, repoOnlyName, prNumber, markdown, token);
            if (prDoc) {
                await PullRequest.findByIdAndUpdate(prDoc._id, { githubCommentPosted: true });
            }
        }

        console.log(`[Worker] Successfully completed scan for PR #${prNumber}`);
    } catch (error) {
        console.error(`[Worker Error] Failed scanning PR #${prNumber}:`, error.message);

        if (prDoc) {
            await PullRequest.findByIdAndUpdate(prDoc._id, {
                status: PR_STATUS.FAILED,
            });
        }
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