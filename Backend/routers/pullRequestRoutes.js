import express from "express"
import {} from "../controllers/"

import {authMiddleware} from "../middlewares/authenticateUser.js"

const router = express.Router()

router.use(authMiddleware)

router.get("/", getPullRequests);
router.get('/:id', getPullRequestById);
router.post('/:id/rescan', triggerPRRescan);

export default router;