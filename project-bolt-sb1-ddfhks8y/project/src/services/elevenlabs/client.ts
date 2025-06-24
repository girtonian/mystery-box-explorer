/**
 * ElevenLabs API client for Curmunchkins Mystery Box Explorer
 * Handles voice synthesis and speech recognition for Munchie characters
 */

export interface ElevenLabsConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  retryAttempts: number;
}

export interface VoiceModel {
  voice_id: string;
  name: string;
  category: string;
  description: string;
  preview_url?: string;
  available_for_tiers: string[];
  settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export interface SynthesisRequest {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
  output_format?: 'mp3_44100_128' | 'pcm_16000' | 'pcm_22050' | 'pcm_24000' | 'pcm_44100';
}

export interface SynthesisResponse {
  audio_base64?: string;
  audio_url?: string;
  alignment?: {
    characters: string[];
    character_start_times_seconds: number[];
    character_end_times_seconds: number[];
  };
}

export class ElevenLabsClient {
  private config: ElevenLabsConfig;
  private cache: Map<string, ArrayBuffer> = new Map();

  constructor(config: ElevenLabsConfig) {
    this.config = config;
  }

  /**
   * Get available voices from ElevenLabs
   */
  async getVoices(): Promise<VoiceModel[]> {
    try {
      const response = await this.makeRequest('/v1/voices', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch voices: ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Failed to get voices:', error);
      throw new Error('Unable to fetch available voices');
    }
  }

  /**
   * Synthesize speech from text
   */
  async synthesizeSpeech(request: SynthesisRequest): Promise<ArrayBuffer> {
    try {
      // Check cache first
      const cacheKey = this.generateCacheKey(request);
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('Using cached audio for:', request.text.slice(0, 50));
        return cached;
      }

      // Check if API key is available
      if (!this.config.apiKey) {
        console.warn('No ElevenLabs API key provided. Using mock audio.');
        return this.generateMockAudio();
      }

      const response = await this.makeRequest(`/v1/text-to-speech/${request.voice_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: request.text,
          model_id: request.model_id || 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: false,
            ...request.voice_settings,
          },
          output_format: request.output_format || 'mp3_44100_128',
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Synthesis failed: ${response.status} ${errorText}`);
      }

      const audioBuffer = await response.arrayBuffer();
      
      // Cache the result
      this.cache.set(cacheKey, audioBuffer);
      
      console.log(`Synthesized audio for: "${request.text.slice(0, 50)}..."`);
      return audioBuffer;

    } catch (error) {
      console.error('Speech synthesis failed:', error);
      
      // Return mock audio as fallback
      console.warn('Using mock audio as fallback');
      return this.generateMockAudio();
    }
  }

  /**
   * Generate mock audio for testing without API key
   */
  private generateMockAudio(): ArrayBuffer {
    // Create a simple sine wave audio buffer
    const sampleRate = 44100;
    const duration = 2; // seconds
    const numSamples = sampleRate * duration;
    const buffer = new ArrayBuffer(numSamples * 2); // 16-bit samples
    const view = new DataView(buffer);
    
    // Generate a simple sine wave
    for (let i = 0; i < numSamples; i++) {
      const value = Math.sin(i * 0.01) * 0x7FFF; // 16-bit amplitude
      view.setInt16(i * 2, value, true); // true = little endian
    }
    
    return buffer;
  }

  /**
   * Get voice settings for a specific voice
   */
  async getVoiceSettings(voiceId: string): Promise<VoiceModel['settings']> {
    try {
      const response = await this.makeRequest(`/v1/voices/${voiceId}/settings`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to get voice settings: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to get voice settings:', error);
      return {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0.5,
        use_speaker_boost: false,
      };
    }
  }

  /**
   * Check API quota and usage
   */
  async getUsage(): Promise<{
    character_count: number;
    character_limit: number;
    can_extend_character_limit: boolean;
    allowed_to_extend_character_limit: boolean;
    next_character_count_reset_unix: number;
  }> {
    try {
      const response = await this.makeRequest('/v1/user/subscription', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`Failed to get usage: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get usage:', error);
      // Return mock data for development
      return {
        character_count: 0,
        character_limit: 10000,
        can_extend_character_limit: false,
        allowed_to_extend_character_limit: false,
        next_character_count_reset_unix: Date.now() + 30 * 24 * 60 * 60 * 1000,
      };
    }
  }

  /**
   * Make authenticated request to ElevenLabs API
   */
  private async makeRequest(endpoint: string, options: RequestInit): Promise<Response> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    const headers = {
      'xi-api-key': this.config.apiKey,
      ...options.headers,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      throw error;
    }
  }

  /**
   * Generate cache key for audio caching
   */
  private generateCacheKey(request: SynthesisRequest): string {
    const settingsStr = JSON.stringify(request.voice_settings || {});
    return `${request.voice_id}-${request.text}-${settingsStr}`;
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    this.cache.clear();
    console.log('ElevenLabs audio cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Default configuration
export const DEFAULT_ELEVENLABS_CONFIG: ElevenLabsConfig = {
  apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
  baseUrl: 'https://api.elevenlabs.io',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
};

// Create singleton instance
export const elevenLabsClient = new ElevenLabsClient(DEFAULT_ELEVENLABS_CONFIG);