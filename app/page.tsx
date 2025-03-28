'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DemoCard from './components/DemoCard';
import FilterSection from './components/FilterSection';
import demos from './data/demos.json';
import Image from 'next/image';
import AudioContext from './contexts/AudioContext';

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

  const filteredDemos = demos.demos.filter((demo) => {
    const matchesCenterType = !selectedCenterType || demo.centerType === selectedCenterType;
    const matchesAppointmentType = !selectedAppointmentType || demo.appointmentType === selectedAppointmentType;
    return matchesCenterType && matchesAppointmentType;
  });

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

          {/* Demo Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDemos.map((demo) => (
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
