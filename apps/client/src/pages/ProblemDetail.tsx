import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Loader2, AlertCircle, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProblemById } from '../api/problems';
import type { Problem } from '../types';
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
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useAuthContext } from '../context/AuthContext';

export const ProblemDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authUser } = useAuthContext();
  const problemId = parseInt(id || '1');
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProblemTab>('description');
  const [editorTab, setEditorTab] = useState<EditorTab>('code');
  const [language, setLanguage] = useState<Language>('javascript');
  const [code, setCode] = useState('');

  // Fetch problem from database
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProblemById(problemId);
        if (response.success && response.data) {
          setProblem(response.data);
          // Set default starter code (empty for now, can be enhanced later)
          setCode('// Write your solution here');
        } else {
          setError(response.error || 'Problem not found');
          toast.error(response.error || 'Failed to load problem');
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to load problem');
        toast.error('Failed to load problem');
      } finally {
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  const { output, isRunning, runCode, submitCode } = useCodeExecution();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    // TODO: Load language-specific starter code from database
    setCode('// Write your solution here');
  };

  const handleRunCode = () => {
    setEditorTab('output');
    runCode(code);
  };

  const handleSubmit = () => {
    setEditorTab('output');
    submitCode(code);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-primary-500 mx-auto mb-4" size={48} />
            <p className="text-dark-400">Loading problem...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !problem) {
    return (
      <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-dark-50 mb-2">Problem Not Found</h2>
            <p className="text-dark-400 mb-6">{error || 'The problem you are looking for does not exist.'}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Problem Description */}
        <div className="lg:w-1/2 flex flex-col border-r border-dark-800 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-dark-800">
            <ProblemHeader />
            {authUser?.role === 'admin' && (
              <button
                onClick={() => navigate(`/problems/${id}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit Problem
              </button>
            )}
          </div>
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
