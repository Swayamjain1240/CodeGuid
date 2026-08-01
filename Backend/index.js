import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./lib/db.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT

app.use(cors())

app.use(express.json({
    verify:(req,res,buf)=>{
        req.rawBody = buf;
    },
}));

app.get("/healh", (req,res)=>{
    res.status(200).json({status: "OK", service: "Code Guardian Backend"});
})

app.use("/api/v1/webhooks", webhookRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

app.use((err,req,res,next)=>{
    console.error("UnHandle server error", err.stack);
    res.status(500).json({error: "internal server errror"})
});

app.listen(prompt,()=>{
    console.log(`server is running on PORT ${PORT}`)
    connectDB()
});