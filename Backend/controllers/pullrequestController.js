import PullRequest from "../models/pullRequestModel.js";
import Repository from "../models/repositoryModel.js";
import mongoose from "mongoose";
import { prQueue } from "../queues/prQueue.js";
import { PR_STATUS } from "../config/constants.js";

export const getPullRequests = async (req, res) => {
    try {
        const userId = req.user.id;
        const { page = 1, limit = 10, repoId, status } = req.query;

        const userRepos = await Repository.find({ owner: userId }).select("_id");
        const repoIds = userRepos.map((repo) => repo._id);

        const filter = { repository: { $in: repoIds } };
        if (repoId) {
            if (!repoIds.some(id => id.toString() === repoId)) {
                return res.status(403).json({
                    success: false,
                    error: "Unauthorized repository."
                });
            }

            filter.repository = repoId;
        }
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const pullRequests = await PullRequest.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('repository', 'name fullName owner');

        const totalPRs = await PullRequest.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: pullRequests,
            pagination: {
                total: totalPRs,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalPRs / parseInt(limit)),
            },
        });


    } catch (error) {
        console.error("error in getPullRequest", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

export const getPullRequestsById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Pull Request ID",
            });
        }

        const pullRequest = await PullRequest.findById(id).populate('repository');

        if (!pullRequest) {
            return res.status(404).json({ success: false, error: 'Pull request scan not found.' });
        }

        if (pullRequest.repository.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: 'Unauthorized access to this scan record.' });
        }

        return res.status(200).json({
            success: true,
            data: pullRequest,
        });
    } catch (error) {
        console.error("error in getPullRequestsById", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

export const triggerPRRescan = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                error: "Invalid Pull Request ID",
            });
        }

        const pullRequest = await PullRequest.findById(id).populate('repository');

        if (!pullRequest) {
            return res.status(404).json({ success: false, error: 'Pull request scan not found.' });
        }


        if (pullRequest.repository.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: 'Unauthorized to trigger re-scan for this repository.' });
        }

        pullRequest.status = PR_STATUS.SCANNING;
        await pullRequest.save();

        const jobData = {
            action: 'rescan',
            prNumber: pullRequest.prNumber,
            prTitle: pullRequest.title,
            branch: pullRequest.branch,
            baseBranch: pullRequest.baseBranch,
            repoId: pullRequest.repository.githubRepoId || pullRequest.repository._id.toString(),
            repoFullName: pullRequest.repository.fullName,
            owner: pullRequest.repository.fullName.split('/')[0],
            repoName: pullRequest.repository.name,
            author: pullRequest.author,
            commitSha: pullRequest.commitSha,
        };

        await prQueue.add('analyze-pr', jobData, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000,
            },
            removeOnComplete: true,
        });

        console.log(`[Rescan] Manual re-scan queued for PR #${pullRequest.prNumber}`);

        return res.status(200).json({
            success: true,
            message: 'Re-scan successfully queued.',
            data: pullRequest,
        });

    } catch (error) {
        console.error("error in triggerPRRescan", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};