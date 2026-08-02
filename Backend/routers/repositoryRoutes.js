import express from "express"

import {getUserRepositories, syncGitHubRepositories, getRepositoryById, toggleRepositoryStatus} from "../controllers/repositoryController.js"

import {authMiddleware} from "../middlewares/authenticateUser.js"

const router = express.Router()

router.use(authMiddleware);

router.get("/", getUserRepositories);
router.post('/sync', syncGitHubRepositories);
router.get('/:id', getRepositoryById);
router.patch('/:id/toggle', toggleRepositoryStatus);

export default router;