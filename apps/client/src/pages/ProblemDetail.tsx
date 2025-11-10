import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Loader2, AlertCircle, Edit } from 'lucide-react';
import { toast } from 'react-toastify';
import { getProblemById } from '../api/problems';
import { getProblemCodeByLanguage } from '../api/problemCodes';
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
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const [wrapperCode, setWrapperCode] = useState('');
  const [loadingCode, setLoadingCode] = useState(false);

  // Fetch problem from database
  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProblemById(problemId);
        if (response.success && response.data) {
          setProblem(response.data);
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

  // Fetch boilerplate code when language changes
  useEffect(() => {
    const fetchBoilerplateCode = async () => {
      if (!problemId) return;
      
      setLoadingCode(true);
      try {
        const response = await getProblemCodeByLanguage(problemId, language);
        
        if (response.success && response.data) {
          // Set boilerplate code as starter code
          setBoilerplateCode(response.data.boilerplateCode);
          setWrapperCode(response.data.wrapperCode);
          setCode(response.data.boilerplateCode);
          toast.success(`Loaded ${language} starter code`);
        } else {
          // No boilerplate found, use default
          const defaultCode = getDefaultCode(language);
          setBoilerplateCode(defaultCode);
          setWrapperCode('');
          setCode(defaultCode);
          toast.info(`No starter code found for ${language}. Using default template.`);
        }
      } catch (err) {
        console.error('Error fetching boilerplate code:', err);
        const defaultCode = getDefaultCode(language);
        setBoilerplateCode(defaultCode);
        setWrapperCode('');
        setCode(defaultCode);
      } finally {
        setLoadingCode(false);
      }
    };

    fetchBoilerplateCode();
  }, [problemId, language]);

  const { output, isRunning, runCode, submitCode } = useCodeExecution();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    // Code will be loaded by useEffect
  };

  // Default code templates for each language
  const getDefaultCode = (lang: Language): string => {
    const templates: Record<Language, string> = {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var solution = function(nums, target) {
    // Write your code here
    
};`,
      python: `class Solution:
    def solution(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
      java: `class Solution {
    public int[] solution(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
      cpp: `class Solution {
public:
    vector<int> solution(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
    };
    return templates[lang] || '// Write your solution here';
  };

  const handleRunCode = () => {
    setEditorTab('output');
    // Combine user code with wrapper code for execution
    const fullCode = wrapperCode ? `${code}\n\n${wrapperCode}` : code;
    runCode(fullCode, language, problemId, problem?.testCases || []);
  };

  const handleSubmit = () => {
    setEditorTab('output');
    // Combine user code with wrapper code for submission
    const fullCode = wrapperCode ? `${code}\n\n${wrapperCode}` : code;
    submitCode(fullCode, language, problemId, problem?.testCases || []);
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
