/**
 * Voice state management using Zustand
 * Handles voice synthesis, recognition, and audio playback
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  VoiceSettings, 
  CharacterVoice, 
  VoiceSession, 
  VoiceInteraction,
  VoiceSynthesisRequest,
  VoiceSynthesisResponse,
  SpeechRecognitionResult,
  VoiceError,
  MunchieCharacter,
  EmotionType,
} from '@/types';
import { DEFAULT_VOICE_SETTINGS } from '@/types';
import { getCharacterVoiceModel } from '@/services/elevenlabs/voiceModels';

export interface VoiceStoreState {
  // Voice settings
  currentVoiceSettings: VoiceSettings;
  characterVoices: Record<MunchieCharacter, CharacterVoice>;
  
  // Playback state
  isPlaying: boolean;
  isPaused: boolean;
  currentAudioId: string | null;
  playbackProgress: number;
  
  // Session state
  currentSession: VoiceSession | null;
  currentInteraction: VoiceInteraction | null;
  
  // Recognition state
  isListening: boolean;
  lastRecognitionResult: SpeechRecognitionResult | null;
  
  // Loading and error states
  isLoading: boolean;
  error: VoiceError | null;
}

export interface VoiceStoreActions {
  // Settings management
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  setCharacterVoice: (characterId: MunchieCharacter, voice: Partial<CharacterVoice>) => void;
  resetToDefaultSettings: () => void;
  
  // Voice synthesis
  playStorySegment: (params: {
    text: string;
    characterId: MunchieCharacter;
    emotion: EmotionType;
    settings?: Partial<VoiceSettings>;
  }) => Promise<boolean>;
  
  // Playback control
  pauseNarration: () => void;
  resumeNarration: () => void;
  stopNarration: () => void;
  
  // Speech recognition
  startListening: (expectedPhrases?: string[]) => Promise<SpeechRecognitionResult>;
  stopListening: () => void;
  
  // Session management
  startVoiceSession: (storyId?: string) => void;
  endVoiceSession: () => void;
  
  // Error handling
  setError: (error: VoiceError | null) => void;
  clearError: () => void;
}

export const useVoiceStore = create<VoiceStoreState & VoiceStoreActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentVoiceSettings: DEFAULT_VOICE_SETTINGS,
    characterVoices: {
      silo: getCharacterVoiceModel('silo'),
      blip: getCharacterVoiceModel('blip'),
      pip: getCharacterVoiceModel('pip'),
      tally: getCharacterVoiceModel('tally'),
      tumble: getCharacterVoiceModel('tumble'),
      echo: getCharacterVoiceModel('echo'),
      sway: getCharacterVoiceModel('sway'),
      ponder: getCharacterVoiceModel('ponder'),
    },
    isPlaying: false,
    isPaused: false,
    currentAudioId: null,
    playbackProgress: 0,
    currentSession: null,
    currentInteraction: null,
    isListening: false,
    lastRecognitionResult: null,
    isLoading: false,
    error: null,

    // Settings management
    updateVoiceSettings: (settings) => {
      set(state => ({
        currentVoiceSettings: {
          ...state.currentVoiceSettings,
          ...settings,
        },
      }));
    },

    setCharacterVoice: (characterId, voice) => {
      set(state => ({
        characterVoices: {
          ...state.characterVoices,
          [characterId]: {
            ...state.characterVoices[characterId],
            ...voice,
          },
        },
      }));
    },

    resetToDefaultSettings: () => {
      set({
        currentVoiceSettings: DEFAULT_VOICE_SETTINGS,
      });
    },

    // Voice synthesis
    playStorySegment: async (params) => {
      const { text, characterId, emotion, settings } = params;
      
      set({ isLoading: true, error: null });
      
      try {
        // Get character voice settings
        const characterVoiceModel = getCharacterVoiceModel(characterId);
        if (!characterVoiceModel) {
          throw new Error(`Voice model not found for character: ${characterId}`);
        }
        
        const characterSettings = characterVoiceModel.defaultSettings;
        
        // Merge with current settings and any overrides
        const mergedSettings = {
          ...characterSettings,
          ...get().currentVoiceSettings,
          ...settings,
        };
        
        // Create interaction record
        const interaction: VoiceInteraction = {
          id: crypto.randomUUID(),
          type: 'story_narration',
          characterId,
          text,
          emotion,
          expectedResponse: [],
          timeout: 0,
          retryCount: 0,
          maxRetries: 0,
          fallbackAction: 'continue',
          createdAt: Date.now(),
        };
        
        // Start session if none exists
        if (!get().currentSession) {
          get().startVoiceSession();
        }
        
        // Update state
        set({
          currentInteraction: interaction,
          isLoading: false,
        });
        
        // Synthesize and play audio
        const { 
          voiceSynthesisService, 
          audioQueue 
        } = await import('@/services/elevenlabs');
        
        const synthesisResult = await voiceSynthesisService.synthesizeSpeech({
          text,
          characterId,
          emotion,
          settings: mergedSettings,
          priority: 'normal',
        });
        
        // Queue audio for playback
        const audioId = crypto.randomUUID();
        
        audioQueue.addToQueue({
          id: audioId,
          audio: synthesisResult,
          priority: 'high',
          onStart: () => {
            set({ isPlaying: true, isPaused: false, currentAudioId: audioId });
          },
          onComplete: () => {
            set({ isPlaying: false, isPaused: false, currentAudioId: null, playbackProgress: 100 });
          },
          onError: (error) => {
            console.error('Audio playback error:', error);
            set({ 
              isPlaying: false, 
              isPaused: false, 
              currentAudioId: null,
              error: {
                code: 'AUDIO_PLAYBACK_ERROR',
                message: 'Failed to play audio',
                timestamp: Date.now(),
                recoverable: true,
                retryAfter: 1000,
                fallbackAvailable: true,
              },
            });
          },
        });
        
        return true;
        
      } catch (error) {
        console.error('Failed to play story segment:', error);
        
        set({
          isLoading: false,
          isPlaying: false,
          error: {
            code: 'SYNTHESIS_FAILED',
            message: 'Failed to synthesize speech',
            timestamp: Date.now(),
            recoverable: true,
            retryAfter: 2000,
            fallbackAvailable: true,
          },
        });
        
        return false;
      }
    },

    // Playback control
    pauseNarration: () => {
      import('@/services/elevenlabs/audioQueue').then(({ audioQueue }) => {
        audioQueue.pause();
      });
      set({ isPaused: true, isPlaying: false });
    },

    resumeNarration: () => {
      import('@/services/elevenlabs/audioQueue').then(({ audioQueue }) => {
        audioQueue.resume();
      });
      set({ isPaused: false, isPlaying: true });
    },

    stopNarration: () => {
      import('@/services/elevenlabs/audioQueue').then(({ audioQueue }) => {
        audioQueue.stop();
      });
      set({ isPlaying: false, isPaused: false, currentAudioId: null });
    },

    // Speech recognition
    startListening: async (expectedPhrases) => {
      set({ isListening: true, error: null });
      
      try {
        const { voiceRecognitionService } = await import('@/services/elevenlabs/voiceRecognition');
        
        // Check if speech recognition is supported
        if (!voiceRecognitionService.isSupported()) {
          throw new Error('Speech recognition is not supported in this browser');
        }
        
        // Create child-friendly config
        const config = voiceRecognitionService.createChildFriendlyConfig();
        
        // Start listening
        const result = await voiceRecognitionService.startListening(config, {
          expectedPhrases,
          timeout: 10000,
          childFriendly: true,
        });
        
        set({
          isListening: false,
          lastRecognitionResult: result,
        });
        
        return result;
        
      } catch (error) {
        console.error('Speech recognition failed:', error);
        
        set({
          isListening: false,
          error: {
            code: 'RECOGNITION_FAILED',
            message: 'Failed to recognize speech',
            timestamp: Date.now(),
            recoverable: true,
            retryAfter: 1000,
            fallbackAvailable: true,
          },
        });
        
        throw error;
      }
    },

    stopListening: () => {
      import('@/services/elevenlabs/voiceRecognition').then(({ voiceRecognitionService }) => {
        voiceRecognitionService.stopListening();
      });
      set({ isListening: false });
    },

    // Session management
    startVoiceSession: (storyId) => {
      const session: VoiceSession = {
        id: crypto.randomUUID(),
        userId: 'current-user', // Would get from app store
        storyId,
        startTime: Date.now(),
        interactions: [],
        settings: get().currentVoiceSettings,
        metrics: {
          totalSpeechTime: 0,
          totalListeningTime: 0,
          recognitionAccuracy: 0,
          responseLatency: 0,
          errorCount: 0,
          retryCount: 0,
        },
        adaptations: {
          speedAdjustments: [],
          volumeAdjustments: [],
          pitchAdjustments: [],
          pausesAdded: 0,
          repeatsRequested: 0,
        },
      };
      
      set({ currentSession: session });
    },

    endVoiceSession: () => {
      const { currentSession } = get();
      
      if (currentSession) {
        const endedSession = {
          ...currentSession,
          endTime: Date.now(),
        };
        
        // Save session to storage (would implement this)
        console.log('Voice session ended:', endedSession);
        
        // Stop any ongoing playback
        get().stopNarration();
        
        set({ currentSession: null, currentInteraction: null });
      }
    },

    // Error handling
    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },
  }))
);

// Initialize voice settings when store is created
if (typeof window !== 'undefined') {
  // Load saved voice settings from localStorage
  const savedSettings = localStorage.getItem('voice-settings');
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings);
      useVoiceStore.getState().updateVoiceSettings(settings);
    } catch (error) {
      console.error('Failed to load saved voice settings:', error);
    }
  }
  
  // Save settings when they change
  useVoiceStore.subscribe(
    state => state.currentVoiceSettings,
    (settings) => {
      localStorage.setItem('voice-settings', JSON.stringify(settings));
    }
  );
}