/**
 * User preferences storage and management service
 * Handles accessibility settings, sensory preferences, and privacy controls
 */

import { getDB } from './db';
import type { UserPreferences, AccessibilitySettings, ThemeMode } from '@/types';

/**
 * Save user preferences to IndexedDB
 */
export async function savePreferences(preferences: UserPreferences): Promise<void> {
  try {
    const db = await getDB();
    const updatedPreferences = {
      ...preferences,
      lastUpdated: Date.now(),
    };
    
    await db.put('preferences', updatedPreferences);
    console.log(`Preferences saved for user: ${preferences.userId}`);
  } catch (error) {
    console.error('Failed to save preferences:', error);
    throw new Error('Preferences saving failed');
  }
}

/**
 * Load user preferences from IndexedDB
 */
export async function loadPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const db = await getDB();
    const preferences = await db.get('preferences', userId);
    return preferences || null;
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return null;
  }
}

/**
 * Get default preferences for new users
 */
export function getDefaultPreferences(userId: string): UserPreferences {
  return {
    userId,
    accessibility: {
      voiceSpeed: 1.0,
      voicePitch: 1.0,
      voiceVolume: 0.8,
      fontSize: 'medium',
      visualContrast: 'normal', // Always default to normal contrast
      colorScheme: 'default',
      reduceMotion: false,
      reduceAnimations: false,
      simplifiedInterface: false,
      screenReaderOptimized: false,
    },
    story: {
      preferredCharacter: 'silo',
      favoriteAttachments: [],
      preferredStoryLength: 'medium',
      difficultyLevel: 'beginner',
      autoplay: true,
      pauseBetweenSegments: false,
      repeatPrompts: true,
    },
    interaction: {
      voiceInteraction: true,
      touchInteraction: true,
      keyboardNavigation: true,
      gestureControls: false,
      hapticFeedback: true,
      confirmationPrompts: true,
    },
    sensory: {
      preferredSensoryStrategies: [],
      sensoryBreakFrequency: 'medium',
      sensoryBreakDuration: 30,
      backgroundSounds: false,
      visualEffects: 'moderate',
    },
    lastUpdated: Date.now(),
  };
}

/**
 * Update specific accessibility settings
 */
export async function updateAccessibilitySettings(
  userId: string,
  updates: Partial<UserPreferences['accessibility']>
): Promise<void> {
  try {
    const existingPreferences = await loadPreferences(userId);
    const preferences = existingPreferences || getDefaultPreferences(userId);
    
    const updatedPreferences: UserPreferences = {
      ...preferences,
      accessibility: {
        ...preferences.accessibility,
        ...updates,
      },
      lastUpdated: Date.now(),
    };
    
    await savePreferences(updatedPreferences);
    console.log(`Accessibility settings updated for user: ${userId}`);
  } catch (error) {
    console.error('Failed to update accessibility settings:', error);
    throw new Error('Accessibility settings update failed');
  }
}

/**
 * Update story preferences
 */
export async function updateStoryPreferences(
  userId: string,
  updates: Partial<UserPreferences['story']>
): Promise<void> {
  try {
    const existingPreferences = await loadPreferences(userId);
    const preferences = existingPreferences || getDefaultPreferences(userId);
    
    const updatedPreferences: UserPreferences = {
      ...preferences,
      story: {
        ...preferences.story,
        ...updates,
      },
      lastUpdated: Date.now(),
    };
    
    await savePreferences(updatedPreferences);
    console.log(`Story preferences updated for user: ${userId}`);
  } catch (error) {
    console.error('Failed to update story preferences:', error);
    throw new Error('Story preferences update failed');
  }
}

/**
 * Update interaction preferences
 */
export async function updateInteractionPreferences(
  userId: string,
  updates: Partial<UserPreferences['interaction']>
): Promise<void> {
  try {
    const existingPreferences = await loadPreferences(userId);
    const preferences = existingPreferences || getDefaultPreferences(userId);
    
    const updatedPreferences: UserPreferences = {
      ...preferences,
      interaction: {
        ...preferences.interaction,
        ...updates,
      },
      lastUpdated: Date.now(),
    };
    
    await savePreferences(updatedPreferences);
    console.log(`Interaction preferences updated for user: ${userId}`);
  } catch (error) {
    console.error('Failed to update interaction preferences:', error);
    throw new Error('Interaction preferences update failed');
  }
}

/**
 * Update sensory preferences
 */
export async function updateSensoryPreferences(
  userId: string,
  updates: Partial<UserPreferences['sensory']>
): Promise<void> {
  try {
    const existingPreferences = await loadPreferences(userId);
    const preferences = existingPreferences || getDefaultPreferences(userId);
    
    const updatedPreferences: UserPreferences = {
      ...preferences,
      sensory: {
        ...preferences.sensory,
        ...updates,
      },
      lastUpdated: Date.now(),
    };
    
    await savePreferences(updatedPreferences);
    console.log(`Sensory preferences updated for user: ${userId}`);
  } catch (error) {
    console.error('Failed to update sensory preferences:', error);
    throw new Error('Sensory preferences update failed');
  }
}

