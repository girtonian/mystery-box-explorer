/**
 * Audio queue management for seamless voice playback
 * Handles audio buffering, queuing, and smooth transitions
 */

import type { VoiceSynthesisResponse } from '@/types';

export interface QueuedAudio {
  id: string;
  audio: VoiceSynthesisResponse;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  addedAt?: number;
  playedAt?: number;
  completedAt?: number;
  onStart?: () => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface AudioQueueConfig {
  maxQueueSize: number;
  preloadNext: boolean;
  crossfadeDuration: number; // milliseconds
  gapBetweenAudio: number; // milliseconds
}

export class AudioQueue {
  private queue: QueuedAudio[] = [];
  private currentAudio: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  private config: AudioQueueConfig;
  private onPlaybackComplete?: () => void;
  private onPlaybackError?: (error: Error) => void;

  constructor(config: AudioQueueConfig) {
    this.config = config;
  }

  /**
   * Add audio to the queue
   */
  addToQueue(queuedAudio: QueuedAudio): string {
    const audioWithTimestamp: QueuedAudio = {
      ...queuedAudio,
      addedAt: Date.now(),
    };

    // Insert based on priority
    const insertIndex = this.findInsertIndex(audioWithTimestamp.priority);
    this.queue.splice(insertIndex, 0, audioWithTimestamp);

    // Trim queue if too large
    if (this.queue.length > this.config.maxQueueSize) {
      const removed = this.queue.splice(this.config.maxQueueSize);
      console.warn(`Audio queue full, removed ${removed.length} items`);
    }

    console.log(`Added audio to queue: ${audioWithTimestamp.audio.text.slice(0, 50)}... (Priority: ${audioWithTimestamp.priority})`);

    // Start playing if not already playing
    if (!this.isPlaying && !this.isPaused) {
      this.playNext();
    }

    return audioWithTimestamp.id;
  }

  /**
   * Start playing the queue
   */
  async play(): Promise<void> {
    if (this.isPlaying) {
      console.warn('Audio queue is already playing');
      return;
    }

    this.isPaused = false;
    await this.playNext();
  }

  /**
   * Pause the queue
   */
  pause(): void {
    this.isPaused = true;
    
    if (this.currentAudio) {
      this.currentAudio.pause();
    }
    
    console.log('Audio queue paused');
  }

  /**
   * Resume the queue
   */
  resume(): void {
    if (!this.isPaused) {
      console.warn('Audio queue is not paused');
      return;
    }

    this.isPaused = false;
    
    if (this.currentAudio) {
      this.currentAudio.play().catch(error => {
        console.error('Failed to resume audio:', error);
        this.onPlaybackError?.(error);
      });
    } else {
      this.playNext();
    }
    
    console.log('Audio queue resumed');
  }

  /**
   * Stop the queue and clear all audio
   */
  stop(): void {
    this.isPlaying = false;
    this.isPaused = false;
    
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    this.queue = [];
    console.log('Audio queue stopped and cleared');
  }

  /**
   * Clear the queue but keep playing current audio
   */
  clear(): void {
    this.queue = [];
    console.log('Audio queue cleared');
  }

  /**
   * Skip to the next audio in queue
   */
  skipToNext(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
    
    this.playNext();
  }

