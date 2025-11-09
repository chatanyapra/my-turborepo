import React from 'react';
import { cn } from '../../lib/utils';

interface SelectInputProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
}

export const SelectInput: React.FC<SelectInputProps> = ({
  label,
  options,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-dark-200 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <select
        className={cn(
          'w-full px-4 py-2.5 bg-dark-900 border border-dark-700 rounded-lg',
          'text-dark-100',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all duration-200',
          'cursor-pointer',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
