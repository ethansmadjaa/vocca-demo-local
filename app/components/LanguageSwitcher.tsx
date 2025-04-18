'use client';

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center bg-white rounded-full shadow-md border border-gray-200 overflow-hidden">
      <button
        onClick={() => setLanguage('fr')}
        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-colors duration-300 ${
          language === 'fr'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to French"
      >
        FR
      </button>
      <div className="h-4 md:h-5 w-px bg-gray-200"></div>
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-colors duration-300 ${
          language === 'en'
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-600 hover:bg-gray-100'
        }`}
        aria-label="Switch to English"
      >
        EN
      </button>
    </div>
  );
} 