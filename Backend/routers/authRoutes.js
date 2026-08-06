import express from "express"
import {authMiddleware} from "../middlewares/authenticateUser.js"
import { githubCallback, githubLogin, getCurrentUser, logoutUser, refreshToken } from "../controllers/authController.js";


const router = express.Router()

router.get('/github', githubLogin);
router.get('/github/callback', githubCallback);
router.get('/me', authMiddleware, getCurrentUser);
router.post('/logout', authMiddleware, logoutUser);
router.post("/refresh", refreshToken)

export default router;