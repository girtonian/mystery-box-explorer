/**
 * Voice synthesis service for Curmunchkins characters
 * Handles text-to-speech generation with character-specific voices
 */

import { elevenLabsClient } from './client';
import { getCharacterVoiceModel } from './voiceModels';
import { audioQueue } from './audioQueue';
import type { 
  VoiceSettings, 
  CharacterVoice, 
  VoiceSynthesisRequest, 
  VoiceSynthesisResponse,
  MunchieCharacter,
  EmotionType 
} from '@/types';

export interface SynthesisOptions {
  cacheKey?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export class VoiceSynthesisService {
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initializeAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  private initializeAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
    }
  }

  /**
   * Synthesize speech for a character
   */
  async synthesizeSpeech(request: VoiceSynthesisRequest, options: SynthesisOptions = {}): Promise<VoiceSynthesisResponse> {
    try {
      const characterVoice = getCharacterVoiceModel(request.characterId);
      if (!characterVoice) {
        throw new Error(`Voice not found for character: ${request.characterId}`);
      }

      // Merge settings with character defaults and emotion mappings
      const emotionSettings = characterVoice.emotionMappings[request.emotion] || {};
      const finalSettings = {
        ...characterVoice.defaultSettings,
        ...request.settings,
        ...emotionSettings,
      };

      // Prepare ElevenLabs request
      const synthesisRequest = {
        text: request.text,
        voice_id: characterVoice.voiceId,
        model_id: import.meta.env.VITE_ELEVENLABS_MODEL || 'eleven_monolingual_v1',
        voice_settings: {
          stability: finalSettings.stability,
          similarity_boost: finalSettings.clarity,
          style: finalSettings.style,
          use_speaker_boost: finalSettings.useSpeakerBoost,
        },
      };

      // Generate audio
      const audioBuffer = await elevenLabsClient.synthesizeSpeech(synthesisRequest);
      
      // Create audio URL
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Calculate duration (approximate)
      const duration = this.estimateAudioDuration(request.text, finalSettings.speed);

      const response: VoiceSynthesisResponse = {
        audioUrl,
        audioBuffer,
        duration,
        characterId: request.characterId,
        emotion: request.emotion,
        text: request.text,
        generatedAt: Date.now(),
        cacheKey: options.cacheKey,
      };

      console.log(`Generated speech for ${request.characterId}: "${request.text.slice(0, 50)}..."`);
      return response;

    } catch (error) {
      console.error('Voice synthesis failed:', error);
      throw new Error(`Failed to synthesize speech for ${request.characterId}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Play synthesized audio with the audio queue
   */
  async playSynthesizedSpeech(
    response: VoiceSynthesisResponse,
    options: {
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      onStart?: () => void;
      onComplete?: () => void;
      onError?: (error: Error) => void;
    } = {}
  ): Promise<string> {
    const audioId = crypto.randomUUID();
    
    audioQueue.addToQueue({
      id: audioId,
      audio: response,
      priority: options.priority || 'normal',
      onStart: options.onStart,
      onComplete: options.onComplete,
      onError: options.onError,
    });
    
    return audioId;
  }

  /**
   * Test voice synthesis with a simple message
   */
  async testVoice(characterId: MunchieCharacter, emotion: EmotionType = 'gentle'): Promise<boolean> {
    try {
      const testText = "Hello! I'm ready to tell you a story.";
      
      const response = await this.synthesizeSpeech({
        text: testText,
        characterId,
        emotion,
        priority: 'low',
      });
      
      console.log(`Voice test successful for ${characterId}`);
      return true;
    } catch (error) {
      console.error(`Voice test failed for ${characterId}:`, error);
      return false;
    }
  }

  /**
   * Estimate audio duration based on text length and speed
   */
  private estimateAudioDuration(text: string, speed: number = 1.0): number {
    // Average speaking rate is about 150 words per minute
    const wordsPerMinute = 150 * speed;
    const wordCount = text.split(/\s+/).length;
    const durationMinutes = wordCount / wordsPerMinute;
    return Math.round(durationMinutes * 60 * 1000); // Convert to milliseconds
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }
    
    // Clear any cached audio URLs
    elevenLabsClient.clearCache();
  }
}

// Create singleton instance
export const voiceSynthesisService = new VoiceSynthesisService();