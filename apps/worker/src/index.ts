import { Worker } from "bullmq";
import axios from "axios";
import Redis from "ioredis";
import submissionService from "./services/submission.service.js";
import type { CreateSubmissionDTO } from "./types/index.js";

const JUDGE0_URL = process.env.JUDGE0_URL || "http://54.144.105.59:2358";
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

interface ExecutionResult {
    stdout: string;
    stderr: string;
    compileOutput: string;
    time: string;
    memory: string;
}

interface TestCaseResult {
    input: string;
    output: string;
    expected: string;
    status: string;
    isPassed: boolean;
    isVisible: boolean;
}

interface TestSummary {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    visibleTests: number;
    hiddenTests: number;
    hasFailures: boolean;
    allPassed: boolean;
}

function formatExecutionOutput(result: ExecutionResult): string {
    const { stdout, stderr, compileOutput, time, memory } = result;

    let formattedOutput = "";

    // Add execution info
    formattedOutput += `⏱️ **Execution Time:** ${time}s\n`;
    formattedOutput += `💾 **Memory Used:** ${memory} KB\n\n`;

    // Handle compilation errors first
    if (compileOutput && compileOutput.trim()) {
        formattedOutput += `🔨 **Compilation Output:**\n\`\`\`\n${compileOutput}\n\`\`\`\n\n`;
        formattedOutput += `COMPILATION_ERROR\n`; // Flag for frontend
        return formattedOutput.trim();
    }

    // Handle stderr
    if (stderr && stderr.trim()) {
        formattedOutput += `⚠️ **Runtime Errors:**\n\`\`\`\n${stderr}\n\`\`\`\n\n`;
        formattedOutput += `RUNTIME_ERROR\n`; // Flag for frontend
        return formattedOutput.trim();
    }

    // Handle stdout - the main output
    if (stdout && stdout.trim()) {
        // Check if it looks like test results
        if (stdout.includes("Passed") || stdout.includes("Failed")) {
            // Parse test cases
            const testCases = stdout.split('\n\n').filter(tc => tc.trim());
            const parsedTests: TestCaseResult[] = [];

            testCases.forEach((testCase, index) => {
                if (testCase.trim()) {
                    const lines = testCase.split('\n').filter(line => line.trim());

                    // Extract test case information
                    let input = '';
                    let output = '';
                    let expected = '';
                    let status = '';

                    lines.forEach(line => {
                        if (line.startsWith('Input:')) {
                            input = line.replace('Input:', '').trim().replace(/"/g, '');
                        } else if (line.startsWith('Output:')) {
                            output = line.replace('Output:', '').trim();
                        } else if (line.startsWith('Expected:')) {
                            expected = line.replace('Expected:', '').trim();
                        } else if (line.includes('Passed') || line.includes('Failed')) {
                            status = line.trim();
                        }
                    });

                    const isPassed = status.includes('Passed');
                    // Assume first 3 test cases are visible, rest are hidden (you can adjust this logic)
                    const isVisible = index < 3;

                    parsedTests.push({
                        input,
                        output,
                        expected,
                        status,
                        isPassed,
                        isVisible
                    });
                }
            });

            // Calculate summary
            const summary: TestSummary = {
                totalTests: parsedTests.length,
                passedTests: parsedTests.filter(t => t.isPassed).length,
                failedTests: parsedTests.filter(t => !t.isPassed).length,
                visibleTests: parsedTests.filter(t => t.isVisible).length,
                hiddenTests: parsedTests.filter(t => !t.isVisible).length,
                hasFailures: parsedTests.some(t => !t.isPassed),
                allPassed: parsedTests.every(t => t.isPassed)
            };

            // Add test result status flag for frontend
            if (summary.hasFailures) {
                formattedOutput += `TEST_FAILURES\n`;
            } else {
                formattedOutput += `ALL_PASSED\n`;
            }

            // Add summary
            const summaryIcon = summary.allPassed ? '✅' : '❌';
            const summaryColor = summary.allPassed ? 'success' : 'danger';

            formattedOutput += `## ${summaryIcon} Test Results Summary\n`;
            formattedOutput += `**Status:** ${summaryColor.toUpperCase()}\n`;
            formattedOutput += `**Passed:** ${summary.passedTests}/${summary.totalTests} test cases\n`;
            formattedOutput += `\n`;

            // Show visible test cases
            const visibleTests = parsedTests.filter(t => t.isVisible);
            if (visibleTests.length > 0) {
                formattedOutput += `### 👁️ Visible Test Cases\n\n`;

                visibleTests.forEach((test, index) => {
                    const statusIcon = test.isPassed ? '✅' : '❌';
                    const statusColor = test.isPassed ? '🟢' : '🔴';

                    formattedOutput += `#### ${statusIcon} Test Case ${index + 1}\n`;
                    formattedOutput += `**Input:** \`${test.input}\`\n\n`;
                    formattedOutput += `**Your Output:** \`${test.output}\`\n\n`;
                    formattedOutput += `**Expected:** \`${test.expected}\`\n\n`;
                    formattedOutput += `**Status:** ${statusColor} **${test.status}**\n\n`;
                });
            }

            // Show hidden test case summary
            const hiddenTests = parsedTests.filter(t => !t.isVisible);
            if (hiddenTests.length > 0) {
                formattedOutput += `### 🔒 Hidden Test Cases\n\n`;
                formattedOutput += `**Total Hidden:** ${hiddenTests.length}\n\n`;
                formattedOutput += `**Passed:** ${hiddenTests.filter(t => t.isPassed).length}\n\n`;
                formattedOutput += `**Failed:** ${hiddenTests.filter(t => !t.isPassed).length}\n\n`;

                // Show failed hidden tests (without revealing inputs/outputs)
                const failedHidden = hiddenTests.filter(t => !t.isPassed);
                if (failedHidden.length > 0) {
                    formattedOutput += `❌ **${failedHidden.length} hidden test case(s) failed**\n`;
                    formattedOutput += `*Hidden test case details are not shown*\n\n`;
                }
            }

        } else {
            // Regular output
            formattedOutput += `📤 **Output:**\n\`\`\`\n${stdout}\n\`\`\`\n`;
            formattedOutput += `REGULAR_OUTPUT\n`; // Flag for frontend
        }
    }

    // If no meaningful output
    if (!stdout && !stderr && !compileOutput) {
        formattedOutput += `✅ **Execution completed successfully with no output**\n`;
        formattedOutput += `NO_OUTPUT\n`; // Flag for frontend
    }

    return formattedOutput.trim();
}

async function publishStatus(token: string, status: string, output = "") {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await pub.publish(`submission:${token}`, JSON.stringify({ status, output }));
        console.log(`📡 Published status for token ${token}: ${status}`);
    } catch (error) {
        console.error(`❌ Failed to publish status for token ${token}:`, error);
    }
}