  /**
   * Remove specific audio from queue
   */
  removeFromQueue(audioId: string): boolean {
    const index = this.queue.findIndex(item => item.id === audioId);
    
    if (index !== -1) {
      this.queue.splice(index, 1);
      console.log(`Removed audio from queue: ${audioId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Get queue status
   */
  getStatus(): {
    isPlaying: boolean;
    isPaused: boolean;
    queueLength: number;
    currentAudio?: QueuedAudio;
    estimatedTimeRemaining: number;
  } {
    const currentItem = this.queue[0];
    const estimatedTimeRemaining = this.queue.reduce((total, item) => {
      return total + item.audio.duration;
    }, 0);

    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      queueLength: this.queue.length,
      currentAudio: currentItem,
      estimatedTimeRemaining,
    };
  }

  /**
   * Set playback event handlers
   */
  setEventHandlers(
    onComplete?: () => void,
    onError?: (error: Error) => void
  ): void {
    this.onPlaybackComplete = onComplete;
    this.onPlaybackError = onError;
  }

  /**
   * Play the next audio in queue
   */
  private async playNext(): Promise<void> {
    if (this.isPaused || this.queue.length === 0) {
      this.isPlaying = false;
      this.onPlaybackComplete?.();
      return;
    }

    const nextItem = this.queue.shift();
    if (!nextItem) {
      this.isPlaying = false;
      this.onPlaybackComplete?.();
      return;
    }

    this.isPlaying = true;
    nextItem.playedAt = Date.now();

    try {
      await this.playAudioItem(nextItem);
      nextItem.completedAt = Date.now();
      
      // Add gap between audio if configured
      if (this.config.gapBetweenAudio > 0) {
        await this.delay(this.config.gapBetweenAudio);
      }
      
      // Continue to next audio
      this.playNext();
      
    } catch (error) {
      console.error('Failed to play audio:', error);
      if (nextItem.onError) {
        nextItem.onError(error instanceof Error ? error : new Error('Audio playback failed'));
      }
      this.onPlaybackError?.(error instanceof Error ? error : new Error('Audio playback failed'));
      
      // Continue to next audio even if this one failed
      this.playNext();
    }
  }

  /**
   * Play a single audio item
   */
  private async playAudioItem(item: QueuedAudio): Promise<void> {
    return new Promise((resolve, reject) => {
      const audio = new Audio(item.audio.audioUrl);
      this.currentAudio = audio;

      // Set volume based on character settings
      audio.volume = item.audio.characterId ? 0.8 : 0.8; // Could be character-specific

      // Call onStart callback
      if (item.onStart) {
        item.onStart();
      }

      audio.addEventListener('ended', () => {
        if (item.onComplete) {
          item.onComplete();
        }
        resolve();
      });

      audio.addEventListener('error', (event) => {
        const error = new Error(`Audio playback error: ${event.type}`);
        if (item.onError) {
          item.onError(error);
        }
        reject(error);
      });

      // Handle pause/resume
      const checkPaused = () => {
        if (this.isPaused) {
          audio.pause();
          
          // Wait for resume
          const resumeCheck = setInterval(() => {
            if (!this.isPaused) {
              clearInterval(resumeCheck);
              audio.play().catch(error => {
                if (item.onError) {
                  item.onError(error);
                }
                reject(error);
              });
            }
          }, 100);
        }
      };

      audio.addEventListener('play', checkPaused);

      // Start playback
      audio.play().catch(error => {
        if (item.onError) {
          item.onError(error);
        }
        reject(error);
      });
      
      console.log(`Playing audio: ${item.audio.text.slice(0, 50)}...`);
    });
  }

  /**
   * Find the correct insertion index based on priority
   */
  private findInsertIndex(priority: QueuedAudio['priority']): number {
    const priorityOrder = { urgent: 0, high: 1, normal: 2, low: 3 };
    const targetPriority = priorityOrder[priority];

    for (let i = 0; i < this.queue.length; i++) {
      const itemPriority = priorityOrder[this.queue[i].priority];
      if (itemPriority > targetPriority) {
        return i;
      }
    }

    return this.queue.length;
  }

  /**
   * Utility delay function
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Preload next audio for smoother playback
   */
  private preloadNext(): void {
    if (!this.config.preloadNext || this.queue.length === 0) {
      return;
    }

    const nextItem = this.queue[0];
    if (nextItem) {
      // Create audio element to trigger preload
      const preloadAudio = new Audio(nextItem.audio.audioUrl);
      preloadAudio.preload = 'auto';
      preloadAudio.load();
    }
  }
}

// Default configuration
export const DEFAULT_AUDIO_QUEUE_CONFIG: AudioQueueConfig = {
  maxQueueSize: 10,
  preloadNext: true,
  crossfadeDuration: 200,
  gapBetweenAudio: 500,
};

// Create default instance
export const audioQueue = new AudioQueue(DEFAULT_AUDIO_QUEUE_CONFIG);