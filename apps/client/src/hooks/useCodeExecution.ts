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

  const runCode = async (code: string) => {
    setIsRunning(true);
    setOutput('Running test cases...\n');

    try {
      console.log("authUser?.token", authUser?.token);

      const { data } = await axios.post("http://localhost:3000/api/submit", {
        source_code: code,
        language_id: 71,
        stdin: "",
        expected_output: ""
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

  const submitCode = (code: string) => {
    setIsRunning(true);
    setOutput('Submitting your solution...\n');
    console.log("code in submit button function", code);


    // Simulate code submission - Replace with actual API call
    setTimeout(() => {

      setOutput(`Submitting your solution...
          ✓ Accepted

          Runtime: 52ms (Beats 95.2% of users)
          Memory: 42.1MB (Beats 87.3% of users)

          All 58 test cases passed!`);
      setIsRunning(false);
    }, 2000);
  };

  return {
    output,
    isRunning,
    runCode,
    submitCode,
    setOutput,
  };
};
