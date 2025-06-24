/**
 * Voice AI and speech-related type definitions for Curmunchkins Mystery Box Explorer
 * Defines voice synthesis, recognition, and character voice configurations
 */

import type { MunchieCharacter, EmotionType } from './story.types';

export type VoiceProvider = 'elevenlabs' | 'browser' | 'mock';

export type VoiceQuality = 'low' | 'medium' | 'high' | 'ultra';

export type SpeechRecognitionLanguage = 'en-US' | 'en-GB' | 'en-CA' | 'en-AU';

export interface VoiceSettings {
  provider: VoiceProvider;
  quality: VoiceQuality;
  speed: number; // 0.25 - 4.0, default 1.0
  pitch: number; // 0.5 - 2.0, default 1.0
  volume: number; // 0.0 - 1.0, default 0.8
  stability: number; // 0.0 - 1.0, ElevenLabs specific
  clarity: number; // 0.0 - 1.0, ElevenLabs specific
  style: number; // 0.0 - 1.0, ElevenLabs specific
  useSpeakerBoost: boolean; // ElevenLabs specific
}

export interface CharacterVoice {
  characterId: MunchieCharacter;
  voiceId: string; // ElevenLabs voice ID or browser voice name
  name: string;
  description: string;
  personality: {
    traits: string[];
    speakingStyle: string;
    emotionalRange: EmotionType[];
  };
  defaultSettings: VoiceSettings;
  emotionMappings: Record<EmotionType, Partial<VoiceSettings>>;
  sampleAudioUrl?: string;
}

export interface VoiceSynthesisRequest {
  text: string;
  characterId: MunchieCharacter;
  emotion: EmotionType;
  settings?: Partial<VoiceSettings>;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  cacheKey?: string;
}

export interface VoiceSynthesisResponse {
  audioUrl: string;
  audioBuffer?: ArrayBuffer;
  duration: number; // milliseconds
  characterId: MunchieCharacter;
  emotion: EmotionType;
  text: string;
  generatedAt: number;
  cacheKey?: string;
}

export interface SpeechRecognitionConfig {
  language: SpeechRecognitionLanguage;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  timeout: number; // milliseconds
  expectedPhrases?: string[]; // Hints for better recognition
  childFriendly: boolean; // Optimized for children's speech patterns
}

export interface SpeechRecognitionResult {
  transcript: string;
  confidence: number; // 0.0 - 1.0
  isFinal: boolean;
  alternatives: {
    transcript: string;
    confidence: number;
  }[];
  timestamp: number;
  duration: number; // milliseconds
}

export interface VoiceInteraction {
  id: string;
  type: 'prompt' | 'response' | 'command' | 'story_narration';
  characterId: MunchieCharacter;
  text: string;
  emotion: EmotionType;
  expectedResponse?: string[];
  timeout: number;
  retryCount: number;
  maxRetries: number;
  fallbackAction: 'continue' | 'repeat' | 'skip' | 'help';
  createdAt: number;
}

export interface VoiceSession {
  id: string;
  userId: string;
  storyId?: string;
  startTime: number;
  endTime?: number;
  interactions: VoiceInteraction[];
  settings: VoiceSettings;
  
  // Session metrics
  metrics: {
    totalSpeechTime: number; // milliseconds
    totalListeningTime: number; // milliseconds
    recognitionAccuracy: number; // 0.0 - 1.0
    responseLatency: number; // average milliseconds
    errorCount: number;
    retryCount: number;
  };
  
  // Accessibility adaptations made during session
  adaptations: {
    speedAdjustments: number[];
    volumeAdjustments: number[];
    pitchAdjustments: number[];
    pausesAdded: number;
    repeatsRequested: number;
  };
}

export interface AudioCache {
  key: string;
  audioBuffer: ArrayBuffer;
  metadata: {
    characterId: MunchieCharacter;
    emotion: EmotionType;
    text: string;
    duration: number;
    settings: VoiceSettings;
  };
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  size: number; // bytes
}

export interface VoiceCalibration {
  userId: string;
  characterId: MunchieCharacter;
  
  // Calibrated settings based on user preferences and responses
  calibratedSettings: VoiceSettings;
  
  // User response patterns
  responsePatterns: {
    averageResponseTime: number;
    preferredPauseLength: number;
    recognitionAccuracy: number;
    frequentMisrecognitions: string[];
    successfulPhrases: string[];
  };
  
  // Accessibility adjustments
  accessibilityProfile: {
    hearingLevel: 'normal' | 'mild_loss' | 'moderate_loss' | 'severe_loss';
    speechClarity: 'clear' | 'developing' | 'unclear';
    attentionSpan: 'short' | 'medium' | 'long';
    processingSpeed: 'fast' | 'average' | 'slow';
  };
  
