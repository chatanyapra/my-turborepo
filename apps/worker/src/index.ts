import { Worker } from "bullmq";
import axios from "axios";
import Redis from "ioredis";
import submissionService from "./services/submission.service.js";
import type { CreateSubmissionDTO } from "./types/index.js";

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


async function publishStatus(token: string, status: string, output = "") {
    await new Promise(resolve => setTimeout(resolve, 1000));
    pub.publish(`submission:${token}`, JSON.stringify({ status, output }))
}

new Worker(
    "codeQueue",
    async (job) => {
        const { token, source_code, language_id: lang_id, stdin = '' } = job.data;
        console.log("👷 Worker received job:", job.id);
        console.log("📦 Job token:", token);
        try {
            const { data } = await axios.post(
                `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
                {
                    source_code,
                    lang_id,
                    stdin: ''
                    // stdin: test.input,
                    // expected_output: test.expectedOutput,
                },
                { timeout: 120_000 }
            );
            console.log("data of worker queur====", data);

            const out = 'System error By chatanya pratap';

            const passdata: CreateSubmissionDTO = {
                userId: 12,
                problemId: 123,
                code: source_code,
                language: lang_id,
            }
            // submit code of user in db
            submissionService.createSubmission(passdata)

            publishStatus(token, "Completed", out);
            return out;

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
