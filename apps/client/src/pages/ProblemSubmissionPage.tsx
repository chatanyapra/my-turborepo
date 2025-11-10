import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { submitProblem } from '../api/problems';
import { useAuthContext } from '../context/AuthContext';
import type {
  ProblemFormData, Example,
  // TestCase 
} from '../types';

interface FormErrors {
  title?: string;
  description?: string;
  constraints?: string;
  tags?: string;
  examples?: Record<number, { input?: string; output?: string }>;
  testCases?: Record<number, { input?: string; expected_output?: string }>;
}

export const ProblemSubmissionPage: React.FC = () => {
  const navigate = useNavigate();
  const { authUser } = useAuthContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [createdProblemId, setCreatedProblemId] = useState<number | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!authUser) {
      toast.error('You must be logged in to submit problems');
      navigate('/login');
      return;
    }

    if (authUser.role !== 'admin') {
      toast.error('Only admins can submit problems');
      navigate('/dashboard');
      return;
    }
  }, [authUser, navigate]);

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
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.constraints.trim()) {
      newErrors.constraints = 'Constraints are required';
    }

    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    // Validate examples
    const exampleErrors: Record<number, { input?: string; output?: string }> = {};
    formData.examples.forEach((example, index) => {
      if (!example.input.trim()) {
        exampleErrors[index] = { ...exampleErrors[index], input: 'Input is required' };
      }
      if (!example.output.trim()) {
        exampleErrors[index] = { ...exampleErrors[index], output: 'Output is required' };
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
      }
      if (!testCase.expected_output.trim()) {
        testCaseErrors[index] = {
          ...testCaseErrors[index],
          expected_output: 'Expected output is required',
        };
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
      toast.error('You must be logged in to submit a problem');
      navigate('/login');
      return;
    }

    if (authUser.role !== 'admin') {
      toast.error('Only admins can submit problems');
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

      const response = await submitProblem(submissionData, authUser.token);

      if (response.success) {
        toast.success(response.message);
        
        // Set the created problem ID to enable code template management
        if (response.problemId) {
          setCreatedProblemId(response.problemId);
          toast.info('Problem created! You can now add code templates below.');
        }
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error('An unexpected error occurred. Please try again.');
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-dark-50 mb-2">
              Submit a New Problem
            </h1>
            <p className="text-dark-400">
              Create a new coding challenge for the community
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
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || createdProblemId !== null}
                className="min-w-[150px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {createdProblemId ? 'Problem Created' : 'Submit Problem'}
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Language Code Templates Section */}
          {authUser?.token && (
            <LanguageCodeSection
              problemId={createdProblemId}
              token={authUser.token}
            />
          )}

          {/* Navigation after code templates */}
          {createdProblemId && (
            <div className="flex items-center justify-end gap-4 mt-6">
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate(`/problems/${createdProblemId}`)}
              >
                View Problem
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
