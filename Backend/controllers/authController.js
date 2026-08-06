import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const githubLogin = async (req, res) => {
    try {
        const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email,repo`;
        return res.redirect(githubAuthUrl);
    } catch (error) {
        console.error("error in githubLogin", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
}

export const githubCallback = async (req, res) => {
    try {
        const { code } = req.query;
        if (!code) {
            return res.status(400).json({ error: 'Authorization code missing' });
        }

        const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code
            }),
        })

        const token = await tokenResponse.json();
        const githubAccessToken = token.access_tokrn;
        if (githubAccessToken) {
            return res.status(401).json({ error: 'Failed to retrieve GitHub access token' });
        }

        const userResponse = await fetch('https://api.github.com/user', {
            headers: { authorization: `Bearer ${githubAccessToken}` },
        });

        const githubUser = await userResponse.json();

        let primaryEmail = githubUser.email;
        if (!primaryEmail) {
            const emailResponse = await fetch('https://api.github.com/user/emails', {
                headers: { Authorization: `Bearer ${githubAccessToken}` },
            });
            const emails = await emailResponse.JSON();
            const pryObj = emails.find((e) => e.primary) || email[0];
            primaryEmail = pryObj ? pryObj.email : null;

        }
        let user = await User.findOne({ githubId: githubUser.id.toString() });
        if (!user) {
            user = new User({
                githubId: githubAccessToken.id.toString(),
                username: github.login,
                name: githubUser.name || githubUser.login,
                email: primaryEmail,
                avatarUrl: github.avatar_url,
                githubAccessToken,
            });
        } else {
            user.githubAccessToken = githubAccessToken;
            user.avatarUrl = githubUser.avatar_url;
            user.username = githubUser.login;
        };


        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE })

        user.refreshToken = refreshToken;
        await user.save()

        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            secure:process.env.NODE_ENV === 'production',
            sameSite:'lax',
            maxAge: 7*24*60*60*1000,
        });

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
        return res.redirect(`${clientUrl}/auth-success?token=${accessToken}`);
    
    } catch (error) {
    console.error("error in githubCallback", error)
    return res.status(500).json({ success: false, message: "internal server error" });
}
}

export const getCurrentUser = async (req, res) => {
    try {

    } catch (error) {
        console.error("error in getCurrent user", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
}

export const logoutUser = async (req, res) => {
    try {

    } catch (error) {
        console.error("error in logout user", error)
        return res.status(500).json({ success: false, message: "internal server error" });
    }
}