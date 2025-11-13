import React from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export type EditorTab = 'code' | 'testcases' | 'output';

interface EditorTabsProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
  output?: string; // Add output prop to detect status
}

const tabs: { id: EditorTab; label: string }[] = [
  { id: 'code', label: 'Code' },
  { id: 'testcases', label: 'Testcases' },
  { id: 'output', label: 'Output' },
];

export const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, onTabChange, output = '' }) => {
  // Detect output status
  const getOutputStatus = () => {
    if (!output) return 'neutral';
    if (output.includes('TEST_FAILURES')) return 'danger';
    if (output.includes('ALL_PASSED')) return 'success';
    if (output.includes('COMPILATION_ERROR') || output.includes('RUNTIME_ERROR')) return 'error';
    return 'neutral';
  };

  const outputStatus = getOutputStatus();

  const getOutputIcon = () => {
    switch (outputStatus) {
      case 'danger':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getTabClass = (tabId: EditorTab) => {
    const baseClass = 'py-2 border-b-2 transition-colors text-sm flex items-center gap-2';
    
    if (activeTab === tabId) {
      if (tabId === 'output' && outputStatus === 'danger') {
        return `${baseClass} border-red-500 text-red-300`;
      } else if (tabId === 'output' && outputStatus === 'success') {
        return `${baseClass} border-green-500 text-green-300`;
      } else if (tabId === 'output' && outputStatus === 'error') {
        return `${baseClass} border-red-600 text-red-300`;
      }
      return `${baseClass} border-primary-500 text-dark-50`;
    } else {
      if (tabId === 'output' && outputStatus === 'danger') {
        return `${baseClass} border-transparent text-red-400 hover:text-red-300`;
      } else if (tabId === 'output' && outputStatus === 'success') {
        return `${baseClass} border-transparent text-green-400 hover:text-green-300`;
      } else if (tabId === 'output' && outputStatus === 'error') {
        return `${baseClass} border-transparent text-red-400 hover:text-red-300`;
      }
      return `${baseClass} border-transparent text-dark-400 hover:text-dark-300`;
    }
  };

  return (
    <div className="bg-dark-900 border-b border-dark-800 px-6 flex space-x-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={getTabClass(tab.id)}
        >
          {tab.label}
          {tab.id === 'output' && getOutputIcon()}
        </button>
      ))}
    </div>
  );
};
