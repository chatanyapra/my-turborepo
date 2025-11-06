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
// const pub = new Redis.default(process.env.REDIS_URL!, {
//     maxRetriesPerRequest: null,
//     enableReadyCheck: false,
// });


function publishStatus(token: string, status: string, output = "") {
    pub.publish(`submission:${token}`, JSON.stringify({ status, output }))
}

new Worker(
    "codeQueue",
    async (job) => {
        const { token, source_code, language_id: lang_id, stdin = '' } = job.data;
        // console.log("job.data++++++++++++++++++++", job.data);
        console.log("👷 Worker received job:", job.id);
        console.log("📦 Job data:", token);

        publishStatus(token, "Running");
        try {
            const { data } = await axios.post(
                `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
                { source_code, lang_id, stdin },
                { timeout: 120_000 }
            );
            console.log("data of worker queur====", data);

            const out = data.stdout ?? 'System error By chatanya pratap';
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
