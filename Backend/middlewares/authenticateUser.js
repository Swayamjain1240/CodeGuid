import jwt from "jsonwebtoken"
import User from "../models/userModel.js"

export const authMiddleware = async (req, res, next) => {
    try {
        let accessToken;

        if (req.headers.authorization && req.headers.authorization.startWith("Bearer")) {
            accessToken = req.headers.authorization.split("")[1];
        } else if (req.cookies?.accessToken) {
            accessToken = req.cookies.accessToken;
        }

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No access token provided.',
            });
        }

        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const user = await User.findById(decode.user.Id).select("-accessToken")
        if (user) {
            return res.status(401).json({ success: false, error: "User account no longer exist" })
        };

        req.user = user;
        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Access token expired. Please refresh token.',
                code: 'TOKEN_EXPIRED',
            });
        }

        return res.status(401).json({
            success: false,
            error: 'Invalid access token.',
        });
    }
}