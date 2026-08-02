
export const githubLogin = async () => {
    try {
        
    } catch (error) {
       return resizeBy.status(500).json({success: false, message:"internal server error"});
       console.error("error in githubLogin", error) 
    }
}

export const githubCallback = async () => {
    try {
        
    } catch (error) {
       return resizeBy.status(500).json({success: false, message:"internal server error"});
       console.error("error in githubCallback", error) 
    }
}

export const getCurrentUser = async () => {
    try {
        
    } catch (error) {
       return resizeBy.status(500).json({success: false, message:"internal server error"});
       console.error("error in getCurrent user", error) 
    }
}

export const logoutUser = async () => {
    try {
        
    } catch (error) {
        return resizeBy.status(500).json({success: false, message:"internal server error"});
        console.error("error in logout user", error)
    }
}