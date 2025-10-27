import React from 'react';

interface OutputPanelProps {
  output: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  return (
    <div className="p-6 overflow-y-auto h-full bg-dark-950">
      {output ? (
        <pre className="font-mono text-sm text-dark-300 whitespace-pre-wrap">{output}</pre>
      ) : (
        <p className="text-dark-500 text-center py-12">
          Run your code to see the output here
        </p>
      )}
    </div>
  );
};
