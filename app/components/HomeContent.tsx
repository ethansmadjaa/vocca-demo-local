'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DemoCard from './DemoCard';
import FilterSection from './FilterSection';
import demos from '../data/demos.json';
import Image from 'next/image';
import AudioContext from '../contexts/AudioContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '../contexts/LanguageContext';

// Shuffle function using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { language, t } = useLanguage();
  
  // Add mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Audio context state
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  
  // Initialize state from URL parameters
  const [selectedCenterType, setSelectedCenterType] = useState<string | null>(
    searchParams.get('center')
  );
  const [selectedAppointmentType, setSelectedAppointmentType] = useState<string | null>(
    searchParams.get('type')
  );
  
  // Initialize with unshuffled filtered demos and add isShuffled state
  const [shuffledFilteredDemos, setShuffledFilteredDemos] = useState(demos.demos);
  const [isShuffled, setIsShuffled] = useState(false);
  
  // Add state to track filter changes for animation
  const [isFiltering, setIsFiltering] = useState(false);

  // Initial shuffle effect that runs only on the client
  useEffect(() => {
    const initialFiltered = demos.demos.filter((demo) => {
      const matchesCenterType = !selectedCenterType || demo.centerType === selectedCenterType;
      const matchesAppointmentType = !selectedAppointmentType || demo.appointmentType === selectedAppointmentType;
      const matchesLanguage = demo.language === language || !demo.language; // Show demos with missing language field too
      return matchesCenterType && matchesAppointmentType && matchesLanguage;
    });
    setShuffledFilteredDemos(shuffleArray(initialFiltered));
    setIsShuffled(true);
  }, [language, selectedCenterType, selectedAppointmentType]);

  // Filter and shuffle demos when filters change
  useEffect(() => {
    // Skip the initial render
    if (!isShuffled) return;
    
    // Set filtering state to true to trigger animation
    setIsFiltering(true);
    
    // Add a small delay to allow the exit animation to complete
    const filterTimeout = setTimeout(() => {
      const filtered = demos.demos.filter((demo) => {
        const matchesCenterType = !selectedCenterType || demo.centerType === selectedCenterType;
        const matchesAppointmentType = !selectedAppointmentType || demo.appointmentType === selectedAppointmentType;
        const matchesLanguage = demo.language === language || !demo.language; // Show demos with missing language field too
        return matchesCenterType && matchesAppointmentType && matchesLanguage;
      });
      
      setShuffledFilteredDemos(shuffleArray(filtered));
      
      // Reset filtering state after a short delay to trigger the enter animation
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
    
    return () => clearTimeout(filterTimeout);
  }, [selectedCenterType, selectedAppointmentType, isShuffled, language]); // Added language dependency

  // Update URL when filters change
  const updateURL = (center: string | null, type: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update filter parameters
    if (center) {
      params.set('center', center);
    } else {
      params.delete('center');
    }
    
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    
    // Preserve language parameter
    if (language) {
      params.set('lang', language);
    }
    
    // Create the URL string with query parameters if they exist
    const newURL = params.toString() ? `?${params.toString()}` : '';
    
    // Update the URL without refreshing the page
    router.push(newURL, { scroll: false });
  };

  // Handle filter changes
  const handleCenterTypeChange = (center: string | null) => {
    setSelectedCenterType(center);
    updateURL(center, selectedAppointmentType);
  };

  const handleAppointmentTypeChange = (type: string | null) => {
    setSelectedAppointmentType(type);
    updateURL(selectedCenterType, type);
  };

  return (
    <AudioContext.Provider value={{ currentlyPlaying, setCurrentlyPlaying }}>
      <main className="min-h-screen bg-gray-100">
        {/* Header Section */}
        <header className="bg-white shadow-sm sticky top-0 z-20">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <a href="https://www.vocca.ai" target="_blank" rel="noopener noreferrer" aria-label="Vocca AI Home">
                  <Image
                    src="/banner.webp" 
                    alt="Vocca AI Logo"
                    width={100}
                    height={40}
                    className="object-contain" 
                    priority
                  />
                </a>
              </div>
              
              {/* Right side navigation */}
              <div className="flex items-center space-x-4">
                {/* Language Switcher - visible on all screens */}
                <LanguageSwitcher />
                
                {/* Hamburger Menu Button - visible on all screens */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-expanded={isMobileMenuOpen}
                >
                  <span className="sr-only">Toggle menu</span>
                  <svg 
                    className="h-6 w-6" 
                    stroke="currentColor" 
                    fill="none" 
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {isMobileMenuOpen ? (
                      // X icon when menu is open
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      // Hamburger icon when menu is closed
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Mobile menu panel */}
            <div 
              className={`${
                isMobileMenuOpen ? 'block' : 'hidden'
              } border-t border-gray-200 py-2`}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Add any additional mobile menu items here */}
                <a
                  href="https://www.vocca.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Visit Vocca.ai
                </a>
              </div>
            </div>
          </nav>
        </header>

        {/* Original Banner Section Removed */}
        {/* 
        <div className="w-full flex justify-center px-4 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-4 md:p-8 w-full max-w-2xl relative h-[100px] md:h-[120px] flex flex-row justify-between items-center">
            <div className="relative h-full flex-shrink-0 mr-4" style={{ width: '150px' }}>
              <Image
                src="/banner.webp"
                alt="Vooca Banner"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
        */}

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8"> {/* Added top padding */}
          <h1 className="text-4xl font-bold text-center mb-12 text-[#171717] drop-shadow-sm">
            {t('general.title.main')}
          </h1>
          
          {/* Filters */}
          <FilterSection
            filters={demos.filters}
            selectedCenterType={selectedCenterType}
            selectedAppointmentType={selectedAppointmentType}
            onCenterTypeChange={handleCenterTypeChange}
            onAppointmentTypeChange={handleAppointmentTypeChange}
          />

          {/* Demo Cards Grid with Loading State and Filter Animation */}
          {isShuffled ? (
            <div 
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 
                transition-all duration-500 ease-in-out
                ${isFiltering ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'}`}
            >
              {shuffledFilteredDemos.map((demo) => (
                <DemoCard
                  key={demo.id}
                  id={demo.id.toString()}
                  title={demo.title}
                  description={demo.description}
                  image={demo.image}
                  audioFile={demo.audioFile}
                  centerType={demo.centerType}
                  appointmentType={demo.appointmentType}
                  language={demo.language || 'fr'} // Default to French if not specified
                />
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-gray-600">{t('loading')}</div>
            </div>
          )}
        </div>
      </main>
    </AudioContext.Provider>
  );
} 