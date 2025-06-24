/**
 * Story narration hook for coordinating voice playback with story progression
 * Handles voice synthesis, playback control, and interaction timing
 */

import { useState, useEffect, useCallback } from 'react';
import { useVoiceStore } from '@/stores';
import type { StoryNode, StorySegment, MunchieCharacter, EmotionType } from '@/types';

export interface NarrationOptions {
  autoPlay?: boolean;
  pauseBetweenSegments?: boolean;
  pauseDuration?: number; // milliseconds
  onSegmentStart?: (segment: StorySegment) => void;
  onSegmentComplete?: (segment: StorySegment) => void;
  onNarrationComplete?: () => void;
  onError?: (error: Error) => void;
}

export const useStoryNarration = (
  characterId: MunchieCharacter,
  currentNode: StoryNode | null,
  options: NarrationOptions = {}
) => {
  const {
    isPlaying,
    isPaused,
    playbackProgress,
    playStorySegment,
    pauseNarration,
    resumeNarration,
    stopNarration,
  } = useVoiceStore();

  const [isNarrating, setIsNarrating] = useState(false);
  const [currentSegment, setCurrentSegment] = useState<StorySegment | null>(null);
  const [segmentQueue, setSegmentQueue] = useState<StorySegment[]>([]);
  const [error, setError] = useState<Error | null>(null);

  // Auto-play when node changes
  useEffect(() => {
    if (currentNode && options.autoPlay && !isNarrating) {
      playSegment(currentNode.content);
    }
  }, [currentNode, options.autoPlay]);

  // Handle playback completion
  useEffect(() => {
    if (playbackProgress === 100 && isNarrating) {
      handleSegmentComplete();
    }
  }, [playbackProgress, isNarrating]);

  // Play a story segment
  const playSegment = useCallback(async (segment: StorySegment) => {
    setIsNarrating(true);
    setCurrentSegment(segment);
    setError(null); 
    
    try {
      if (options.onSegmentStart) {
        options.onSegmentStart(segment);
      }
      
      const result = await playStorySegment({
        text: segment.text,
        characterId,
        emotion: segment.voiceEmotion,
      });
      
      return result;
    } catch (error) {
      console.error('Failed to play segment:', error);
      setError(error instanceof Error ? error : new Error('Unknown error'));
      setIsNarrating(false);
      
      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error('Unknown error'));
      }
      
      return false;
    }
  }, [characterId, playStorySegment, options]);

  // Queue multiple segments for sequential playback
  const queueSegments = useCallback((segments: StorySegment[]) => {
    setSegmentQueue(prev => [...prev, ...segments]);
    
    // Start playing if not already narrating
    if (!isNarrating && segments.length > 0) {
      playSegment(segments[0]);
    }
  }, [isNarrating, playSegment]);

  // Handle segment completion
  const handleSegmentComplete = useCallback(() => {
    if (!currentSegment) return;
    
    if (options.onSegmentComplete) {
      options.onSegmentComplete(currentSegment);
    }
    
    // Check if there are more segments in the queue
    if (segmentQueue.length > 0) {
      const nextSegments = [...segmentQueue];
      const nextSegment = nextSegments.shift()!;
      setSegmentQueue(nextSegments);
      
      // Add pause between segments if enabled
      if (options.pauseBetweenSegments) {
        setIsNarrating(false);
        setTimeout(() => {
          playSegment(nextSegment);
        }, options.pauseDuration || 1000);
      } else {
        playSegment(nextSegment);
      }
    } else {
      setIsNarrating(false);
      setCurrentSegment(null);
      
      if (options.onNarrationComplete) {
        options.onNarrationComplete();
      }
    }
  }, [currentSegment, segmentQueue, options, playSegment]);

  // Pause narration
  const pauseNarrationWithState = useCallback(() => {
    pauseNarration();
  }, [pauseNarration]);

  // Resume narration
  const resumeNarrationWithState = useCallback(() => {
    resumeNarration();
  }, [resumeNarration]);

  // Stop narration
  const stopNarrationWithState = useCallback(() => {
    stopNarration();
    setIsNarrating(false);
    setCurrentSegment(null);
    setSegmentQueue([]);
  }, [stopNarration]);

  // Skip to next segment
  const skipToNextSegment = useCallback(() => {
    stopNarration();
    handleSegmentComplete();
  }, [stopNarration, handleSegmentComplete]);

  // Replay current segment
  const replayCurrentSegment = useCallback(() => {
    if (currentSegment) {
      stopNarration();
      playSegment(currentSegment);
    }
  }, [currentSegment, stopNarration, playSegment]);

  return {
    // State
    isNarrating,
    isPlaying,
    isPaused,
    currentSegment,
    segmentQueue,
    playbackProgress,
    error,
    
    // Controls
    playSegment,
    queueSegments,
    pauseNarration: pauseNarrationWithState,
    resumeNarration: resumeNarrationWithState,
    stopNarration: stopNarrationWithState,
    skipToNextSegment,
    replayCurrentSegment,
  };
};

export default useStoryNarration;