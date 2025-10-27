import React from 'react';
import { ChevronDown } from 'lucide-react';

export type Language = 'javascript' | 'python' | 'java' | 'cpp';

export const languageMap: Record<Language, { label: string; monacoLang: string }> = {
  javascript: { label: 'JavaScript', monacoLang: 'javascript' },
  python: { label: 'Python', monacoLang: 'python' },
  java: { label: 'Java', monacoLang: 'java' },
  cpp: { label: 'C++', monacoLang: 'cpp' },
};

interface LanguageSelectorProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  language,
  onLanguageChange,
}) => {
  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 bg-dark-800 rounded-lg text-dark-300 hover:text-dark-50 transition-colors">
        <span>{languageMap[language].label}</span>
        <ChevronDown size={16} />
      </button>
      <div className="absolute top-full left-0 mt-1 w-40 bg-dark-800 border border-dark-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
        {(Object.keys(languageMap) as Language[]).map((lang) => (
          <button
            key={lang}
            onClick={() => onLanguageChange(lang)}
            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
              language === lang
                ? 'bg-primary-600 text-white'
                : 'text-dark-300 hover:bg-dark-700 hover:text-dark-50'
            }`}
          >
            {languageMap[lang].label}
          </button>
        ))}
      </div>
    </div>
  );
};
