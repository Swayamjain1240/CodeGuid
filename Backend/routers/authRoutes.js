import express from "express"
import {authMiddleware} from "../middlewares/authenticateUser.js"
import {} from "";


const router = express.Router()

router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);
router.get('/me', authenticateUser, getCurrentUser);
router.post('/logout', authenticateUser, logoutUser);

export default router;