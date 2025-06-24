/**
 * Voice player hook for audio playback
 * Provides controls and state for voice narration
 */

import { useState, useEffect, useCallback } from 'react';
import { useVoiceStore } from '@/stores';
import type { MunchieCharacter, EmotionType, VoiceSettings } from '@/types';

export interface VoicePlayerOptions {
  autoplay?: boolean;
  onPlaybackStart?: () => void;
  onPlaybackEnd?: () => void;
  onPlaybackError?: (error: Error) => void;
}

export const useVoicePlayer = (options: VoicePlayerOptions = {}) => {
  const {
    isPlaying,
    isPaused,
    currentVoiceSettings,
    playbackProgress,
    error,
    playStorySegment,
    pauseNarration,
    resumeNarration,
    stopNarration,
    updateVoiceSettings,
    clearError,
  } = useVoiceStore();

  const [currentText, setCurrentText] = useState<string>('');
  const [currentCharacter, setCurrentCharacter] = useState<MunchieCharacter | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType | null>(null);

  // Play a text segment with the specified character and emotion
  const playText = useCallback(async (
    text: string,
    characterId: MunchieCharacter,
    emotion: EmotionType,
    settings?: Partial<VoiceSettings>
  ) => {
    try {
      setCurrentText(text);
      setCurrentCharacter(characterId);
      setCurrentEmotion(emotion);
      
      await playStorySegment({
        text,
        characterId,
        emotion,
        settings,
      });
      
      if (options.onPlaybackStart) {
        options.onPlaybackStart();
      }
      
      return true;
    } catch (error) {
      console.error('Failed to play text:', error);
      
      if (options.onPlaybackError) {
        options.onPlaybackError(error instanceof Error ? error : new Error('Unknown error'));
      }
      
      return false;
    }
  }, [playStorySegment, options]);

  // Handle playback completion
  useEffect(() => {
    if (playbackProgress === 100 && options.onPlaybackEnd) {
      options.onPlaybackEnd();
    }
  }, [playbackProgress, options]);

  // Update voice settings
  const setVoiceSettings = useCallback((settings: Partial<VoiceSettings>) => {
    updateVoiceSettings(settings);
  }, [updateVoiceSettings]);

  // Set volume (convenience method)
  const setVolume = useCallback((volume: number) => {
    updateVoiceSettings({ volume: Math.max(0, Math.min(1, volume)) });
  }, [updateVoiceSettings]);

  // Set speed (convenience method)
  const setSpeed = useCallback((speed: number) => {
    updateVoiceSettings({ speed: Math.max(0.5, Math.min(2, speed)) });
  }, [updateVoiceSettings]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    const isMuted = currentVoiceSettings.volume === 0;
    
    if (isMuted) {
      // Restore previous volume (default to 0.8 if none stored)
      const previousVolume = parseFloat(localStorage.getItem('previous-volume') || '0.8');
      updateVoiceSettings({ volume: previousVolume });
    } else {
      // Store current volume before muting
      localStorage.setItem('previous-volume', currentVoiceSettings.volume.toString());
      updateVoiceSettings({ volume: 0 });
    }
  }, [currentVoiceSettings.volume, updateVoiceSettings]);

  return {
    // State
    isPlaying,
    isPaused,
    currentText,
    currentCharacter,
    currentEmotion,
    playbackProgress,
    voiceSettings: currentVoiceSettings,
    error,
    
    // Controls
    playText,
    pauseNarration,
    resumeNarration,
    stopNarration,
    setVoiceSettings,
    setVolume,
    setSpeed,
    toggleMute,
    clearError,
  };
};

export default useVoicePlayer;