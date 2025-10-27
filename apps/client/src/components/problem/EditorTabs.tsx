import React from 'react';

export type EditorTab = 'code' | 'testcases' | 'output';

interface EditorTabsProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
}

const tabs: { id: EditorTab; label: string }[] = [
  { id: 'code', label: 'Code' },
  { id: 'testcases', label: 'Testcases' },
  { id: 'output', label: 'Output' },
];

export const EditorTabs: React.FC<EditorTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-dark-900 border-b border-dark-800 px-6 flex space-x-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-2 border-b-2 transition-colors text-sm ${
            activeTab === tab.id
              ? 'border-primary-500 text-dark-50'
              : 'border-transparent text-dark-400 hover:text-dark-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};
