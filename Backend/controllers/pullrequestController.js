export const getPullRequests = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success: false, message:"internal server error"});
        console.error("error in getPullRequest", error)
    }
}

export const getPullRequestsById = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success: false, message:"internal server error"});
        console.error("error in getPullRequestsById", error)
    }
}

export const triggerPRRescan = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success: false, message:"internal server error"});
        console.error("error in triggerPRRescan", error)
    }
}