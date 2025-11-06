import { useEffect, useState } from 'react';
import socket from "../utils/socket";
import axios from 'axios';

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [token, setToken] = useState("");
  const [code, setCode] = useState(`print("Hello, World!")`);

  console.log("token--------", token);
  console.log("code--------", code);

  useEffect(() => {
    socket.on("submission-update", (data) => {
      console.log("Code solutions in client server data.output*************- ", data.output);

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
    console.log("code========+++++++++++++++++++++++", code);


    try {
      const { data } = await axios.post("http://localhost:3000/api/submit", {
        source_code: code,
        language_id: 71,
        stdin: "",
      }, {
        withCredentials: false, // ✅ CORS safe since credentials aren't used
      });

      console.log("data=================================", data);

      socket.emit("subscribe", data.token);
      setToken(data.token);
    } catch (err) {
      console.error(err);
      setCode("Error submitting job");
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
