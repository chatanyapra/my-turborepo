import React from 'react';
import Editor from '@monaco-editor/react';
import { languageMap, type Language } from './LanguageSelector';

interface CodeEditorPanelProps {
  language: Language;
  code: string;
  onChange: (value: string) => void;
}

export const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({
  language,
  code,
  onChange,
}) => {
  return (
    <Editor
      height="100%"
      language={languageMap[language].monacoLang}
      value={code}
      onChange={(value) => onChange(value || '')}
      theme="vs-dark"
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        wordWrap: 'on',
        // Enable copy/paste functionality
        contextmenu: true,
        selectOnLineNumbers: true,
        roundedSelection: true,
        cursorStyle: 'line',
        copyWithSyntaxHighlighting: true,
        // Additional options to ensure copy/paste works
        quickSuggestions: false,
        suggest: { showWords: false },
        acceptSuggestionOnCommitCharacter: false,
        acceptSuggestionOnEnter: 'off',
        accessibilitySupport: 'off',
        // Explicitly enable selection and clipboard
        selectionHighlight: true,
        occurrencesHighlight: 'off',
        renderLineHighlight: 'all',
      }}
    />
  );
};
