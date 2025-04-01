'use client';

import { useState, useRef, useEffect, useContext } from 'react';
import Image from 'next/image';
import AudioContext from '../contexts/AudioContext';
// Suppression de l'import qui ne fonctionne pas
// import ReactAudioSpectrum from 'react-audio-spectrum';

interface DemoCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  audioFile: string;
  centerType: string;
  appointmentType: string;
}

export default function DemoCard({ id, title, description, image, audioFile, centerType, appointmentType }: DemoCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { currentlyPlaying, setCurrentlyPlaying } = useContext(AudioContext);
  const [isResetting, setIsResetting] = useState(false);
  
  useEffect(() => {
    // Handle audio end event
    const handleAudioEnd = () => {
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      setProgress(0);
      console.log("Audio playback ended");
    };

    const handlePlay = () => {
      console.log("Audio playback started successfully");
    };

    const handleError = (e: Event) => {
      console.error("Audio error occurred:", e);
      setIsPlaying(false);
      setCurrentlyPlaying(null);
    };
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setProgress(audioRef.current.currentTime);
      }
    };
    
    const handleLoadedMetadata = () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration);
      }
    };

    // Capture the current ref value to use in cleanup
    const audioElement = audioRef.current;

    if (audioElement) {
      audioElement.addEventListener('ended', handleAudioEnd);
      audioElement.addEventListener('play', handlePlay);
      audioElement.addEventListener('error', handleError);
      audioElement.addEventListener('timeupdate', handleTimeUpdate);
      audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      
      // Ensure audio has proper volume and is not muted
      audioElement.volume = 1.0;
      audioElement.muted = false;
    }

    return () => {
      // Use the captured value in cleanup
      if (audioElement) {
        audioElement.removeEventListener('ended', handleAudioEnd);
        audioElement.removeEventListener('play', handlePlay);
        audioElement.removeEventListener('error', handleError);
        audioElement.removeEventListener('timeupdate', handleTimeUpdate);
        audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      }
    };
  }, [setCurrentlyPlaying]);

  // Effect to handle global audio state
  useEffect(() => {
    // If another audio is playing, pause this one
    if (currentlyPlaying !== null && currentlyPlaying !== id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [currentlyPlaying, id, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setCurrentlyPlaying(null);
        console.log("Audio paused");
      } else {
        console.log("Attempting to play audio...", audioFile);
        // Set this as the currently playing audio globally before trying to play
        setCurrentlyPlaying(id);
        audioRef.current.play().catch(err => {
          console.error("Audio playback error:", err);
          setCurrentlyPlaying(null);
        });
        setIsPlaying(true);
      }
    }
  };

  const resetAudio = () => {
    if (audioRef.current) {
      setIsResetting(true);
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentlyPlaying(null);
      
      // Add a delay before actually resetting the progress for smooth transition
      setTimeout(() => {
        setProgress(0);
        setIsResetting(false);
      }, 300);
    }
  };
  
  // Calculate the progress percentage for the progress indicator
  const progressPercentage = duration > 0 ? (progress / duration) * 100 : 0;
  
  // Calculate the circle parameters for the progress indicator
  const circleRadius = 29; // Adjusted radius
  const circleCircumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circleCircumference * (1 - progressPercentage / 100);

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden w-full h-[600px] hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 flex flex-col">
      {/* Image Container with Gradient Overlay and Controls */}
      <div className="relative h-[250px] w-full group overflow-hidden flex-shrink-0">
        <div className={`absolute inset-0 transition-all duration-700 ${isPlaying ? 'scale-105 blur-sm' : 'group-hover:scale-110'}`}>
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
          />
        </div>
        {/* Gradient overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t ${isPlaying ? 'from-black/80 via-black/60 to-black/30' : 'from-black/60 via-black/30 to-transparent'} transition-all duration-500`} />
        
        {/* CSS Audio Waveform - Only visible when playing */}
        {isPlaying && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
            <div className="bg-black/60 backdrop-blur-md p-4 rounded-xl flex flex-col items-center">
              <div className="text-white text-base font-medium mb-3">Lecture en cours</div>
              
              {/* CSS Waveform Animation */}
              <div className="flex items-center justify-center h-16 space-x-1">
                {Array.from({ length: 16 }).map((_, index) => (
                  <div
                    key={index}
                    className="w-1.5 bg-white rounded-full"
                    style={{
                      height: `${Math.max(15, Math.random() * 60)}px`,
                      animation: `equalizer 1s ease-in-out infinite alternate ${index * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
            
            <style jsx>{`
              @keyframes equalizer {
                0% {
                  height: ${Math.max(10, Math.random() * 30)}px;
                }
                100% {
                  height: ${Math.max(20, Math.random() * 60)}px;
                }
              }
            `}</style>
          </div>
        )}
        
        {/* Audio Controls */}
        <div className="absolute bottom-4 right-4 flex gap-3 z-10">
          <button
            onClick={resetAudio}
            className={`w-16 h-16 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-500 flex-shrink-0 border border-white/30 ${
              progress > 0 
                ? 'bg-white/20 hover:bg-white/30 hover:scale-110' 
                : 'bg-white/10 cursor-not-allowed opacity-50'
            }`}
            disabled={progress === 0}
            aria-label="Reset audio"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={togglePlay}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 flex items-center justify-center transition-all duration-500 hover:scale-110 flex-shrink-0 border border-white/30 relative"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {/* Progress Circle Indicator - Only visible when playing */}
            <svg className="absolute inset-0 -rotate-90" viewBox="0 0 64 64">
              {isPlaying && (
                <circle
                  cx="32"
                  cy="32"
                  r={circleRadius}
                  fill="none"
                  stroke="rgba(59, 130, 246, 0.2)"
                  strokeWidth="3"
                  className="opacity-80"
                />
              )}
              {(progress > 0 || isResetting) && (
                <circle
                  cx="32"
                  cy="32"
                  r={circleRadius}
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeDasharray={circleCircumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 ease-linear"
                  style={{ filter: "drop-shadow(0 0 3px #3b82f6)" }}
                />
              )}
            </svg>
            <div className="z-10 absolute inset-0 flex items-center justify-center">
              {isPlaying ? (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        {/* Title Section */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6 leading-tight tracking-tight line-clamp-3">{title}</h3>

        {/* Description Section */}
        <div className="flex-grow mb-6">
          <p className="text-gray-600 leading-relaxed text-lg tracking-wide line-clamp-4">{description}</p>
        </div>

        {/* Tags Section - Improved overflow handling */}
        <div className="flex flex-wrap items-start gap-2 mt-auto w-full">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium truncate min-w-0 max-w-full">
            {centerType}
          </span>
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium truncate min-w-0 max-w-full">
            {appointmentType}
          </span>
        </div>
      </div>
      <audio 
        ref={audioRef} 
        src={audioFile} 
        id={`audio-player-${id}`}
        preload="auto"
      />
    </div>
  );
} 