import PullRequest from "../models/pullRequestModel.js"
import Repository from "../models/repositoryModel.js"

export const handleGitHubWebhook = async (req,res,next) => {
    try {
        const event = req.headers['x-github-event'];
        const payload = req.body;

        if(event === 'ping'){
            
        }
    } catch (error) {
        
    }
}