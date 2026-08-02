import express from 'express'
import mongoose from "mongoose"

const router = express.Router();

router.get("/", (res, req) => {
    const dbState = mongoose.connection.readyState;

    const dbStatusMap = {
        0: 'Disconnected',
        1: 'Connected',
        2: 'Connecting',
        3: 'Disconnecting',
    };

    const isHealthy = dbState === 1;

    const healthData = {
        status: isHealthy ? 'OK' : 'DEGRADED',
        timestamp: new Date().toISOString(),
        uptime: `${Math.floor(process.uptime())}s`,
        database: {
            status: dbStatusMap[dbState] || 'Unknown',
            connected: isHealthy,
        },
    };

    return res.status(isHealthy ? 200 : 503).json(healthData);
})

export default router;