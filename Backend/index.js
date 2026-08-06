import express from "express"
import dotenv from "dotenv"
dotenv.config();
import cors from "cors"
import connectDB from "./lib/db.js";
import dns from "dns"
dns.setServers(["1.1.1.1", "8.8.8.8"])


import { requestLogger } from './middlewares/requestLogger.js';
import { rate } from './middlewares/rateLimiter.js';
import {errorHandler} from "./middlewares/errorHandler.js"
import {notFound} from "./middlewares/notFound.js"

import webhookRoutes from "./routers/webhookRoutes.js"
import dashboardRoutes from "./routers/dashboardRoutes.js"
import authRoutes from "./routers/authRoutes.js"
import healthRoutes from "./routers/healthRoutes.js"
import pullRequestRoutes from "./routers/pullRequestRoutes.js"
import repositoryRoutes from "./routers/repositoryRoutes.js"

import "./queues/prWorker.js"


const app = express()
const PORT = process.env.PORT

app.use(cors());

app.use(cookieParser());

app.use(express.json({
    verify:(req,res,buf)=>{
        req.rawBody = buf;
    },
}));

app.use(requestLogger);
app.use(rate);

app.get("/health", (req,res)=>{
    res.status(200).json({status: "OK", service: "Code Guardian Backend"});
})

app.use("/api/v1/webhooks", webhookRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/repositories", repositoryRoutes);
app.use("/api/v1/pull-requests", pullRequestRoutes);


app.use(notFound)
app.use(errorHandler);



app.listen(PORT,()=>{
    console.log(`server is running on PORT ${PORT}`)
    connectDB()
});