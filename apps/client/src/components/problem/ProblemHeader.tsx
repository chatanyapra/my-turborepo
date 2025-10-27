import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const ProblemHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-dark-900 border-b border-dark-800 px-6 py-4 flex items-center justify-between">
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-dark-400 hover:text-dark-50 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Problems
      </button>
    </div>
  );
};
