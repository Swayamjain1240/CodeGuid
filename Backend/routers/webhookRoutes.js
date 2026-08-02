import express from "express"

import {handleGitHubWebhook} from "../controllers/webhookController.js"
import {verifyGithubSig} from "../middlewares/verifyGitHubSignature.js"

const router = express.Router()


router.post("/github", verifyGithubSig, handleGitHubWebhook) 


export default router;