/**
 * Apply system accessibility preferences (from browser/OS)
 */
export async function applySystemPreferences(userId: string): Promise<void> {
  try {
    const systemPrefs: Partial<UserPreferences['accessibility']> = {};
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      systemPrefs.reduceMotion = true;
      systemPrefs.reduceAnimations = true;
    }
    
    // Check for high contrast preference
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      systemPrefs.visualContrast = 'high';
    }
    
    // Check for color scheme preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Note: We don't automatically set dark mode for children's app
      // but we could adjust contrast accordingly
      systemPrefs.visualContrast = 'high';
    }
    
    if (Object.keys(systemPrefs).length > 0) {
      await updateAccessibilitySettings(userId, systemPrefs);
      console.log('System accessibility preferences applied');
    }
  } catch (error) {
    console.error('Failed to apply system preferences:', error);
    // Don't throw error - this is a nice-to-have feature
  }
}

/**
 * Validate preferences for safety and appropriateness
 */
export function validatePreferences(preferences: UserPreferences): string[] {
  const warnings: string[] = [];
  
  // Check voice settings are within safe ranges
  if (preferences.accessibility.voiceSpeed < 0.25 || preferences.accessibility.voiceSpeed > 4.0) {
    warnings.push('Voice speed should be between 0.25x and 4.0x');
  }
  
  if (preferences.accessibility.voiceVolume < 0 || preferences.accessibility.voiceVolume > 1) {
    warnings.push('Voice volume should be between 0 and 1');
  }
  
  // Check sensory break duration is reasonable
  if (preferences.sensory.sensoryBreakDuration < 5 || preferences.sensory.sensoryBreakDuration > 300) {
    warnings.push('Sensory break duration should be between 5 and 300 seconds');
  }
  
  return warnings;
}

/**
 * Get preferences optimized for specific accessibility needs
 */
export function getAccessibilityOptimizedPreferences(
  userId: string,
  accessibilityNeeds: string[]
): UserPreferences {
  const basePreferences = getDefaultPreferences(userId);
  
  // Optimize for autism spectrum
  if (accessibilityNeeds.includes('autism_spectrum')) {
    basePreferences.accessibility.reduceMotion = true;
    basePreferences.accessibility.visualContrast = 'normal'; // Keep normal contrast even for autism spectrum
    basePreferences.story.pauseBetweenSegments = true;
    basePreferences.story.repeatPrompts = true;
    basePreferences.sensory.sensoryBreakFrequency = 'high';
  }
  
  // Optimize for ADHD
  if (accessibilityNeeds.includes('adhd')) {
    basePreferences.story.preferredStoryLength = 'short';
    basePreferences.interaction.confirmationPrompts = true;
    basePreferences.sensory.visualEffects = 'minimal';
  }
  
  // Optimize for dyslexia
  if (accessibilityNeeds.includes('dyslexia')) {
    basePreferences.accessibility.fontSize = 'large';
    basePreferences.story.autoplay = true;
    basePreferences.interaction.voiceInteraction = true;
  }
  
  // Optimize for sensory processing differences
  if (accessibilityNeeds.includes('sensory_processing')) {
    basePreferences.accessibility.reduceMotion = true;
    basePreferences.accessibility.voiceVolume = 0.6;
    basePreferences.sensory.backgroundSounds = false;
    basePreferences.sensory.visualEffects = 'minimal';
  }
  
  return basePreferences;
}

/**
 * Export preferences for backup
 */
export async function exportPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    return await loadPreferences(userId);
  } catch (error) {
    console.error('Failed to export preferences:', error);
    return null;
  }
}

/**
 * Import preferences from backup
 */
export async function importPreferences(preferences: UserPreferences): Promise<void> {
  try {
    // Validate before importing
    const warnings = validatePreferences(preferences);
    if (warnings.length > 0) {
      console.warn('Preference validation warnings:', warnings);
    }
    
    await savePreferences(preferences);
    console.log(`Preferences imported for user: ${preferences.userId}`);
  } catch (error) {
    console.error('Failed to import preferences:', error);
    throw new Error('Preferences import failed');
  }
}

/**
 * Clear user preferences (privacy/reset)
 */
export async function clearPreferences(userId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('preferences', userId);
    console.log(`Preferences cleared for user: ${userId}`);
  } catch (error) {
    console.error('Failed to clear preferences:', error);
    throw new Error('Preferences clearing failed');
  }
}

/**
 * Get all users with preferences (for admin/analytics)
 */
export async function getAllPreferencesUsers(): Promise<string[]> {
  try {
    const db = await getDB();
    const allPreferences = await db.getAll('preferences');
    return allPreferences.map(pref => pref.userId);
  } catch (error) {
    console.error('Failed to get preferences users:', error);
    return [];
  }
}