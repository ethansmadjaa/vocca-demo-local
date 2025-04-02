'use client';

import { createContext, useState, useContext, ReactNode } from 'react';
import translationsData from '../data/translations.json';

type Language = 'fr' | 'en';

type FilterType = 'centerType' | 'appointmentType';

type TranslationValue = {
  fr: string;
  en: string;
};

type NestedTranslation = TranslationValue | Record<string, TranslationValue | Record<string, unknown>>;

type Translations = {
  general: {
    [key: string]: TranslationValue;
  };
  centerTypes: {
    [key: string]: TranslationValue;
  };
  appointmentTypes: {
    [key: string]: TranslationValue;
  };
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translateFilterLabel: (id: string, type: FilterType) => string;
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  setLanguage: () => {},
  t: (key: string) => key,
  translateFilterLabel: (id: string) => id
});

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: NestedTranslation = translationsData;
    
    for (const k of keys) {
      value = (value as Record<string, unknown>)?.[k] as NestedTranslation;
      if (!value) return key;
    }
    
    return (value as TranslationValue)?.[language] || key;
  };

  // Filter label translation function
  const translateFilterLabel = (id: string, type: FilterType): string => {
    const category = type === 'centerType' ? 'centerTypes' : 'appointmentTypes';
    return (translationsData as Translations)[category]?.[id]?.[language] || id;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, translateFilterLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for consuming the context
export function useLanguage() {
  return useContext(LanguageContext);
}