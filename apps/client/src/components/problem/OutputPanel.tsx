import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AlertTriangle, CheckCircle, XCircle, Eye, Lock } from 'lucide-react';

interface OutputPanelProps {
  output: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({ output }) => {
  // Detect the status from the output
  const getOutputStatus = (output: string) => {
    if (output.includes('TEST_FAILURES')) return 'danger';
    if (output.includes('ALL_PASSED')) return 'success';
    if (output.includes('COMPILATION_ERROR')) return 'error';
    if (output.includes('RUNTIME_ERROR')) return 'error';
    return 'neutral';
  };

  const status = getOutputStatus(output);

  // Remove status flags from display output
  const cleanOutput = output
    .replace(/^(TEST_FAILURES|ALL_PASSED|COMPILATION_ERROR|RUNTIME_ERROR|REGULAR_OUTPUT|NO_OUTPUT)\n/gm, '');

  // Get container styling based on status
  const getContainerClass = () => {
    const baseClass = "p-6 overflow-y-auto h-full";
    switch (status) {
      case 'danger':
        return `${baseClass} bg-red-950/20 border-l-4 border-red-500`;
      case 'success':
        return `${baseClass} bg-green-950/20 border-l-4 border-green-500`;
      case 'error':
        return `${baseClass} bg-red-950/30 border-l-4 border-red-600`;
      default:
        return `${baseClass} bg-dark-950`;
    }
  };

  // Get status indicator
  const getStatusIndicator = () => {
    switch (status) {
      case 'danger':
        return (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-900/30 border border-red-700/50 rounded-lg">
            <XCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium">Test Cases Failed</span>
          </div>
        );
      case 'success':
        return (
          <div className="flex items-center gap-2 mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-300 font-medium">All Tests Passed</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-2 mb-4 p-3 bg-red-900/40 border border-red-600/50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-red-300 font-medium">Compilation/Runtime Error</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={getContainerClass()}>
      {output ? (
        <>
          {getStatusIndicator()}
          <div className="text-sm text-dark-300 markdown-output">
            <ReactMarkdown
              components={{
                // Custom styling for markdown elements
                h1: ({ children }) => <h1 className="text-xl font-bold text-white mb-4">{children}</h1>,
                h2: ({ children }) => {
                  const text = children?.toString() || '';
                  if (text.includes('Test Results Summary')) {
                    const isDanger = status === 'danger';
                    return (
                      <h2 className={`text-lg font-semibold mb-3 ${isDanger ? 'text-red-300' : 'text-green-300'}`}>
                        {children}
                      </h2>
                    );
                  }
                  return <h2 className="text-lg font-semibold text-white mb-3">{children}</h2>;
                },
                h3: ({ children }) => {
                  const text = children?.toString() || '';
                  if (text.includes('👁️ Visible Test Cases')) {
                    return (
                      <h3 className="text-md font-medium text-blue-300 mb-2 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        {children}
                      </h3>
                    );
                  }
                  if (text.includes('🔒 Hidden Test Cases')) {
                    return (
                      <>
                        <hr />
                        <h3 className="text-md font-medium text-yellow-300 mb-2 flex items-center gap-2 mt-4">
                          <Lock className="w-4 h-4" />
                          {children}
                        </h3>
                      </>
                    );
                  }
                  return <h3 className="text-md font-medium text-white mb-2">{children}</h3>;
                },
                h4: ({ children }) => {
                  const text = children?.toString() || '';
                  const isFailed = text.includes('❌');
                  return (
                    <h4 className={`text-sm font-medium mb-2 p-2 rounded ${isFailed
                      ? 'bg-red-900/20 border border-red-700/30 text-red-300'
                      : 'bg-green-900/20 border border-green-700/30 text-green-300'
                      }`}>
                      {children}
                    </h4>
                  );
                },
                p: ({ children }) => {
                  const text = children?.toString() || '';
                  if (text.includes('DANGER')) {
                    return <p className="text-red-300 mb-2 leading-relaxed font-medium">{children}</p>;
                  }
                  if (text.includes('SUCCESS')) {
                    return <p className="text-green-300 mb-2 leading-relaxed font-medium">{children}</p>;
                  }
                  return <p className="text-dark-300 mb-2 leading-relaxed">{children}</p>;
                },
                strong: ({ children }) => {
                  const text = children?.toString() || '';
                  if (text.includes('Failed') || text.includes('DANGER')) {
                    return <strong className="text-red-300 font-semibold">{children}</strong>;
                  }
                  if (text.includes('Passed') || text.includes('SUCCESS')) {
                    return <strong className="text-green-300 font-semibold">{children}</strong>;
                  }
                  return <strong className="text-white font-semibold">{children}</strong>;
                },
                code: ({ children, ...props }) => {
                  const isInline = !props.className;
                  return isInline ? (
                    <code className="bg-dark-800 text-green-400 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                  ) : (
                    <code className="block bg-dark-800 text-green-400 p-3 rounded font-mono text-xs whitespace-pre-wrap overflow-x-auto">{children}</code>
                  );
                },
                pre: ({ children }) => <pre className="bg-dark-800 p-3 rounded mb-3 overflow-x-auto">{children}</pre>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-3 text-dark-300">{children}</ul>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                // Custom styling for test results
                blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 mb-3 text-dark-300">{children}</blockquote>,
              }}
            >
              {cleanOutput}
            </ReactMarkdown>
          </div>
        </>
      ) : (
        <p className="text-dark-500 text-center py-12">
          Run your code to see the output here
        </p>
      )}
    </div>
  );
};
