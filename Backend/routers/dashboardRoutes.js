import express from "express"
import {authMiddleware} from "../middlewares/authenticateUser.js"
import { getDashboardStarts } from "../controllers/dashboardController.js";


const router = express.Router()

router.use(authMiddleware);

router.get("/starts", getDashboardStarts);
export default router