import PullRequest from "../models/pullRequestModel.js"
import Repository from "../models/repositoryModel.js"
import {prQueue} from "../queues/prQueue.js"

export const handleGitHubWebhook = async (req, res, next) => {
    try {
        const event = req.headers['x-github-event'];

        if (event !== 'pull_request') {
            return res.status(200).json({ message: `Ignored event type: ${event}` });
        }

        const { action, pull_request, repository, sender } = req.body;

        if (!pull_request || !repository || !sender){
            return res.status(401).json({message:"all field required"});
        }

        const allowedActions = ['opened', 'reopened', 'synchronize'];
        if (!allowedActions.includes(action)) {
            return res.status(200).json({ message: `Ignored PR action: ${action}` });
        }


        const jobData = {
            action,
            prNumber: pull_request.number,
            prTitle: pull_request.title,
            branch: pull_request.head.ref,
            baseBranch: pull_request.base.ref,
            repoId: repository.id.toString(),
            repoFullName: repository.full_name,
            owner: repository.owner.login,
            repoName: repository.name,
            author: sender.login,
            commitSha: pull_request.head.sha,
        };

        await prQueue.add('analyze-pr', jobData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: true,
        });

        console.log(`[Webhook] Enqueued PR #${pull_request.number} from ${repository.full_name}`);

        return res.status(202).json({
            success: true,
            message: 'Pull request webhook received and queued for analysis.',
        });
    } catch (error) {
        console.error('[Webhook Controller Error]', error.message);
        return res.status(500).json({ error: 'Failed to process incoming webhook.' });
    }
};