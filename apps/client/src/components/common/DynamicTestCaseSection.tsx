import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextArea } from './TextArea';
import type { TestCase } from '../../types';

interface DynamicTestCaseSectionProps {
  testCases: TestCase[];
  onChange: (testCases: TestCase[]) => void;
  errors?: Record<number, { input?: string; expected_output?: string }>;
}

export const DynamicTestCaseSection: React.FC<DynamicTestCaseSectionProps> = ({
  testCases,
  onChange,
  errors = {},
}) => {
  const addTestCase = () => {
    onChange([...testCases, { input: '', expected_output: '' }]);
  };

  const removeTestCase = (index: number) => {
    if (testCases.length === 1) return; // Keep at least one test case
    onChange(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (
    index: number,
    field: keyof TestCase,
    value: string
  ) => {
    const updated = testCases.map((testCase, i) =>
      i === index ? { ...testCase, [field]: value } : testCase
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-dark-200">
          Test Cases <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addTestCase}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Test Case
        </button>
      </div>

      <div className="space-y-4">
        {testCases.map((testCase, index) => (
          <div
            key={index}
            className="p-4 bg-dark-900 border border-dark-700 rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-dark-200">
                Test Case {index + 1}
              </h4>
              {testCases.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTestCase(index)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  title="Remove test case"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <TextArea
                label="Input"
                value={testCase.input}
                onChange={(e) =>
                  updateTestCase(index, 'input', e.target.value)
                }
                placeholder='e.g., 2 3'
                required
                rows={2}
                error={errors[index]?.input}
              />

              <TextArea
                label="Expected Output"
                value={testCase.expected_output}
                onChange={(e) =>
                  updateTestCase(index, 'expected_output', e.target.value)
                }
                placeholder='e.g., 5'
                required
                rows={2}
                error={errors[index]?.expected_output}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
