/**
 * Central export point for voice features
 * Provides unified access to voice components and hooks
 */

// Export components
export { default as VoiceControls } from './VoiceControls';
export { default as VoiceVisualizer } from './VoiceVisualizer';
export { default as VoiceSettings } from './VoiceSettings';
export { default as SpeedControl } from './SpeedControl';

// Export hooks
export { default as useVoicePlayer } from './useVoicePlayer';
export { default as useVoiceRecognition } from './useVoiceRecognition';

// Export types
export type { VoicePlayerOptions } from './useVoicePlayer';
export type { VoiceRecognitionOptions } from './useVoiceRecognition';

// Re-export types from the main types directory
export type { VoiceSettings } from '@/types';