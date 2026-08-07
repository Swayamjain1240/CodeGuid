import Repository from "../models/repositoryModel.js"



export const getUserRepositories = async (req, res) => {
    try {
        const userId = req.user.id;

        const repository = await Repository.find({ awner: userId }).sort({ upadetedAt: -1 })

        return res.status(200).json({ success: true, count: repository.length, data: repository });
    } catch (error) {
        console.error("error in get user repositories", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

export const syncGitHubRepositories = async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user to retrieve GitHub access token
        const user = await User.findById(userId);
        if (!user || !user.githubAccessToken) {
            return res.status(401).json({
                success: false,
                error: 'GitHub access token not found. Please re-authenticate.',
            });
        }

        // Fetch repositories from GitHub API
        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
            headers: {
                Authorization: `Bearer ${user.githubAccessToken}`,
                Accept: 'application/vnd.github.v3+json',
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const githubRepos = await response.json();

        // Upsert (update if exists, insert if new) each repository into MongoDB
        const syncOperations = githubRepos.map((repo) => {
            return Repository.findOneAndUpdate(
                { githubRepoId: repo.id.toString() },
                {
                    owner: userId,
                    githubRepoId: repo.id.toString(),
                    name: repo.name,
                    fullName: repo.full_name,
                    private: repo.private,
                    htmlUrl: repo.html_url,
                    defaultBranch: repo.default_branch,
                    updatedAt: new Date(),
                },
                { upsert: true, new: true }
            );
        });

        const syncedRepos = await Promise.all(syncOperations);

        console.log(`[Sync] Successfully synced ${syncedRepos.length} repositories for user ${userId}`);

        return res.status(200).json({
            success: true,
            message: `Successfully synced ${syncedRepos.length} repositories from GitHub.`,
            data: syncedRepos,
        });
    } catch (error) {
        console.error("error in syncGitHubRepositories", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

export const getRepositoryById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ success: false, error: 'Repository not found.' });
        }

        if (repository.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: 'Unauthorized access to this repository.' });
        }

        return res.status(200).json({
            success: true,
            data: repository,
        });
    } catch (error) {
        console.error("error in getRepositoryById", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};

export const toggleRepositoryStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({ success: false, error: 'Repository not found.' });
        }

        if (repository.owner.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, error: 'Unauthorized to modify this repository.' });
        }

        repository.isScanningEnabled = !repository.isScanningEnabled;
        await repository.save();

        console.log(`[Toggle] Repository ${repository.fullName} scanning set to ${repository.isScanningEnabled}`);

        return res.status(200).json({
            success: true,
            message: `Security scanning ${repository.isScanningEnabled ? 'enabled' : 'disabled'} for ${repository.name}.`,
            data: repository,
        });
    } catch (error) {
        console.error("error in toggleRepositoryStatus", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
};