import React from 'react';
import type { ProblemDetail } from '../../data/mockProblemDetails';

interface TestCasesPanelProps {
  examples: ProblemDetail['examples'];
}

export const TestCasesPanel: React.FC<TestCasesPanelProps> = ({ examples }) => {
  return (
    <div className="p-6 overflow-y-auto h-full bg-dark-950">
      <div className="space-y-4">
        {examples.map((example, idx) => (
          <div key={idx} className="bg-dark-900 border border-dark-800 rounded-lg p-4">
            <p className="text-dark-50 font-semibold mb-3">Test Case {idx + 1}</p>
            <div className="space-y-2 font-mono text-sm">
              <div className="bg-dark-950 p-3 rounded border border-dark-800">
                <span className="text-dark-400">Input: </span>
                <span className="text-dark-200">{example.input}</span>
              </div>
              <div className="bg-dark-950 p-3 rounded border border-dark-800">
                <span className="text-dark-400">Expected Output: </span>
                <span className="text-dark-200">{example.output}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
