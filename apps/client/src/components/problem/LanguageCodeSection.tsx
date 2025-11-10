import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Save, Code2 } from 'lucide-react';
import { LanguageSelector, type Language } from './LanguageSelector';
import { CodeEditor } from './CodeEditor';
import { Button } from '../ui';
import { getProblemCodeByLanguage, upsertProblemCode, type ProblemCodeData } from '../../api/problemCodes';

interface LanguageCodeSectionProps {
  problemId: number | null;
  token: string;
}

interface CodeState {
  wrapperCode: string;
  boilerplateCode: string;
}

const defaultCodes: Record<Language, CodeState> = {
  java: {
    boilerplateCode: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`,
    wrapperCode: `import java.util.*;

class Main {
    public static void main(String[] args) {
        Solution sol = new Solution();
        // Test case execution logic here
    }
}`,
  },
  python: {
    boilerplateCode: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your code here
        pass`,
    wrapperCode: `from typing import List

# Test case execution logic here
if __name__ == "__main__":
    sol = Solution()
    # Add test execution`,
  },
  cpp: {
    boilerplateCode: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
    wrapperCode: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    Solution sol;
    // Test case execution logic here
    return 0;
}`,
  },
  javascript: {
    boilerplateCode: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your code here
};`,
    wrapperCode: `// Test case execution logic here
const result = twoSum([2,7,11,15], 9);
console.log(result);`,
  },
};

export const LanguageCodeSection: React.FC<LanguageCodeSectionProps> = ({
  problemId,
  token,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('java');
  const [wrapperCode, setWrapperCode] = useState('');
  const [boilerplateCode, setBoilerplateCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load code when language changes
  useEffect(() => {
    const loadCode = async () => {
      if (!problemId) {
        // New problem - use defaults
        setWrapperCode(defaultCodes[selectedLanguage].wrapperCode);
        setBoilerplateCode(defaultCodes[selectedLanguage].boilerplateCode);
        return;
      }

      setIsLoading(true);
      try {
        const response = await getProblemCodeByLanguage(problemId, selectedLanguage);
        
        if (response.success && response.data) {
          setWrapperCode(response.data.wrapperCode);
          setBoilerplateCode(response.data.boilerplateCode);
        } else {
          // No code exists for this language - use defaults
          setWrapperCode(defaultCodes[selectedLanguage].wrapperCode);
          setBoilerplateCode(defaultCodes[selectedLanguage].boilerplateCode);
        }
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error('Error loading code:', error);
        // Use defaults on error
        setWrapperCode(defaultCodes[selectedLanguage].wrapperCode);
        setBoilerplateCode(defaultCodes[selectedLanguage].boilerplateCode);
      } finally {
        setIsLoading(false);
      }
    };

    loadCode();
  }, [selectedLanguage, problemId]);

  const handleSave = async () => {
    if (!problemId) {
      toast.error('Please save the problem first before adding code templates');
      return;
    }

    if (!wrapperCode.trim() || !boilerplateCode.trim()) {
      toast.error('Both wrapper and boilerplate code are required');
      return;
    }

    setIsSaving(true);
    try {
      const data: ProblemCodeData = {
        problemId,
        language: selectedLanguage,
        wrapperCode,
        boilerplateCode,
      };

      const response = await upsertProblemCode(data, token);

      if (response.success) {
        toast.success(`${selectedLanguage.toUpperCase()} code saved successfully!`);
        setHasUnsavedChanges(false);
      } else {
        toast.error(response.error || 'Failed to save code');
      }
    } catch (error) {
      console.error('Error saving code:', error);
      toast.error('An error occurred while saving code');
    } finally {
      setIsSaving(false);
    }
  };

  const handleWrapperChange = (value: string) => {
    setWrapperCode(value);
    setHasUnsavedChanges(true);
  };

  const handleBoilerplateChange = (value: string) => {
    setBoilerplateCode(value);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="bg-dark-900 border border-dark-800 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Code2 className="w-6 h-6 text-primary-500" />
          <div>
            <h2 className="text-xl font-semibold text-dark-100">
              Language Wrappers & Boilerplate Code
            </h2>
            <p className="text-sm text-dark-400 mt-1">
              Define starter code and test wrappers for each language
            </p>
          </div>
        </div>
        <LanguageSelector
          language={selectedLanguage}
          onLanguageChange={setSelectedLanguage}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : (
        <>
          {/* Boilerplate Code Editor */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Boilerplate Code
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-dark-400 mb-3">
                The starter code that users will see and edit
              </p>
            </div>
            <CodeEditor
              value={boilerplateCode}
              onChange={handleBoilerplateChange}
              language={selectedLanguage}
              height="250px"
              placeholder="Enter boilerplate code..."
            />
          </div>

          {/* Wrapper Code Editor */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-dark-200 mb-2">
                Wrapper Code
                <span className="text-red-500 ml-1">*</span>
              </label>
              <p className="text-xs text-dark-400 mb-3">
                Test execution wrapper (combined with user code before running)
              </p>
            </div>
            <CodeEditor
              value={wrapperCode}
              onChange={handleWrapperChange}
              language={selectedLanguage}
              height="250px"
              placeholder="Enter wrapper code..."
            />
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4 border-t border-dark-800">
            <div className="text-sm text-dark-400">
              {hasUnsavedChanges && (
                <span className="text-yellow-500">● Unsaved changes</span>
              )}
            </div>
            <Button
              type="button"
              variant="primary"
              onClick={handleSave}
              disabled={isSaving || !problemId}
              className="min-w-[120px]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Code
                </>
              )}
            </Button>
          </div>

          {!problemId && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
              <p className="text-sm text-yellow-500">
                ⚠️ Save the problem first to enable code template management
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
