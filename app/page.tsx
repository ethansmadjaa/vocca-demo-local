'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DemoCard from './components/DemoCard';
import FilterSection from './components/FilterSection';
import demos from './data/demos.json';
import Image from 'next/image';
import AudioContext from './contexts/AudioContext';

// Shuffle function using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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
      return matchesCenterType && matchesAppointmentType;
    });
    setShuffledFilteredDemos(shuffleArray(initialFiltered));
    setIsShuffled(true);
  }, []); // Empty dependency array means this runs once after initial mount

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
        return matchesCenterType && matchesAppointmentType;
      });
      
      setShuffledFilteredDemos(shuffleArray(filtered));
      
      // Reset filtering state after a short delay to trigger the enter animation
      setTimeout(() => {
        setIsFiltering(false);
      }, 100);
    }, 300);
    
    return () => clearTimeout(filterTimeout);
  }, [selectedCenterType, selectedAppointmentType, isShuffled]);

  // Update URL when filters change
  const updateURL = (center: string | null, type: string | null) => {
    // Start with a clean URL if no filters are selected
    if (!center && !type) {
      router.push('/', { scroll: false });
      return;
    }
    
    // Create a new URLSearchParams object
    const params = new URLSearchParams();
    
    // Only add params that have values
    if (center) {
      params.set('center', center);
    }
    
    if (type) {
      params.set('type', type);
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
        {/* Banner Section - Updated with white rounded container */}
        <div className="w-full flex justify-center px-4 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-2xl relative h-[120px]">
            <Image
              src="/banner.webp"
              alt="Vooca Banner"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <h1 className="text-4xl font-bold text-center mb-12 text-[#171717] drop-shadow-sm">
            Nos agents spécialisés pour tous vos cas d&apos;usage médicaux
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
                />
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-pulse text-gray-600">Chargement des cas d&apos;usage...</div>
            </div>
          )}
        </div>
      </main>
    </AudioContext.Provider>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
      <HomeContent />
    </Suspense>
  );
}
