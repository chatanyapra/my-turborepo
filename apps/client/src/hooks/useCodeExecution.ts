import { useState } from 'react';

export const useCodeExecution = () => {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const runCode = () => {
    setIsRunning(true);
    setOutput('Running test cases...\n');

    // Simulate code execution - Replace with actual API call
    setTimeout(() => {
      setOutput(`Running test cases...
      
✓ Test Case 1: Passed
  Input: nums = [2,7,11,15], target = 9
  Expected: [0,1]
  Output: [0,1]
  Runtime: 2ms

✓ Test Case 2: Passed
  Input: nums = [3,2,4], target = 6
  Expected: [1,2]
  Output: [1,2]
  Runtime: 1ms

All test cases passed! (2/2)`);
      setIsRunning(false);
    }, 1500);
  };

  const submitCode = () => {
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