new Worker(
    "codeQueue",
    async (job) => {
        const { token, source_code, language_id: lang_id, stdin = '' } = job.data;
        console.log("👷 Worker received job:", job.id);
        console.log("📦 Job token:", token);
        console.log("source_code:=", source_code);

        console.log("📋 Job data:", {
            hasSourceCode: !!source_code,
            sourceCodeLength: source_code?.length || 0,
            languageId: lang_id,
            hasStdin: !!stdin
        });
        try {
            console.log("🔄 Attempting to execute code via Judge0...");
            const encodedSource = Buffer.from(source_code).toString("base64");
            const encodedInput = Buffer.from(stdin || "").toString("base64");

            // Try Judge0 first, fallback to mock if it fails
            let data;
            let out;

            try {
                const response = await axios.post(
                    `${JUDGE0_URL}/submissions?base64_encoded=true&wait=true`,
                    {
                        source_code: encodedSource,
                        language_id: lang_id,
                        stdin: encodedInput
                    },
                    { timeout: 30000 } // Reduced timeout
                );
                data = response.data;
                // Decode all possible outputs
                const stdout = data.stdout
                    ? Buffer.from(data.stdout, "base64").toString("utf8")
                    : null;
                const stderr = data.stderr
                    ? Buffer.from(data.stderr, "base64").toString("utf8")
                    : null;
                const compileOutput = data.compile_output
                    ? Buffer.from(data.compile_output, "base64").toString("utf8")
                    : null;

                console.log("Judge0 stdout:(((stdout)))*************", stdout);
                console.log("✅ Judge0 execution successful 0000:");
                console.log("stdout: 1111===", stdout);
                console.log("stderr: 2222:", stderr);
                console.log("compile_output 3333:", compileOutput);
                out = {
                    stdout: stdout || "",
                    stderr: stderr || "",
                    compileOutput: compileOutput || "",
                    time: data?.time || "",
                    memory: data?.memory || "",
                };
                console.log("✅ Judge0 execution successful 4444:", out);

            } catch (judge0Error: any) {
                console.log("⚠️ Judge0 unavailable, using mock execution...");
                console.log("Judge0 Error:", judge0Error?.message || judge0Error);

                // Mock execution for development with null checks
                // const codeLength = source_code ? source_code.length : 0;
                // const inputText = stdin || 'No input';
                // const languageName = lang_id === 63 ? 'JavaScript' :
                //     lang_id === 71 ? 'Python' :
                //         lang_id === 62 ? 'Java' :
                //             lang_id === 54 ? 'C++' : 'Unknown';
                // const codeLength = source_code ? source_code.length : 0;
                // const inputText = stdin || 'No input';
                // const languageName = lang_id === 63 ? 'JavaScript' :
                //     lang_id === 71 ? 'Python' :
                //         lang_id === 62 ? 'Java' :
                //             lang_id === 54 ? 'C++' : 'Unknown';

                // data = {
                //     status: { description: "Accepted" },
                //     stdout: `🔧 Mock Execution Result\nLanguage: ${languageName} (ID: ${lang_id})\nInput: ${inputText}\nCode length: ${codeLength} characters\nStatus: Mock execution successful`,
                //     stderr: null,
                //     time: "0.001",
                //     memory: 1024
                // };
                // out = data.stdout;
            }

            // const passdata: CreateSubmissionDTO = {
            //     userId: 12,
            //     problemId: 123,
            //     code: source_code,
            //     language: lang_id,
            // }
            // // submit code of user in db
            // submissionService.createSubmission(passdata)

            publishStatus(token, "Completed", out ? formatExecutionOutput(out) : "Execution completed with no output");
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
