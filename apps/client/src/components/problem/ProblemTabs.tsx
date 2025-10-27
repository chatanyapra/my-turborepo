import React from 'react';

export type ProblemTab = 'description' | 'submissions';

interface ProblemTabsProps {
  activeTab: ProblemTab;
  onTabChange: (tab: ProblemTab) => void;
}

const tabs: { id: ProblemTab; label: string }[] = [
  { id: 'description', label: 'Description' },
  { id: 'submissions', label: 'Submissions' },
];

export const ProblemTabs: React.FC<ProblemTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-dark-900 border-b border-dark-800 px-6 flex space-x-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`py-3 border-b-2 transition-colors ${
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
