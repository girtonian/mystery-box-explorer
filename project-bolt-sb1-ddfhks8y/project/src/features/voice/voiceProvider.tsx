/**
 * Voice provider component for Curmunchkins Mystery Box Explorer
 * Provides voice context and initialization for the application
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useVoiceStore } from '@/stores';
import type { MunchieCharacter, EmotionType, VoiceSettings } from '@/types';

interface VoiceContextType {
  isReady: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  currentCharacter: MunchieCharacter | null;
  currentEmotion: EmotionType | null;
  playText: (text: string, characterId: MunchieCharacter, emotion: EmotionType) => Promise<void>;
  pausePlayback: () => void;
  resumePlayback: () => void;
  stopPlayback: () => void;
  updateSettings: (settings: Partial<VoiceSettings>) => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

interface VoiceProviderProps {
  children: React.ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const {
    isPlaying,
    isPaused,
    currentVoiceSettings,
    playStorySegment,
    pauseNarration,
    resumeNarration,
    stopNarration,
    updateVoiceSettings,
  } = useVoiceStore();

  const [isReady, setIsReady] = useState(false);
  const [currentCharacter, setCurrentCharacter] = useState<MunchieCharacter | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType | null>(null);

  // Initialize voice services
  useEffect(() => {
    const initVoice = async () => {
      try {
        // Import and initialize ElevenLabs services
        const { initializeElevenLabsServices } = await import('@/services/elevenlabs');
        await initializeElevenLabsServices();
        setIsReady(true);
      } catch (error) {
        console.error('Failed to initialize voice services:', error);
        // Still mark as ready, we'll use fallbacks
        setIsReady(true);
      }
    };

    initVoice();

    // Cleanup on unmount
    return () => {
      const cleanup = async () => {
        const { cleanupElevenLabsServices } = await import('@/services/elevenlabs');
        cleanupElevenLabsServices();
      };
      
      cleanup().catch(console.error);
    };
  }, []);

  // Play text with a character voice
  const playText = async (
    text: string,
    characterId: MunchieCharacter,
    emotion: EmotionType
  ) => {
    setCurrentCharacter(characterId);
    setCurrentEmotion(emotion);
    
    await playStorySegment({
      text,
      characterId,
      emotion,
      settings: currentVoiceSettings,
    });
  };

  // Update voice settings
  const updateSettings = (settings: Partial<VoiceSettings>) => {
    updateVoiceSettings(settings);
  };

  const value: VoiceContextType = {
    isReady,
    isPlaying,
    isPaused,
    currentCharacter,
    currentEmotion,
    playText,
    pausePlayback: pauseNarration,
    resumePlayback: resumeNarration,
    stopPlayback: stopNarration,
    updateSettings,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};

export default VoiceProvider;