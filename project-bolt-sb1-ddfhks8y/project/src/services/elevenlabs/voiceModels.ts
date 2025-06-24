/**
 * Character voice model configurations for Curmunchkins
 * Defines voice personalities and settings for each Munchie character
 */

import type { CharacterVoice, MunchieCharacter, EmotionType } from '@/types';

/**
 * Voice model configurations for all Munchie characters
 */
export const CHARACTER_VOICE_MODELS: Record<MunchieCharacter, CharacterVoice> = {
  silo: {
    characterId: 'silo',
    voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam - calm, clear voice
    name: 'Silo',
    description: 'Thoughtful and detail-oriented voice with precise articulation',
    personality: {
      traits: ['analytical', 'calm', 'precise', 'methodical'],
      speakingStyle: 'measured and clear with thoughtful pauses',
      emotionalRange: ['calm', 'curious', 'understanding', 'gentle'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 0.9, // Slightly slower for clarity
      pitch: 1.0,
      volume: 0.8,
      stability: 0.85, // High stability for consistent delivery
      clarity: 0.8,
      style: 0.3, // Lower style for more neutral tone
      useSpeakerBoost: false,
    },
    emotionMappings: {
      calm: { stability: 0.9, style: 0.2, speed: 0.85 },
      curious: { stability: 0.75, style: 0.4, speed: 0.95 },
      understanding: { stability: 0.85, style: 0.3, speed: 0.9 },
      gentle: { stability: 0.9, style: 0.25, speed: 0.85 },
      excited: { stability: 0.7, style: 0.5, speed: 1.0 },
      encouraging: { stability: 0.8, style: 0.35, speed: 0.9 },
      playful: { stability: 0.7, style: 0.45, speed: 1.0 },
      reassuring: { stability: 0.9, style: 0.2, speed: 0.85 },
    },
    sampleAudioUrl: '/audio/samples/silo-sample.mp3',
  },

  blip: {
    characterId: 'blip',
    voiceId: 'ErXwobaYiN019PkySvjV', // Antoni - energetic, expressive
    name: 'Blip',
    description: 'Energetic and creative voice with dynamic expression',
    personality: {
      traits: ['energetic', 'creative', 'enthusiastic', 'spontaneous'],
      speakingStyle: 'animated and expressive with varied intonation',
      emotionalRange: ['excited', 'playful', 'encouraging', 'curious'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 1.1, // Faster for energetic feel
      pitch: 1.1, // Slightly higher pitch
      volume: 0.8,
      stability: 0.65, // Lower stability for more variation
      clarity: 0.75,
      style: 0.6, // Higher style for expressiveness
      useSpeakerBoost: false,
    },
    emotionMappings: {
      excited: { stability: 0.5, style: 0.8, speed: 1.2, pitch: 1.15 },
      playful: { stability: 0.6, style: 0.7, speed: 1.1, pitch: 1.1 },
      encouraging: { stability: 0.7, style: 0.6, speed: 1.05, pitch: 1.05 },
      curious: { stability: 0.65, style: 0.65, speed: 1.0, pitch: 1.1 },
      calm: { stability: 0.8, style: 0.4, speed: 0.95, pitch: 1.0 },
      understanding: { stability: 0.75, style: 0.5, speed: 1.0, pitch: 1.05 },
      gentle: { stability: 0.8, style: 0.4, speed: 0.95, pitch: 1.0 },
      reassuring: { stability: 0.8, style: 0.45, speed: 0.95, pitch: 1.0 },
    },
    sampleAudioUrl: '/audio/samples/blip-sample.mp3',
  },

  pip: {
    characterId: 'pip',
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Bella - warm, storytelling voice
    name: 'Pip',
    description: 'Visual storyteller with warm, engaging narration',
    personality: {
      traits: ['creative', 'visual', 'imaginative', 'expressive'],
      speakingStyle: 'storytelling with vivid descriptions',
      emotionalRange: ['playful', 'curious', 'encouraging', 'excited'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 1.0,
      pitch: 1.05,
      volume: 0.8,
      stability: 0.7,
      clarity: 0.8,
      style: 0.55,
      useSpeakerBoost: false,
    },
    emotionMappings: {
      playful: { stability: 0.65, style: 0.7, speed: 1.05 },
      curious: { stability: 0.7, style: 0.6, speed: 1.0 },
      encouraging: { stability: 0.75, style: 0.55, speed: 1.0 },
      excited: { stability: 0.6, style: 0.75, speed: 1.1 },
      calm: { stability: 0.8, style: 0.4, speed: 0.95 },
      understanding: { stability: 0.75, style: 0.5, speed: 0.95 },
      gentle: { stability: 0.8, style: 0.4, speed: 0.9 },
      reassuring: { stability: 0.8, style: 0.45, speed: 0.9 },
    },
    sampleAudioUrl: '/audio/samples/pip-sample.mp3',
  },

  tally: {
    characterId: 'tally',
    voiceId: 'VR6AewLTigWG4xSOukaG', // Josh - friendly, clear
    name: 'Tally',
    description: 'Word-loving voice with clear articulation and rhythm',
    personality: {
      traits: ['articulate', 'rhythmic', 'word-focused', 'innovative'],
      speakingStyle: 'clear with emphasis on language patterns',
      emotionalRange: ['understanding', 'encouraging', 'curious', 'gentle'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 0.95,
      pitch: 1.0,
      volume: 0.8,
      stability: 0.8,
      clarity: 0.85,
      style: 0.4,
      useSpeakerBoost: false,
    },
    emotionMappings: {
      understanding: { stability: 0.85, style: 0.35, speed: 0.9 },
      encouraging: { stability: 0.8, style: 0.45, speed: 0.95 },
      curious: { stability: 0.75, style: 0.5, speed: 1.0 },
      gentle: { stability: 0.85, style: 0.3, speed: 0.9 },
      calm: { stability: 0.9, style: 0.25, speed: 0.85 },
      excited: { stability: 0.7, style: 0.6, speed: 1.05 },
      playful: { stability: 0.7, style: 0.55, speed: 1.0 },
      reassuring: { stability: 0.9, style: 0.3, speed: 0.85 },
    },
    sampleAudioUrl: '/audio/samples/tally-sample.mp3',
  },

  tumble: {
    characterId: 'tumble',
    voiceId: 'AZnzlk1XvdvUeBnXmlld', // Domi - warm, empathetic
    name: 'Tumble',
    description: 'Empathetic and intuitive voice with gentle warmth',
    personality: {
      traits: ['empathetic', 'intuitive', 'persistent', 'warm'],
      speakingStyle: 'gentle and supportive with emotional depth',
      emotionalRange: ['gentle', 'reassuring', 'understanding', 'encouraging'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 0.9,
      pitch: 0.95,
      volume: 0.8,
      stability: 0.8,
      clarity: 0.8,
      style: 0.45,
      useSpeakerBoost: false,
    },
    emotionMappings: {
      gentle: { stability: 0.9, style: 0.3, speed: 0.85 },
      reassuring: { stability: 0.9, style: 0.35, speed: 0.85 },
      understanding: { stability: 0.85, style: 0.4, speed: 0.9 },
      encouraging: { stability: 0.8, style: 0.5, speed: 0.9 },
      calm: { stability: 0.9, style: 0.25, speed: 0.8 },
      curious: { stability: 0.75, style: 0.55, speed: 0.95 },
      excited: { stability: 0.7, style: 0.65, speed: 1.0 },
      playful: { stability: 0.75, style: 0.6, speed: 0.95 },
    },
    sampleAudioUrl: '/audio/samples/tumble-sample.mp3',
  },

  echo: {
    characterId: 'echo',
    voiceId: 'TxGEqnHWrfWFTfGW9XjX', // Josh - quick, observant
    name: 'Echo',
    description: 'Quick-thinking voice with sharp observation skills',
    personality: {
      traits: ['quick-thinking', 'observant', 'resilient', 'adaptive'],
      speakingStyle: 'alert and responsive with quick delivery',
      emotionalRange: ['curious', 'excited', 'understanding', 'encouraging'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 1.05,
      pitch: 1.05,
      volume: 0.8,
      stability: 0.7,
      clarity: 0.8,
      style: 0.5,
      useSpeakerBoost: false,
    },
    emotionMappings: {
      curious: { stability: 0.7, style: 0.6, speed: 1.1 },
      excited: { stability: 0.65, style: 0.7, speed: 1.15 },
      understanding: { stability: 0.8, style: 0.45, speed: 1.0 },
      encouraging: { stability: 0.75, style: 0.55, speed: 1.05 },
      calm: { stability: 0.85, style: 0.35, speed: 0.95 },
      gentle: { stability: 0.85, style: 0.4, speed: 0.9 },
      playful: { stability: 0.7, style: 0.65, speed: 1.1 },
      reassuring: { stability: 0.85, style: 0.4, speed: 0.95 },
    },
    sampleAudioUrl: '/audio/samples/echo-sample.mp3',
  },

  sway: {
    characterId: 'sway',
    voiceId: 'onwK4e9ZLuTAKqWW03F9', // Daniel - emotionally intelligent
    name: 'Sway',
    description: 'Emotionally intelligent voice with reflective depth',
    personality: {
      traits: ['emotionally-intelligent', 'reflective', 'supportive', 'wise'],
      speakingStyle: 'thoughtful and emotionally aware',
      emotionalRange: ['understanding', 'reassuring', 'gentle', 'calm'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 0.9,
      pitch: 0.95,
      volume: 0.8,
      stability: 0.85,
      clarity: 0.8,
      style: 0.4,
      useSpeakerBoost: false,
    },
    emotionMappings: {
      understanding: { stability: 0.9, style: 0.35, speed: 0.85 },
      reassuring: { stability: 0.9, style: 0.3, speed: 0.8 },
      gentle: { stability: 0.9, style: 0.25, speed: 0.8 },
      calm: { stability: 0.95, style: 0.2, speed: 0.75 },
      encouraging: { stability: 0.85, style: 0.45, speed: 0.9 },
      curious: { stability: 0.8, style: 0.5, speed: 0.95 },
      excited: { stability: 0.75, style: 0.6, speed: 1.0 },
      playful: { stability: 0.8, style: 0.55, speed: 0.95 },
    },
    sampleAudioUrl: '/audio/samples/sway-sample.mp3',
  },

  ponder: {
    characterId: 'ponder',
    voiceId: 'CYw3kZ02Hs0563khs1Fj', // Dave - wise, adaptive
    name: 'Ponder',
    description: 'Wise and adaptive voice with transformative insights',
    personality: {
      traits: ['wise', 'adaptive', 'transformative', 'patient'],
      speakingStyle: 'measured and insightful with wisdom',
      emotionalRange: ['calm', 'understanding', 'gentle', 'reassuring'],
    },
    defaultSettings: {
      provider: 'elevenlabs',
      quality: 'medium',
      speed: 0.85,
      pitch: 0.9,
      volume: 0.8,
      stability: 0.9,
      clarity: 0.85,
      style: 0.3,
      useSpeakerBoost: false,
    },
    emotionMappings: {
      calm: { stability: 0.95, style: 0.2, speed: 0.8 },
      understanding: { stability: 0.9, style: 0.3, speed: 0.85 },
      gentle: { stability: 0.95, style: 0.25, speed: 0.8 },
      reassuring: { stability: 0.95, style: 0.25, speed: 0.8 },
      encouraging: { stability: 0.85, style: 0.4, speed: 0.9 },
      curious: { stability: 0.8, style: 0.45, speed: 0.9 },
      excited: { stability: 0.75, style: 0.55, speed: 0.95 },
      playful: { stability: 0.8, style: 0.5, speed: 0.9 },
    },
    sampleAudioUrl: '/audio/samples/ponder-sample.mp3',
  },
};

/**
 * Get voice model for a specific character
 */
export function getCharacterVoiceModel(characterId: MunchieCharacter): CharacterVoice {
  return CHARACTER_VOICE_MODELS[characterId];
}

/**
 * Get all available character voice models
 */
export function getAllCharacterVoiceModels(): CharacterVoice[] {
  return Object.values(CHARACTER_VOICE_MODELS);
}

/**
 * Get voice settings for a character with specific emotion
 */
export function getVoiceSettingsForEmotion(
  characterId: MunchieCharacter, 
  emotion: EmotionType
): CharacterVoice['defaultSettings'] {
  const voiceModel = CHARACTER_VOICE_MODELS[characterId];
  const emotionSettings = voiceModel.emotionMappings[emotion] || {};
  
  return {
    ...voiceModel.defaultSettings,
    ...emotionSettings,
  };
}

/**
 * Validate character voice configuration
 */
export function validateVoiceModel(voiceModel: CharacterVoice): string[] {
  const errors: string[] = [];
  
  if (!voiceModel.characterId) {
    errors.push('Character ID is required');
  }
  
  if (!voiceModel.voiceId) {
    errors.push('Voice ID is required');
  }
  
  if (!voiceModel.name) {
    errors.push('Voice name is required');
  }
  
  // Validate settings ranges
  const settings = voiceModel.defaultSettings;
  if (settings.speed < 0.25 || settings.speed > 4.0) {
    errors.push('Speed must be between 0.25 and 4.0');
  }
  
  if (settings.pitch < 0.5 || settings.pitch > 2.0) {
    errors.push('Pitch must be between 0.5 and 2.0');
  }
  
  if (settings.volume < 0 || settings.volume > 1) {
    errors.push('Volume must be between 0 and 1');
  }
  
  if (settings.stability < 0 || settings.stability > 1) {
    errors.push('Stability must be between 0 and 1');
  }
  
  if (settings.clarity < 0 || settings.clarity > 1) {
    errors.push('Clarity must be between 0 and 1');
  }
  
  return errors;
}

/**
 * Create a custom voice model for testing
 */
export function createCustomVoiceModel(
  characterId: MunchieCharacter,
  voiceId: string,
  overrides: Partial<CharacterVoice> = {}
): CharacterVoice {
  const baseModel = CHARACTER_VOICE_MODELS[characterId];
  
  return {
    ...baseModel,
    voiceId,
    ...overrides,
  };
}