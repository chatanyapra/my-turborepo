import React from 'react';
import { Badge } from '../ui';
import type { Problem } from '../../types';

interface ProblemDescriptionProps {
  problem: Problem;
}

export const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ problem }) => {
  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-2xl font-bold text-dark-50">
            {problem.id}. {problem.title}
          </h1>
          <Badge variant={problem.difficulty.toLowerCase() as 'easy' | 'medium' | 'hard'}>{problem.difficulty}</Badge>
        </div>
      </div>

      {/* Description */}
      <div 
        className="text-dark-300 leading-relaxed prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: problem.description }}
      />

      {/* Examples */}
      <div className="space-y-4">
        {problem.examples.map((example, idx) => (
          <div key={idx} className="bg-dark-900 border border-dark-800 rounded-lg p-4">
            <p className="text-dark-50 font-semibold mb-2">Example {idx + 1}:</p>
            <div className="space-y-2 font-mono text-sm">
              <div>
                <span className="text-dark-400">Input: </span>
                <span className="text-dark-200">{example.input}</span>
              </div>
              <div>
                <span className="text-dark-400">Output: </span>
                <span className="text-dark-200">{example.output}</span>
              </div>
              {example.explanation && (
                <div>
                  <span className="text-dark-400">Explanation: </span>
                  <span className="text-dark-300">{example.explanation}</span>
                </div>
              )}
              {example.image && (
                <div className="mt-2">
                  <img 
                    src={example.image} 
                    alt={`Example ${idx + 1}`}
                    className="max-w-full h-auto rounded border border-dark-700"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Constraints */}
      {problem.constraints && (
        <div>
          <h3 className="text-lg font-semibold text-dark-50 mb-3">Constraints:</h3>
          <div 
            className="text-dark-300 prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: problem.constraints }}
          />
        </div>
      )}
    </div>
  );
};
