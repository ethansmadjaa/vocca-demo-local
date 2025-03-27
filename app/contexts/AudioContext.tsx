'use client';

import { createContext } from 'react';

// Audio context to manage playback across components
const AudioContext = createContext<{
  currentlyPlaying: string | null;
  setCurrentlyPlaying: (id: string | null) => void;
}>({
  currentlyPlaying: null,
  setCurrentlyPlaying: () => {},
});

export default AudioContext; 