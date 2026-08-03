import {Queue} from "bullmq"
import redis from "../config/redisConfig.js"

export const prQueue = new Queue('pr-security-scans',{
    connection: redis,
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false
    },
});


export const addPRToScanQueue = async (jobData)=>{
    return await prQueue.add('analyze-pr', jobData);
};