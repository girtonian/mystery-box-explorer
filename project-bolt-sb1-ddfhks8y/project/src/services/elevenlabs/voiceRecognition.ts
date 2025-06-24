/**
 * Voice recognition service for Curmunchkins interactions
 * Handles speech-to-text for child voice responses
 */

import type { 
  SpeechRecognitionConfig, 
  SpeechRecognitionResult,
  VoiceCommand 
} from '@/types';

export interface RecognitionOptions {
  expectedPhrases?: string[];
  timeout?: number;
  childFriendly?: boolean;
}

export class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor() {
    this.initializeRecognition();
  }

  /**
   * Initialize speech recognition
   */
  private initializeRecognition(): void {
    try {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        return;
      }

      this.recognition = new SpeechRecognition();
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
    }
  }

  /**
   * Configure speech recognition settings
   */
  private setupRecognitionConfig(config: SpeechRecognitionConfig): void {
    if (!this.recognition) return;

    this.recognition.lang = config.language;
    this.recognition.continuous = config.continuous;
    this.recognition.interimResults = config.interimResults;
    this.recognition.maxAlternatives = config.maxAlternatives;

    // Child-friendly optimizations
    if (config.childFriendly) {
      // Increase timeout for children who may speak more slowly
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
    }
  }

  /**
   * Create a child-friendly recognition config
   */
  createChildFriendlyConfig(): SpeechRecognitionConfig {
    return {
      language: 'en-US',
      continuous: false,
      interimResults: true,
      maxAlternatives: 3,
      timeout: 10000, // Longer timeout for children
      childFriendly: true,
      expectedPhrases: [],
    };
  }

  /**
   * Start listening for speech
   */
  async startListening(
    config: SpeechRecognitionConfig,
    options: RecognitionOptions = {}
  ): Promise<SpeechRecognitionResult> {
    if (!this.recognition) {
      throw new Error('Speech recognition not available');
    }

    if (this.isListening) {
      this.stopListening();
    }

    this.setupRecognitionConfig(config);

    return new Promise((resolve, reject) => {
      if (!this.recognition) {
        reject(new Error('Speech recognition not initialized'));
        return;
      }

      let timeoutId: number | undefined;
      let finalResult: SpeechRecognitionResult | null = null;

      // Set up event handlers
      this.recognition.onstart = () => {
        this.isListening = true;
        console.log('Speech recognition started');
        
        // Set timeout
        if (options.timeout) {
          timeoutId = window.setTimeout(() => {
            this.stopListening();
            if (finalResult) {
              resolve(finalResult);
            } else {
              reject(new Error('Speech recognition timeout'));
            }
          }, options.timeout);
        }
      };

      this.recognition.onresult = (event) => {
        const result = event.results[0];
        const alternatives = [];
        
        for (let j = 0; j < result.length; j++) {
          alternatives.push({
            transcript: result[j].transcript,
            confidence: result[j].confidence,
          });
        }

        const recognitionResult: SpeechRecognitionResult = {
          transcript: result[0].transcript,
          confidence: result[0].confidence,
          isFinal: result.isFinal,
          alternatives,
          timestamp: Date.now(),
          duration: 0, // Will be calculated when final
        };

        // If we have a final result, save it
        if (result.isFinal) {
          finalResult = recognitionResult;
          
          // If we have expected phrases, check if we match any
          if (options.expectedPhrases && options.expectedPhrases.length > 0) {
            const match = this.matchExpectedResponse(
              recognitionResult.transcript, 
              options.expectedPhrases
            );
            
            if (match.matched) {
              // We found a match, stop listening and resolve
              this.stopListening();
              if (timeoutId) clearTimeout(timeoutId);
              resolve(recognitionResult);
            }
          }
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (timeoutId) clearTimeout(timeoutId);
        
        const errorMessage = this.getErrorMessage(event.error);
        console.error('Speech recognition error:', errorMessage);
        reject(new Error(errorMessage));
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (timeoutId) clearTimeout(timeoutId);
        
        console.log('Speech recognition ended');
        
        // If we have a final result, resolve with it
        if (finalResult) {
          resolve(finalResult);
        } else {
          // Otherwise, reject with a timeout error
          reject(new Error('No speech detected'));
        }
      };

      // Start recognition
      try {
        this.recognition.start();
      } catch (error) {
        this.isListening = false;
        if (timeoutId) clearTimeout(timeoutId);
        
        const errorMessage = error instanceof Error ? error.message : 'Failed to start recognition';
        reject(new Error(errorMessage));
      }
    });
  }

  /**
   * Stop listening for speech
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      console.log('Speech recognition stopped');
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening;
  }

  /**
   * Check if speech recognition is supported
   */
  isSupported(): boolean {
    return !!(window.SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  /**
   * Test microphone access
   */
  async testMicrophone(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone access test failed:', error);
      return false;
    }
  }

  /**
   * Process voice command
   */
  processVoiceCommand(transcript: string): VoiceCommand | null {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    // Define command mappings
    const commandMappings: Record<string, VoiceCommand> = {
      'play': 'play',
      'start': 'play',
      'begin': 'play',
      'pause': 'pause',
      'stop': 'stop',
      'repeat': 'repeat',
      'again': 'repeat',
      'next': 'next',
      'continue': 'next',
      'previous': 'previous',
      'back': 'previous',
      'louder': 'louder',
      'volume up': 'louder',
      'quieter': 'quieter',
      'volume down': 'quieter',
      'faster': 'faster',
      'speed up': 'faster',
      'slower': 'slower',
      'slow down': 'slower',
      'help': 'help',
      'menu': 'menu',
      'settings': 'settings',
      'exit': 'exit',
      'quit': 'exit',
    };

    // Check for exact matches first
    if (commandMappings[normalizedTranscript]) {
      return commandMappings[normalizedTranscript];
    }

    // Check for partial matches
    for (const [phrase, command] of Object.entries(commandMappings)) {
      if (normalizedTranscript.includes(phrase)) {
        return command;
      }
    }

    return null;
  }

  /**
   * Match transcript against expected responses
   */
  matchExpectedResponse(
    transcript: string, 
    expectedResponses: string[]
  ): { matched: boolean; confidence: number; matchedResponse?: string } {
    const normalizedTranscript = transcript.toLowerCase().trim();
    
    for (const expected of expectedResponses) {
      const normalizedExpected = expected.toLowerCase().trim();
      
      // Exact match
      if (normalizedTranscript === normalizedExpected) {
        return { matched: true, confidence: 1.0, matchedResponse: expected };
      }
      
      // Partial match
      if (normalizedTranscript.includes(normalizedExpected) || 
          normalizedExpected.includes(normalizedTranscript)) {
        const confidence = Math.max(
          normalizedTranscript.length / normalizedExpected.length,
          normalizedExpected.length / normalizedTranscript.length
        );
        
        if (confidence > 0.6) {
          return { matched: true, confidence, matchedResponse: expected };
        }
      }
      
      // Fuzzy match for common child speech patterns
      const similarity = this.calculateSimilarity(normalizedTranscript, normalizedExpected);
      if (similarity > 0.7) {
        return { matched: true, confidence: similarity, matchedResponse: expected };
      }
    }
    
    return { matched: false, confidence: 0 };
  }

  /**
   * Calculate string similarity for fuzzy matching
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
    
    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * Get user-friendly error message
   */
  private getErrorMessage(error: string): string {
    const errorMessages: Record<string, string> = {
      'no-speech': 'No speech was detected. Please try speaking clearly.',
      'audio-capture': 'Microphone access failed. Please check your microphone.',
      'not-allowed': 'Microphone permission denied. Please allow microphone access.',
      'network': 'Network error occurred. Please check your connection.',
      'service-not-allowed': 'Speech recognition service not available.',
      'bad-grammar': 'Speech was not recognized. Please try again.',
      'language-not-supported': 'Language not supported for speech recognition.',
    };

    return errorMessages[error] || `Speech recognition error: ${error}`;
  }
}

// Create default instance
export const voiceRecognitionService = new VoiceRecognitionService();