/**
 * Voice recognition hook for speech input
 * Provides controls and state for speech recognition
 */

import { useState, useCallback } from 'react';
import { useVoiceStore } from '@/stores';
import type { SpeechRecognitionResult } from '@/types';

export interface VoiceRecognitionOptions {
  timeout?: number;
  continuous?: boolean;
  onRecognitionStart?: () => void;
  onRecognitionEnd?: () => void;
  onResult?: (result: SpeechRecognitionResult) => void;
  onError?: (error: Error) => void;
}

export const useVoiceRecognition = (options: VoiceRecognitionOptions = {}) => {
  const {
    isListening,
    lastRecognitionResult,
    error,
    startListening,
    stopListening,
    clearError,
  } = useVoiceStore();

  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  // Check if speech recognition is supported
  const checkSupport = useCallback(async () => {
    try {
      const { voiceRecognitionService } = await import('@/services/elevenlabs/voiceRecognition');
      const supported = voiceRecognitionService.isSupported();
      setIsSupported(supported);
      return supported;
    } catch (error) {
      console.error('Failed to check speech recognition support:', error);
      setIsSupported(false);
      return false;
    }
  }, []);

  // Start listening for speech
  const listen = useCallback(async (expectedPhrases?: string[]) => {
    if (!isSupported) {
      const supported = await checkSupport();
      if (!supported) {
        if (options.onError) {
          options.onError(new Error('Speech recognition is not supported in this browser'));
        }
        return null;
      }
    }
    
    if (options.onRecognitionStart) {
      options.onRecognitionStart();
    }
    
    try {
      const result = await startListening(expectedPhrases);
      
      setTranscript(result.transcript);
      setConfidence(result.confidence);
      
      if (options.onResult) {
        options.onResult(result);
      }
      
      if (options.onRecognitionEnd) {
        options.onRecognitionEnd();
      }
      
      return result;
    } catch (error) {
      console.error('Speech recognition failed:', error);
      
      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
      
      if (options.onRecognitionEnd) {
        options.onRecognitionEnd();
      }
      
      return null;
    }
  }, [isSupported, checkSupport, startListening, options]);

  // Check if the transcript matches any of the expected phrases
  const matchesExpectedPhrase = useCallback((
    text: string,
    expectedPhrases: string[]
  ): boolean => {
    const normalizedText = text.toLowerCase().trim();
    
    return expectedPhrases.some(phrase => {
      const normalizedPhrase = phrase.toLowerCase().trim();
      
      // Exact match
      if (normalizedText === normalizedPhrase) {
        return true;
      }
      
      // Contains match
      if (normalizedText.includes(normalizedPhrase)) {
        return true;
      }
      
      // Word match (check if all words in the phrase are in the text)
      const phraseWords = normalizedPhrase.split(/\s+/);
      const textWords = normalizedText.split(/\s+/);
      
      return phraseWords.every(word => 
        textWords.some(textWord => textWord.includes(word) || word.includes(textWord))
      );
    });
  }, []);

  return {
    // State
    isListening,
    transcript,
    confidence,
    lastResult: lastRecognitionResult,
    isSupported,
    error,
    
    // Methods
    listen,
    stopListening,
    checkSupport,
    matchesExpectedPhrase,
    clearError,
  };
};

export default useVoiceRecognition;