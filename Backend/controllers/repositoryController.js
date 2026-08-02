export const getUserRepositories = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success:false, message:"internal server error"});
        console.error("error in get user repositories", error)
    }
}

export const syncGitHubRepositories = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success:false, message:"internal server error"});
        console.error("error in syncGitHubRepositories", error)
    }
}

export const getRepositoryById = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success:false, message:"internal server error"});
        console.error("error in getRepositoryById", error)
    }
}

export const toggleRepositoryStatus = async (req,res) => {
    try {
        
    } catch (error) {
        return res.status(500).json({success:false, message:"internal server error"});
        console.error("error in toggleRepositoryStatus", error)
    }
}