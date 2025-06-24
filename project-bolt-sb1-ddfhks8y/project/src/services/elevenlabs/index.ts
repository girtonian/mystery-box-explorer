/**
 * Central export point for ElevenLabs voice services
 * Provides unified access to voice synthesis and recognition
 */

// Export client and services
export { elevenLabsClient, DEFAULT_ELEVENLABS_CONFIG } from './client';
export { voiceSynthesisService } from './voiceSynthesis';
export { voiceRecognitionService } from './voiceRecognition';
export { audioQueue } from './audioQueue';
export { 
  getCharacterVoiceModel, 
  getAllCharacterVoiceModels,
  getVoiceSettingsForEmotion,
  validateVoiceModel,
  createCustomVoiceModel
} from './voiceModels';

// Export types for convenience
export type { ElevenLabsConfig, VoiceModel, SynthesisRequest, SynthesisResponse } from './client';
export type { SynthesisOptions } from './voiceSynthesis';
export type { RecognitionOptions } from './voiceRecognition';
export type { QueuedAudio, AudioQueueConfig } from './audioQueue';

/**
 * Initialize ElevenLabs services
 * Call this once when the app starts
 */
export async function initializeElevenLabsServices(): Promise<void> {
  try {
    console.log('Initializing ElevenLabs voice services...');
    
    // Check if API key is available
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.warn('ElevenLabs API key not found. Voice features will use mock data.');
    }
    
    // Test voice synthesis with a simple message
    if (apiKey) {
      const { voiceSynthesisService } = await import('./voiceSynthesis');
      await voiceSynthesisService.testVoice('silo', 'gentle');
      console.log('Voice synthesis test successful');
    }
    
    // Test speech recognition if supported
    const { voiceRecognitionService } = await import('./voiceRecognition');
    if (voiceRecognitionService.isSupported()) {
      const micAccess = await voiceRecognitionService.testMicrophone().catch(() => false);
      console.log(`Microphone access: ${micAccess ? 'granted' : 'denied'}`);
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
    
    console.log('ElevenLabs services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize ElevenLabs services:', error);
    throw new Error('ElevenLabs services initialization failed');
  }
}

/**
 * Clean up ElevenLabs services
 * Call this when the app is about to unload
 */
export function cleanupElevenLabsServices(): void {
  try {
    // Stop any ongoing audio playback
    const { audioQueue } = require('./audioQueue');
    audioQueue.stop();
    
    // Clear voice synthesis cache
    const { elevenLabsClient } = require('./client');
    elevenLabsClient.clearCache();
    
    // Stop any ongoing speech recognition
    const { voiceRecognitionService } = require('./voiceRecognition');
    voiceRecognitionService.stopListening();
    
    console.log('ElevenLabs services cleaned up');
  } catch (error) {
    console.error('Error during ElevenLabs services cleanup:', error);
  }
}

/**
 * Get voice service status
 */
export function getVoiceServiceStatus(): {
  apiKeyAvailable: boolean;
  recognitionSupported: boolean;
  cacheSize: number;
  queueStatus: {
    isPlaying: boolean;
    queueLength: number;
  };
} {
  const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;
  const { voiceRecognitionService } = require('./voiceRecognition');
  const { elevenLabsClient } = require('./client');
  const { audioQueue } = require('./audioQueue');
  
  const cacheStats = elevenLabsClient.getCacheStats();
  const queueStatus = audioQueue.getStatus();
  
  return {
    apiKeyAvailable: !!apiKey,
    recognitionSupported: voiceRecognitionService.isSupported(),
    cacheSize: cacheStats.size,
    queueStatus: {
      isPlaying: queueStatus.isPlaying,
      queueLength: queueStatus.queueLength,
    },
  };
}