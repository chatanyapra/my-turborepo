import { Queue } from "bullmq";

export const codeQueue = new Queue("codeQueue", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: Number(process.env.REDIS_PORT || 6379),
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: 3
    }
});

// Add connection event listeners
codeQueue.on('error', (error) => {
    console.error('❌ Redis Queue connection error:', error);
});

console.log('🔗 Redis Queue initialized on', process.env.REDIS_HOST || "localhost", ':', process.env.REDIS_PORT || 6379);