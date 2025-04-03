'use client';

import { createContext, useState, useContext, ReactNode, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import translationsData from '../data/translations.json';

type Language = 'fr' | 'en';

type FilterType = 'centerType' | 'appointmentType';

type TranslationValue = {
  fr: string;
  en: string;
};

// Types for URL parameter mappings
type CenterTypeKeys = 'dental' | 'radiology' | 'urology';
type CenterTypeFrKeys = 'dentaire' | 'radiologie' | 'urologie';
type AppointmentTypeKeys = 'booking' | 'modification' | 'cancellation' | 'post-operative' | 'results' | 'information' | 'delay' | 'confirmation';
type AppointmentTypeFrKeys = 'prise-de-rendez-vous' | 'modification' | 'annulation' | 'appel-post-operatoire' | 'demande-resultats' | 'demande-informations' | 'retard' | 'confirmation';

type URLParamMappings = {
  centerTypes: {
    en: Record<CenterTypeKeys, CenterTypeFrKeys>;
    fr: Record<CenterTypeFrKeys, CenterTypeKeys>;
  };
  appointmentTypes: {
    en: Record<AppointmentTypeKeys, AppointmentTypeFrKeys>;
    fr: Record<AppointmentTypeFrKeys, AppointmentTypeKeys>;
  };
};

// URL parameter mappings
const URL_PARAMS_MAPPING: URLParamMappings = {
  centerTypes: {
    en: {
      'dental': 'dentaire',
      'radiology': 'radiologie',
      'urology': 'urologie'
    },
    fr: {
      'dentaire': 'dental',
      'radiologie': 'radiology',
      'urologie': 'urology'
    }
  },
  appointmentTypes: {
    en: {
      'booking': 'prise-de-rendez-vous',
      'modification': 'modification',
      'cancellation': 'annulation',
      'post-operative': 'appel-post-operatoire',
      'results': 'demande-resultats',
      'information': 'demande-informations',
      'delay': 'retard',
      'confirmation': 'confirmation'
    },
    fr: {
      'prise-de-rendez-vous': 'booking',
      'modification': 'modification',
      'annulation': 'cancellation',
      'appel-post-operatoire': 'post-operative',
      'demande-resultats': 'results',
      'demande-informations': 'information',
      'retard': 'delay',
      'confirmation': 'confirmation'
    }
  }
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

// Separate component for the provider content
function LanguageProviderContent({ children }: { children: ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [language, setLanguage] = useState<Language>(() => {
    // Get language from URL
    const urlLang = searchParams.get('lang');
    // Validate that the URL language is either 'fr' or 'en', otherwise default to 'fr'
    return (urlLang === 'fr' || urlLang === 'en') ? urlLang : 'fr';
  });

  // Convert parameter value based on language
  const convertParamValue = (value: string | null, type: 'centerTypes' | 'appointmentTypes', targetLang: Language): string | null => {
    if (!value) return null;
    
    const mapping = URL_PARAMS_MAPPING[type];
    // We want to convert FROM the current language TO the target language
    const currentLang = targetLang === 'en' ? 'fr' : 'en';
    
    if (type === 'centerTypes') {
      return currentLang === 'en' 
        ? (mapping.en as Record<CenterTypeKeys, CenterTypeFrKeys>)[value as CenterTypeKeys] || value
        : (mapping.fr as Record<CenterTypeFrKeys, CenterTypeKeys>)[value as CenterTypeFrKeys] || value;
    } else {
      return currentLang === 'en'
        ? (mapping.en as Record<AppointmentTypeKeys, AppointmentTypeFrKeys>)[value as AppointmentTypeKeys] || value
        : (mapping.fr as Record<AppointmentTypeFrKeys, AppointmentTypeKeys>)[value as AppointmentTypeFrKeys] || value;
    }
  };

  // Update URL when language changes
  const updateURL = (newLang: Language) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Convert center type parameter if it exists
    const centerType = searchParams.get('center');
    if (centerType) {
      const convertedCenter = convertParamValue(centerType, 'centerTypes', newLang);
      if (convertedCenter) {
        params.set('center', convertedCenter);
      }
    }

    // Convert appointment type parameter if it exists
    const appointmentType = searchParams.get('type');
    if (appointmentType) {
      const convertedType = convertParamValue(appointmentType, 'appointmentTypes', newLang);
      if (convertedType) {
        params.set('type', convertedType);
      }
    }

    // Always include language parameter
    params.set('lang', newLang);

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

// Provider component with Suspense
export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LanguageProviderContent>{children}</LanguageProviderContent>
    </Suspense>
  );
}

// Custom hook for consuming the context
export function useLanguage() {
  return useContext(LanguageContext);
}