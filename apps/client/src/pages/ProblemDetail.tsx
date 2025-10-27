import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import {
  ProblemDescription,
  ProblemHeader,
  ProblemTabs,
  EditorHeader,
  EditorTabs,
  CodeEditorPanel,
  TestCasesPanel,
  OutputPanel,
  type Language,
  type EditorTab,
  type ProblemTab,
} from '../components/problem';
import { mockProblemDetails } from '../data/mockProblemDetails';
import { useCodeExecution } from '../hooks/useCodeExecution';

export const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const problemId = parseInt(id || '1');
  const problem = mockProblemDetails[problemId] || mockProblemDetails[1];

  const [activeTab, setActiveTab] = useState<ProblemTab>('description');
  const [editorTab, setEditorTab] = useState<EditorTab>('code');
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState(problem.starterCode[language]);

  const { output, isRunning, runCode, submitCode } = useCodeExecution();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    setCode(problem.starterCode[newLang]);
  };

  const handleRunCode = () => {
    setEditorTab('output');
    runCode();
  };

  const handleSubmit = () => {
    setEditorTab('output');
    submitCode();
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="lg:w-1/2 flex flex-col border-r border-dark-800 overflow-hidden">
          <ProblemHeader />
          <ProblemTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'description' && <ProblemDescription problem={problem} />}
            {activeTab === 'submissions' && (
              <div className="text-center py-12">
                <p className="text-dark-400">No submissions yet. Submit your solution to see it here!</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Code Editor */}
        <div className="lg:w-1/2 flex flex-col overflow-hidden">
          <EditorHeader
            language={language}
            onLanguageChange={handleLanguageChange}
            onRunCode={handleRunCode}
            onSubmit={handleSubmit}
            isRunning={isRunning}
          />
          
          <EditorTabs activeTab={editorTab} onTabChange={setEditorTab} />

          <div className="flex-1 overflow-hidden">
            {editorTab === 'code' && (
              <CodeEditorPanel language={language} code={code} onChange={setCode} />
            )}
            {editorTab === 'testcases' && <TestCasesPanel examples={problem.examples} />}
            {editorTab === 'output' && <OutputPanel output={output} />}
          </div>
        </div>
      </div>
    </div>
  );
};
