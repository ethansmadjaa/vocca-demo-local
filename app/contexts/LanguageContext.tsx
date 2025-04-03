'use client';

import { createContext, useState, useContext, ReactNode} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import translationsData from '../data/translations.json';

type Language = 'fr' | 'en';

type FilterType = 'centerType' | 'appointmentType';

type TranslationValue = {
  fr: string;
  en: string;
};

type Translations = {
  general: {
    title: {
      main: TranslationValue;
    };
    filters: {
      title: TranslationValue;
      centerType: TranslationValue;
      appointmentType: TranslationValue;
    };
    loading: TranslationValue;
    'loading.simple': TranslationValue;
    playing: TranslationValue;
  };
  centerTypes: {
    [key: string]: TranslationValue;
  };
  appointmentTypes: {
    [key: string]: TranslationValue;
  };
};

type NestedObject = {
  [key: string]: TranslationValue | NestedObject;
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from URL
    const urlLang = searchParams.get('lang');
    // Validate that the URL language is either 'fr' or 'en', otherwise default to 'fr'
    return (urlLang === 'fr' || urlLang === 'en') ? urlLang : 'fr';
  });

  // Update URL when language changes
  const updateURL = (newLang: Language) => {
    const params = new URLSearchParams(searchParams.toString());
    // Only include language in URL if it's English (French is default)
    if (newLang === 'en') {
      params.set('lang', newLang);
    } else {
      params.delete('lang'); // Remove lang parameter if it's French (default)
    }
    router.push(params.toString() ? `?${params.toString()}` : '', { scroll: false });
  };

  // Wrapped setLanguage to also update URL
  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    updateURL(newLang);
  };

  // Translation function
  const t = (key: string): string => {
    const keys = key.split('.');
    let value: NestedObject | TranslationValue = translationsData;
    
    for (const k of keys) {
      value = (value as NestedObject)[k];
      if (!value) return key;
    }
    
    if (typeof value === 'object' && (value as TranslationValue).fr !== undefined) {
      return (value as TranslationValue)[language] || key;
    }
    
    return key;
  };

  // Filter label translation function
  const translateFilterLabel = (id: string, type: FilterType): string => {
    const category = type === 'centerType' ? 'centerTypes' : 'appointmentTypes';
    return (translationsData as Translations)[category]?.[id]?.[language] || id;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleLanguageChange, t, translateFilterLabel }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook for consuming the context
export function useLanguage() {
  return useContext(LanguageContext);
}