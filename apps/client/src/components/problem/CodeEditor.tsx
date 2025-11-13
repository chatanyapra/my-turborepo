import React, { useRef } from 'react';
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
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  return (
    <div className="border border-dark-700 rounded-lg overflow-hidden">
      <Editor
        height={height}
        language={languageMap[language] || 'javascript'}
        value={value}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
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
          // Simple clipboard configuration that works across browsers
          contextmenu: true,
          selectOnLineNumbers: true,
          cursorStyle: 'line',
          // Disable features that might interfere with clipboard
          quickSuggestions: false,
          suggest: { showWords: false },
          acceptSuggestionOnCommitCharacter: false,
          acceptSuggestionOnEnter: 'off',
        }}
      />
    </div>
  );
};
