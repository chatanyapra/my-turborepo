import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Loader2, Send, ArrowLeft } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import {
  FormInput,
  SelectInput,
  RichTextEditor,
  DynamicExampleSection,
  DynamicTestCaseSection,
} from '../components/common';
import { Button } from '../components/ui';
import { LanguageCodeSection } from '../components/problem';
import { getProblemById, updateProblem } from '../api/problems';
import { useAuthContext } from '../context/AuthContext';
import type {
  ProblemFormData, Example,
} from '../types';

interface FormErrors {
  title?: string;
  description?: string;
  constraints?: string;
  tags?: string;
  examples?: Record<number, { input?: string; output?: string }>;
  testCases?: Record<number, { input?: string; expected_output?: string }>;
}

export const ProblemEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { authUser } = useAuthContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ProblemFormData>({
    title: '',
    description: '',
    difficulty: 'Easy',
    constraints: '',
    examples: [{ input: '', output: '', explanation: '', image: '' }],
    test_cases: [{ input: '', expected_output: '' }],
    tags: [],
    time_limit: 1,
    memory_limit: 128,
  });

  const [tagsInput, setTagsInput] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!authUser) {
      toast.error('You must be logged in to edit problems');
      navigate('/login');
      return;
    }

    if (authUser.role !== 'admin') {
      toast.error('Only admins can edit problems');
      navigate('/dashboard');
      return;
    }
  }, [authUser, navigate]);

  // Fetch problem data
  useEffect(() => {
    const fetchProblem = async () => {
      if (!id) {
        toast.error('Invalid problem ID');
        navigate('/dashboard');
        return;
      }

      setIsLoading(true);
      try {
        const response = await getProblemById(parseInt(id));
        if (response.success && response.data) {
          const problem = response.data;
          
          // Transform backend format to form format
          const testCases = problem.testCases?.map((tc: any) => ({
            input: tc.input || '',
            expected_output: tc.expected_output || tc.expectedOutput || '',
          })) || [{ input: '', expected_output: '' }];

          setFormData({
            title: problem.title,
            description: problem.description,
            difficulty: problem.difficulty,
            constraints: problem.constraints,
            examples: problem.examples.length > 0 ? problem.examples : [{ input: '', output: '', explanation: '', image: '' }],
            test_cases: testCases,
            tags: problem.tags,
            time_limit: problem.timeLimit,
            memory_limit: problem.memoryLimit,
          });

          setTagsInput(problem.tags.join(', '));
        } else {
          toast.error(response.error || 'Failed to load problem');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        toast.error('Failed to load problem');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [id, navigate]);

  const handleInputChange = (
    field: keyof ProblemFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleTagsChange = (value: string) => {
    setTagsInput(value);
    const tagsArray = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
      toast.warning('⚠️ Title is required');
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
      toast.warning('⚠️ Description is required');
    }

    if (!formData.constraints.trim()) {
      newErrors.constraints = 'Constraints are required';
      toast.warning('⚠️ Constraints are required');
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
      toast.warning('⚠️ At least one tag is required');
    }

    // Validate examples
    const exampleErrors: Record<number, { input?: string; output?: string }> = {};
    formData.examples.forEach((example, index) => {
      if (!example.input.trim()) {
        exampleErrors[index] = { ...exampleErrors[index], input: 'Input is required' };
        toast.warning(`⚠️ Example ${index + 1}: Input is required`);
      }
      if (!example.output.trim()) {
        exampleErrors[index] = { ...exampleErrors[index], output: 'Output is required' };
        toast.warning(`⚠️ Example ${index + 1}: Output is required`);
      }
    });
    if (Object.keys(exampleErrors).length > 0) {
      newErrors.examples = exampleErrors;
    }

    // Validate test cases
    const testCaseErrors: Record<number, { input?: string; expected_output?: string }> = {};
    formData.test_cases.forEach((testCase, index) => {
      if (!testCase.input.trim()) {
        testCaseErrors[index] = { ...testCaseErrors[index], input: 'Input is required' };
        toast.warning(`⚠️ Test Case ${index + 1}: Input is required`);
      }
      if (!testCase.expected_output.trim()) {
        testCaseErrors[index] = {
          ...testCaseErrors[index],
          expected_output: 'Expected output is required',
        };
        toast.warning(`⚠️ Test Case ${index + 1}: Expected output is required`);
      }
    });
    if (Object.keys(testCaseErrors).length > 0) {
      newErrors.testCases = testCaseErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser?.token) {
      toast.error('You must be logged in to update a problem');
      navigate('/login');
      return;
    }

    if (authUser.role !== 'admin') {
      toast.error('Only admins can update problems');
      return;
    }

    if (!validateForm()) {
      toast.error('Please fix all validation errors');
      return;
    }

    setIsSubmitting(true);

    try {
      // Clean up examples - remove empty image fields
      const cleanedExamples = formData.examples.map((example) => {
        const cleaned: Example = {
          input: example.input,
          output: example.output,
        };
        if (example.explanation) cleaned.explanation = example.explanation;
        if (example.image) cleaned.image = example.image;
        return cleaned;
      });

      const submissionData: ProblemFormData = {
        ...formData,
        examples: cleanedExamples,
      };

      const response = await updateProblem(parseInt(id!), submissionData, authUser.token);

      if (response.success) {
        toast.success(response.message);
        // Navigate back to the problem detail page
        setTimeout(() => {
          navigate(`/problems/${id}`);
        }, 1500);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Update error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/problems/${id}`)}
              className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Problem
            </button>
            <h1 className="text-3xl font-bold text-dark-50 mb-2">
              Edit Problem
            </h1>
            <p className="text-dark-400">
              Update the problem details below
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 space-y-6">
              <h2 className="text-xl font-semibold text-dark-100 mb-4">
                Basic Information
              </h2>

              <FormInput
                label="Problem Title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Add Two Numbers"
                required
                error={errors.title}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  label="Difficulty"
                  value={formData.difficulty}
                  onChange={(e) =>
                    handleInputChange('difficulty', e.target.value as any)
                  }
                  options={[
                    { value: 'Easy', label: 'Easy' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Hard', label: 'Hard' },
                  ]}
                  required
                />

                <FormInput
                  label="Tags (comma-separated)"
                  value={tagsInput}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  placeholder="e.g., Array, Hash Table, Math"
                  required
                  error={errors.tags}
                />
              </div>

              <RichTextEditor
                label="Problem Description"
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                required
                error={errors.description}
                placeholder="Describe the problem in detail..."
              />

              <RichTextEditor
                label="Constraints"
                value={formData.constraints}
                onChange={(value) => handleInputChange('constraints', value)}
                placeholder="e.g., 2 <= nums.length <= 10⁴"
                required
                error={errors.constraints}
              />
            </div>

            {/* Examples */}
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-dark-100 mb-4">
                Examples
              </h2>
              <DynamicExampleSection
                examples={formData.examples}
                onChange={(examples) =>
                  setFormData((prev) => ({ ...prev, examples }))
                }
                errors={errors.examples}
              />
            </div>

            {/* Test Cases */}
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-dark-100 mb-4">
                Test Cases
              </h2>
              <DynamicTestCaseSection
                testCases={formData.test_cases}
                onChange={(testCases) =>
                  setFormData((prev) => ({ ...prev, test_cases: testCases }))
                }
                errors={errors.testCases}
              />
            </div>

            {/* Limits */}
            <div className="bg-dark-900 border border-dark-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-dark-100 mb-4">
                Execution Limits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                  label="Time Limit (seconds)"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.time_limit}
                  onChange={(e) =>
                    handleInputChange('time_limit', parseInt(e.target.value))
                  }
                  required
                />

                <FormInput
                  label="Memory Limit (MB)"
                  type="number"
                  min="64"
                  max="512"
                  value={formData.memory_limit}
                  onChange={(e) =>
                    handleInputChange('memory_limit', parseInt(e.target.value))
                  }
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(`/problems/${id}`)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Update Problem
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Language Code Templates Section */}
          {authUser?.token && id && (
            <LanguageCodeSection
              problemId={parseInt(id)}
              token={authUser.token}
            />
          )}
        </div>
      </div>
    </div>
  );
};
