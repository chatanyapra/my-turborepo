import { useEffect, useState } from 'react';
import { socket } from "../utils/socket";
import axios from 'axios';

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [token, setToken] = useState("");
  const [code, setCode] = useState(`print("Hello, World!")`);

  useEffect(() => {
    socket.on("submission-update", (data) => {
      setOutput(data.output);
    });
    return () => {
      socket.off("submission-update");
    };
  }, [])

  const runCode = async (code: string) => {
    setIsRunning(true);
    setOutput('Running test cases...\n');
    setCode(code);

    try {
      const { data } = await axios.post("http://localhost:3000/submit", {
        source_code: code,
        language_id: 71,
        stdin: "",
      });

      setToken(data.token);
      socket.emit("subscribe", data.token);
    } catch (err) {
      console.error(err);
      setCode("Error submitting job");
    }
  };

  const submitCode = (code: string) => {
    setIsRunning(true);
    setOutput('Submitting your solution...\n');

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
