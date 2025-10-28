import { Queue } from "bullmq";

export const codeQueue = new Queue("codeQueue", {
    connection: {
        host: process.env.REDIS_HOST || "localhost",
        port: 6379
    }
});