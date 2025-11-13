import { useEffect, useState } from 'react';
import socket from "../utils/socket";
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

interface SubmissionUpdate {
  output: string;
  status?: string;
  error?: string;
  [key: string]: any;
}

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [token, setToken] = useState("");
  const { authUser } = useAuthContext();
  console.log("token client", token);


  useEffect(() => {
    const handleUpdate = (data: SubmissionUpdate) => {
      console.log("📩 Received submission update:", data);

      if (data.error) {
        setOutput(`❌ Error: ${data.error}`);
      } else if (data.status === 'failed') {
        setOutput('❌ Execution failed. Please try again.');
      } else {
        setOutput(data.output || '✅ Code executed successfully!');
      }

      // ✅ Stop spinner
      setIsRunning(false);
    };

    socket.on("submission-update", handleUpdate);

    return () => {
      socket.off("submission-update", handleUpdate);
    };
  }, []);

  // Run code by user function---------------------------------------
  const runCode = async (
    code: string,
    language: string = 'javascript',
    problemId?: number,
    testCases: any[] = []
  ) => {
    setIsRunning(true);
    setOutput('Running test cases...\n');

    try {
      console.log("authUser?.token", authUser?.token);
      console.log("COde---------", code);

      console.log("Running code with:", { language, problemId, testCasesCount: testCases.length });

      // Map language to Judge0 language ID
      const languageMap: Record<string, number> = {
        javascript: 63,  // Node.js
        python: 71,      // Python 3
        java: 62,        // Java
        cpp: 54,         // C++
      };

      const language_id = languageMap[language] || 63;

      // Use first test case for running (or empty if none)
      const firstTestCase = testCases.length > 0 ? testCases[0] : { input: '', expected_output: '' };

      const { data } = await axios.post("http://localhost:3000/api/submit", {
        source_code: code,
        language_id,
        stdin: firstTestCase.input || '',
        expected_output: firstTestCase.expected_output || '',
        problem_id: problemId
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser?.token}`,
        },
      }
      );
      console.log("🚀 Job submitted:", data);
      setToken(data.token);
      socket.emit("subscribe", data.token, (ack: any) => {
        console.log("🔗 Joined room:", ack);
      });

      // Safety timeout: If result not received within 15s, auto-stop spinner
      setTimeout(() => {
        setIsRunning(false);
      }, 15000);

    } catch (err: any) {
      console.error("❌ Error submitting code:", err);
      setOutput("Error submitting job. Please check your connection.");
      setIsRunning(false);
    }
  };

  const submitCode = async (
    code: string,
    language: string = 'javascript',
    problemId?: number,
    testCases: any[] = []
  ) => {
    setIsRunning(true);
    setOutput('Submitting your solution...\n');
    console.log("code in submit button function", code);
    console.log("Submitting with:", { language, problemId, testCasesCount: testCases.length });

    try {
      // Map language to Judge0 language ID
      const languageMap: Record<string, number> = {
        javascript: 63,  // Node.js
        python: 71,      // Python 3
        java: 62,        // Java
        cpp: 54,         // C++ (GCC 9.2.0)
      };

      const language_id = languageMap[language] || 63;

      // Submit with all test cases
      const { data } = await axios.post("http://localhost:3000/api/submit", {
        source_code: code,
        language_id,
        stdin: testCases.map(tc => tc.input).join('\n'),
        expected_output: testCases.map(tc => tc.expected_output).join('\n'),
        problem_id: problemId,
        is_submission: true  // Flag to indicate this is a full submission
      }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authUser?.token}`,
        },
      });

      console.log("🚀 Submission job submitted:", data);
      setToken(data.token);
      socket.emit("subscribe", data.token, (ack: any) => {
        console.log("🔗 Joined submission room:", ack);
      });

      // Safety timeout
      setTimeout(() => {
        setIsRunning(false);
      }, 30000); // Longer timeout for submissions

    } catch (err: any) {
      console.error("❌ Error submitting solution:", err);
      setOutput("Error submitting solution. Please check your connection.");
      setIsRunning(false);
    }
  };

  return {
    output,
    isRunning,
    runCode,
    submitCode,
    setOutput,
  };
};
