import React from 'react';
import { Play, Send } from 'lucide-react';
import { Button } from '../ui';
import { LanguageSelector, type Language } from './LanguageSelector';

interface EditorHeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onRunCode: () => void;
  onSubmit: () => void;
  isRunning: boolean;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  language,
  onLanguageChange,
  onRunCode,
  onSubmit,
  isRunning,
}) => {
  return (
    <div className="bg-dark-900 border-b border-dark-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        <Button variant="secondary" size="sm" onClick={onRunCode} disabled={isRunning}>
          <Play size={16} className="mr-2" />
          Run Code
        </Button>
        <Button variant="primary" size="sm" onClick={onSubmit} disabled={isRunning}>
          <Send size={16} className="mr-2" />
          Submit
        </Button>
      </div>
    </div>
  );
};