  lastCalibrated: number;
  calibrationCount: number;
}

export interface VoiceError {
  code: 'SYNTHESIS_FAILED' | 'RECOGNITION_FAILED' | 'NETWORK_ERROR' | 'QUOTA_EXCEEDED' | 'UNSUPPORTED_BROWSER' | 'MICROPHONE_ERROR' | 'AUDIO_PLAYBACK_ERROR';
  message: string;
  characterId?: MunchieCharacter;
  text?: string;
  timestamp: number;
  recoverable: boolean;
  retryAfter?: number; // milliseconds
  fallbackAvailable: boolean;
}

export interface VoiceAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  
  // Usage statistics
  usage: {
    totalInteractions: number;
    totalSpeechTime: number;
    totalListeningTime: number;
    averageSessionDuration: number;
    characterUsage: Record<MunchieCharacter, number>;
    emotionUsage: Record<EmotionType, number>;
  };
  
  // Performance metrics
  performance: {
    averageRecognitionAccuracy: number;
    averageResponseLatency: number;
    errorRate: number;
    retryRate: number;
    userSatisfaction: number; // 0-10, based on completion rates
  };
  
  // Accessibility insights
  accessibility: {
    speedAdjustmentFrequency: number;
    volumeAdjustmentFrequency: number;
    pauseRequestFrequency: number;
    repeatRequestFrequency: number;
    mostEffectiveSettings: VoiceSettings;
  };
  
  // Therapeutic progress
  therapeutic: {
    communicationImprovement: number; // 0-10
    confidenceGrowth: number; // 0-10
    vocabularyExpansion: string[];
    speechClarityImprovement: number; // 0-10
  };
  
  generatedAt: number;
}

// Voice command types for navigation and control
export type VoiceCommand = 
  | 'play'
  | 'pause'
  | 'stop'
  | 'repeat'
  | 'next'
  | 'previous'
  | 'louder'
  | 'quieter'
  | 'faster'
  | 'slower'
  | 'help'
  | 'menu'
  | 'settings'
  | 'exit';

export interface VoiceCommandConfig {
  command: VoiceCommand;
  phrases: string[]; // Alternative ways to say the command
  description: string;
  enabled: boolean;
  requiresConfirmation: boolean;
  accessibilityLevel: 'basic' | 'intermediate' | 'advanced';
}

// Audio processing and effects
export interface AudioEffect {
  type: 'reverb' | 'echo' | 'filter' | 'normalize' | 'compress';
  parameters: Record<string, number>;
  enabled: boolean;
}

export interface AudioProcessingPipeline {
  effects: AudioEffect[];
  outputFormat: 'mp3' | 'wav' | 'ogg' | 'webm';
  bitrate: number;
  sampleRate: number;
  channels: 1 | 2; // mono or stereo
}

// Type guards for voice data validation
export const isVoiceProvider = (value: string): value is VoiceProvider => {
  return ['elevenlabs', 'browser', 'mock'].includes(value);
};

export const isVoiceQuality = (value: string): value is VoiceQuality => {
  return ['low', 'medium', 'high', 'ultra'].includes(value);
};

export const isSpeechRecognitionLanguage = (value: string): value is SpeechRecognitionLanguage => {
  return ['en-US', 'en-GB', 'en-CA', 'en-AU'].includes(value);
};

export const isVoiceCommand = (value: string): value is VoiceCommand => {
  return [
    'play', 'pause', 'stop', 'repeat', 'next', 'previous',
    'louder', 'quieter', 'faster', 'slower', 'help', 'menu', 'settings', 'exit'
  ].includes(value);
};

// Utility types for voice data manipulation
export type VoiceSettingsUpdate = Partial<VoiceSettings>;
export type CharacterVoiceUpdate = Partial<Omit<CharacterVoice, 'characterId'>>;
export type VoiceSessionUpdate = Partial<Omit<VoiceSession, 'id' | 'userId' | 'startTime'>>;

// Default configurations
export const DEFAULT_VOICE_SETTINGS = {
  provider: 'elevenlabs',
  quality: 'medium',
  speed: 1.0,
  pitch: 1.0,
  volume: 0.8,
  stability: 0.75,
  clarity: 0.75,
  style: 0.5,
  useSpeakerBoost: false,
} as const satisfies VoiceSettings;

export const DEFAULT_SPEECH_RECOGNITION_CONFIG = {
  language: 'en-US',
  continuous: false,
  interimResults: false,
  maxAlternatives: 3,
  timeout: 5000,
  childFriendly: true,
} as const satisfies SpeechRecognitionConfig;