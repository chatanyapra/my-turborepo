import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
}

const languageMap: Record<string, string> = {
  java: 'java',
  python: 'python',
  cpp: 'cpp',
  javascript: 'javascript',
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  height = '300px',
  placeholder,
  readOnly = false,
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="border border-dark-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={handleEditorChange}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: 'on',
          readOnly,
          placeholder,
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
          // Ensure no restrictions on editing
          domReadOnly: readOnly,
          readOnlyMessage: readOnly ? { value: 'Editor is read-only' } : undefined,
        }}
      />
    </div>
  );
};
