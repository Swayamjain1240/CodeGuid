import PullRequest from "../models/pullRequestModel.js"
import Repository from "../models/repositoryModel.js"
import { PR_STATUS } from "../config/constants.js"

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id;

        const userRepo = await Repository.find({ owner: userId }).select("_id");
        const repoId = userRepo.map((repo) => repo._id);


        const [
            totalRepos,
            totalPRs,
            passedPRs,
            failedPRs,
            scanningPRs,
        ] = await Promise.all([
            Repository.countDocuments({ owner: userId }),
            PullRequest.countDocuments({ repository: { $in: repoId } }),
            PullRequest.countDocuments({ repository: { $in: repoId }, status: PR_STATUS.PASSED }),
            PullRequest.countDocuments({ repository: { $in: repoId }, status: PR_STATUS.FAILED }),
            PullRequest.countDocuments({ repository: { $in: repoId }, status: PR_STATUS.SCANNING }),
        ]);
        const passRate = totalPRs > 0 ? Number(((passedPRs / totalPRs) * 100).toFixed(1)) : 100;

        const vulnerabilityStats = await PullRequest.aggregate([
            { $match: { repository: { $in: repoId } } },
            { $unwind: '$vulnerabilities' },
            {
                $group: {
                    _id: '$vulnerabilities.severity',
                    count: { $sum: 1 },
                },
            },
        ]);

        const severityCounts = {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
        };

        vulnerabilityStats.forEach((stat) => {
            if (severityCounts[stat._id] !== undefined) {
                severityCounts[stat._id] = stat.count;
            }
        });

        const recentScans = await PullRequest.find({ repository: { $in: repoId } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('repository', 'name fullName')
            .select('prNumber title status securityGrade vulnerabilities createdAt')



        return res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalRepos,
                    totalPRs,
                    passedPRs,
                    failedPRs,
                    scanningPRs,
                    passRate,
                },
                vulnerabilities: severityCounts,
                recentScans,
            },
        });

    } catch (error) {
        console.error("error in get dashboard starts");
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};