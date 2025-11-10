import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { TextArea } from './TextArea';
import { ImageUploader } from './ImageUploader';
import type { Example } from '../../types';

interface DynamicExampleSectionProps {
  examples: Example[];
  onChange: (examples: Example[]) => void;
  errors?: Record<number, { input?: string; output?: string }>;
}

export const DynamicExampleSection: React.FC<DynamicExampleSectionProps> = ({
  examples,
  onChange,
  errors = {},
}) => {
  const addExample = () => {
    onChange([
      ...examples,
      { input: '', output: '', explanation: '', image: '' },
    ]);
  };

  const removeExample = (index: number) => {
    if (examples.length === 1) return; // Keep at least one example
    onChange(examples.filter((_, i) => i !== index));
  };

  const updateExample = (index: number, field: keyof Example, value: string) => {
    const updated = examples.map((example, i) =>
      i === index ? { ...example, [field]: value } : example
    );
    onChange(updated);
  };

  const handleImageUpload = (index: number, url: string) => {
    updateExample(index, 'image', url);
  };

  const handleImageRemove = (index: number) => {
    updateExample(index, 'image', '');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-dark-200">
          Examples <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={addExample}
          className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Example
        </button>
      </div>

      <div className="space-y-6">
        {examples.map((example, index) => (
          <div
            key={index}
            className="p-4 bg-dark-900 border border-dark-700 rounded-lg space-y-4"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-dark-200">
                Example {index + 1}
              </h4>
              {examples.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeExample(index)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  title="Remove example"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <TextArea
              label="Input"
              value={example.input}
              onChange={(e) => updateExample(index, 'input', e.target.value)}
              placeholder='e.g., nums = [2,7,11,15], target = 9'
              required
              rows={2}
              error={errors[index]?.input}
            />

            <TextArea
              label="Output"
              value={example.output}
              onChange={(e) => updateExample(index, 'output', e.target.value)}
              placeholder='e.g., [0,1]'
              required
              rows={2}
              error={errors[index]?.output}
            />

            <TextArea
              label="Explanation (Optional)"
              value={example.explanation || ''}
              onChange={(e) => updateExample(index, 'explanation', e.target.value)}
              placeholder='Explain why this output is correct...'
              rows={2}
            />

            <ImageUploader
              label="Image (Optional)"
              onUploadComplete={(url) => handleImageUpload(index, url)}
              currentImage={example.image}
              onRemove={() => handleImageRemove(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
