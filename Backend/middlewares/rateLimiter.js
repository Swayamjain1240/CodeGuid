import rateLimit from "express-rate-limit"

export const rateLimit = rateLimit({
    windowMS: 15*60*1000,
    max:50,
    standardHeaders: true,
    legacyHeaders: false,
    message:{
        success: false,
        error:'Too many requests from this IP, please try again after 15 minutes.',
    }
})