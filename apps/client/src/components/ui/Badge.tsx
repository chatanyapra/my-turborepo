import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'easy' | 'medium' | 'hard' | 'default';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantStyles = {
    easy: 'bg-green-500/10 text-green-400 border-green-500/20',
    medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    hard: 'bg-red-500/10 text-red-400 border-red-500/20',
    default: 'bg-dark-800 text-dark-300 border-dark-700',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};
