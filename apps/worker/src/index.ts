import { Worker } from "bullmq";
import axios from "axios";
import Redis from "ioredis";

const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";
const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT || 6379);

const pub = new Redis.default({
    host: REDIS_HOST,
    port: REDIS_PORT,
});

function publishStatus(token: string, status: string, output = "") {
    pub.publish(`submission:${token}`, JSON.stringify({ status, output }))
}

new Worker(
    "codeQuery",
    async (job) => {
        const { token, source_code, lang_id, stdin = '' } = job.data;
        publishStatus(token, "Running");
        try {
            const { data } = await axios.post(
                `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
                { source_code, lang_id, stdin },
                { timeout: 120_000 }
            );
            const out = data.stdout ?? '';
            publishStatus(token, "Completed", out);
            return data;
        } catch (err) {
            console.error("error in uploading to docker server! ", err);
            publishStatus(token, "Failed", "Execution error");
            throw err;
        }
    },
    {
        connection: { host: REDIS_HOST, port: REDIS_PORT }
    }
)

console.log("Worker started and listening for jobs...");
