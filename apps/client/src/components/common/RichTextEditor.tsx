import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  label,
  value,
  onChange,
  error,
  required,
  placeholder = 'Enter problem description...',
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-dark-200 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className={error ? 'ring-2 ring-red-500 rounded-lg' : ''}>
        <Editor
          apiKey="1yqaqm9j3s2xqp0wunxxzxj3wlwfn16tlbfq9ihk1trnht4m"
          value={value}
          onEditorChange={(content) => onChange(content)}
          init={{
            height: 400,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | code | help',
            content_style: `
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; 
                font-size: 14px;
                background-color: #0f172a;
                color: #e2e8f0;
              }
              body::-webkit-scrollbar {
                width: 8px;
              }
              body::-webkit-scrollbar-track {
                background: #1e293b;
              }
              body::-webkit-scrollbar-thumb {
                background: #475569;
                border-radius: 4px;
              }
              body::-webkit-scrollbar-thumb:hover {
                background: #64748b;
              }
            `,
            skin: 'oxide-dark',
            content_css: 'dark',
            placeholder: placeholder,
            branding: false,
            promotion: false,
          }}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
