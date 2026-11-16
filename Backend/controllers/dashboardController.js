import PullRequest from "../models/pullRequestModel.js"
import Repository from "../models/repositoryModel.js"
import { PR_STATUS } from "../config/constants.js"
import { buildDashboardPayload, GRADES } from "../services/dashboardService.js"

const toCountObject = (stats = []) => {
    return stats.reduce((counts, stat) => {
        if (stat?._id) counts[stat._id] = stat.count;
        return counts;
    }, {});
};

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

        const [vulnerabilityStats, gradeStats] = await Promise.all([
            PullRequest.aggregate([
                { $match: { repository: { $in: repoId } } },
                { $unwind: '$vulnerabilities' },
                {
                    $group: {
                        _id: '$vulnerabilities.severity',
                        count: { $sum: 1 },
                    },
                },
            ]),
            PullRequest.aggregate([
                { $match: { repository: { $in: repoId }, securityGrade: { $in: GRADES } } },
                {
                    $group: {
                        _id: '$securityGrade',
                        count: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const recentScans = await PullRequest.find({ repository: { $in: repoId } })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('repository', 'name fullName')
            .select('prNumber title status securityGrade vulnerabilities createdAt')

        const data = buildDashboardPayload({
            counts: {
                totalRepos,
                totalPRs,
                passedPRs,
                failedPRs,
                scanningPRs,
            },
            severityCounts: toCountObject(vulnerabilityStats),
            gradeCounts: toCountObject(gradeStats),
            recentScans,
        });

        return res.status(200).json({
            success: true,
            data,
        });

    } catch (error) {
        console.error("error in getDashboardStats", error);
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};
