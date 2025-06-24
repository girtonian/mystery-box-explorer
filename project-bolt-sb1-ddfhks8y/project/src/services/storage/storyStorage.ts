/**
 * Story content caching and management service
 * Handles offline story storage with therapeutic content validation
 */

import { getDB } from './db';
import type { StoryContent, StoryError, MunchieCharacter, AttachmentType } from '@/types';

/**
 * Cache a story in IndexedDB for offline access
 */
export async function cacheStory(story: StoryContent): Promise<void> {
  try {
    const db = await getDB();
    await db.put('stories', story);
    console.log(`Story cached: ${story.id}`);
  } catch (error) {
    console.error('Failed to cache story:', error);
    throw new Error('Story caching failed');
  }
}

/**
 * Retrieve a cached story by ID
 */
export async function getCachedStory(storyId: string): Promise<StoryContent | null> {
  try {
    const db = await getDB();
    const story = await db.get('stories', storyId);
    return story || null;
  } catch (error) {
    console.error('Failed to retrieve cached story:', error);
    return null;
  }
}

/**
 * Get all cached stories
 */
export async function getAllCachedStories(): Promise<StoryContent[]> {
  try {
    const db = await getDB();
    return await db.getAll('stories');
  } catch (error) {
    console.error('Failed to retrieve all cached stories:', error);
    return [];
  }
}

/**
 * Get stories by character
 */
export async function getStoriesByCharacter(characterId: MunchieCharacter): Promise<StoryContent[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('stories', 'by-character', characterId);
  } catch (error) {
    console.error('Failed to retrieve stories by character:', error);
    return [];
  }
}

/**
 * Get stories by attachment type
 */
export async function getStoriesByAttachment(attachmentType: AttachmentType): Promise<StoryContent[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('stories', 'by-attachment', attachmentType);
  } catch (error) {
    console.error('Failed to retrieve stories by attachment:', error);
    return [];
  }
}

/**
 * Check if a story is cached
 */
export async function isStoryCached(storyId: string): Promise<boolean> {
  try {
    const story = await getCachedStory(storyId);
    return story !== null;
  } catch (error) {
    console.error('Failed to check story cache status:', error);
    return false;
  }
}

/**
 * Remove a story from cache
 */
export async function removeCachedStory(storyId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('stories', storyId);
    console.log(`Story removed from cache: ${storyId}`);
  } catch (error) {
    console.error('Failed to remove cached story:', error);
    throw new Error('Story removal failed');
  }
}

/**
 * Update story metadata (for content updates)
 */
export async function updateStoryMetadata(
  storyId: string, 
  updates: Partial<StoryContent>
): Promise<void> {
  try {
    const db = await getDB();
    const existingStory = await db.get('stories', storyId);
    
    if (!existingStory) {
      throw new Error('Story not found in cache');
    }
    
    const updatedStory: StoryContent = {
      ...existingStory,
      ...updates,
      lastModified: Date.now(),
    };
    
    await db.put('stories', updatedStory);
    console.log(`Story metadata updated: ${storyId}`);
  } catch (error) {
    console.error('Failed to update story metadata:', error);
    throw new Error('Story metadata update failed');
  }
}

/**
 * Get stories that need content updates
 */
export async function getStoriesNeedingUpdate(): Promise<StoryContent[]> {
  try {
    const db = await getDB();
    const allStories = await db.getAll('stories');
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    // Return stories older than one week
    return allStories.filter(story => story.lastModified < oneWeekAgo);
  } catch (error) {
    console.error('Failed to get stories needing update:', error);
    return [];
  }
}

/**
 * Validate story content for therapeutic appropriateness
 */
export function validateStoryContent(story: StoryContent): StoryError[] {
  const errors: StoryError[] = [];
  
  // Check required fields
  if (!story.id || !story.characterId || !story.attachmentId) {
    errors.push({
      code: 'INVALID_FORMAT',
      message: 'Story missing required fields',
      storyId: story.id,
      timestamp: Date.now(),
      recoverable: false,
      suggestedAction: 'Verify story data structure',
    });
  }
  
  // Check story nodes
  if (!story.nodes || Object.keys(story.nodes).length === 0) {
    errors.push({
      code: 'INVALID_FORMAT',
      message: 'Story has no content nodes',
      storyId: story.id,
      timestamp: Date.now(),
      recoverable: false,
      suggestedAction: 'Add story content nodes',
    });
  }
  
  // Check start node exists
  if (story.startNodeId && !story.nodes[story.startNodeId]) {
    errors.push({
      code: 'INVALID_FORMAT',
      message: 'Start node not found in story nodes',
      storyId: story.id,
      nodeId: story.startNodeId,
      timestamp: Date.now(),
      recoverable: true,
      suggestedAction: 'Update start node ID or add missing node',
    });
  }
  
  // Validate therapeutic content
  if (story.metadata) {
    if (!story.metadata.therapeuticGoals || story.metadata.therapeuticGoals.length === 0) {
      errors.push({
        code: 'CONTENT_UNSAFE',
        message: 'Story lacks therapeutic goals',
        storyId: story.id,
        timestamp: Date.now(),
        recoverable: true,
        suggestedAction: 'Add therapeutic learning objectives',
      });
    }
    
    if (!story.metadata.sensoryFocus || story.metadata.sensoryFocus.length === 0) {
      errors.push({
        code: 'CONTENT_UNSAFE',
        message: 'Story lacks sensory focus areas',
        storyId: story.id,
        timestamp: Date.now(),
        recoverable: true,
        suggestedAction: 'Define sensory regulation strategies',
      });
    }
  }
  
  return errors;
}

/**
 * Get story cache statistics
 */
export async function getStoryCacheStats(): Promise<{
  totalStories: number;
  storiesByCharacter: Record<MunchieCharacter, number>;
  storiesByAttachment: Record<AttachmentType, number>;
  oldestStory: number;
  newestStory: number;
  totalSize: number;
}> {
  try {
    const db = await getDB();
    const allStories = await db.getAll('stories');
    
    const stats = {
      totalStories: allStories.length,
      storiesByCharacter: {} as Record<MunchieCharacter, number>,
      storiesByAttachment: {} as Record<AttachmentType, number>,
      oldestStory: Date.now(),
      newestStory: 0,
      totalSize: 0,
    };
    
    allStories.forEach(story => {
      // Count by character
      stats.storiesByCharacter[story.characterId] = 
        (stats.storiesByCharacter[story.characterId] || 0) + 1;
      
      // Count by attachment
      stats.storiesByAttachment[story.attachmentId] = 
        (stats.storiesByAttachment[story.attachmentId] || 0) + 1;
      
      // Track dates
      if (story.createdAt < stats.oldestStory) {
        stats.oldestStory = story.createdAt;
      }
      if (story.createdAt > stats.newestStory) {
        stats.newestStory = story.createdAt;
      }
      
      // Estimate size
      stats.totalSize += JSON.stringify(story).length * 2;
    });
    
    return stats;
  } catch (error) {
    console.error('Failed to get story cache stats:', error);
    return {
      totalStories: 0,
      storiesByCharacter: {} as Record<MunchieCharacter, number>,
      storiesByAttachment: {} as Record<AttachmentType, number>,
      oldestStory: Date.now(),
      newestStory: 0,
      totalSize: 0,
    };
  }
}

/**
 * Preload essential stories for offline use
 */
export async function preloadEssentialStories(): Promise<void> {
  // This would typically fetch from a CDN or API
  // For now, we'll create sample stories for each character/attachment combination
  
  const essentialStories: Partial<StoryContent>[] = [
    {
      id: 'silo-fidget-feet-001',
      characterId: 'silo',
      attachmentId: 'fidget_feet',
      metadata: {
        title: "Silo's Fidget Feet Adventure",
        description: 'Silo discovers how fidget feet help with focus and calm',
        estimatedDuration: 5,
        difficultyLevel: 'beginner',
        sensoryFocus: ['proprioceptive_input'],
        therapeuticGoals: ['movement_for_calm', 'focus_improvement'],
        ageRange: { min: 4, max: 12 },
      },
    },
    {
      id: 'blip-weighted-arms-001',
      characterId: 'blip',
      attachmentId: 'weighted_arms',
      metadata: {
        title: "Blip's Weighted Arms Discovery",
        description: 'Blip learns how weighted arms provide calming pressure',
        estimatedDuration: 5,
        difficultyLevel: 'beginner',
        sensoryFocus: ['deep_pressure'],
        therapeuticGoals: ['anxiety_reduction', 'self_regulation'],
        ageRange: { min: 4, max: 12 },
      },
    },
  ];
  
  // In a real implementation, these would be fetched from an API
  // For now, we'll just log that preloading would happen here
  console.log('Essential stories would be preloaded:', essentialStories.map(s => s.id));
}

/**
 * Clear story cache (for privacy/reset)
 */
export async function clearStoryCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('stories');
    console.log('Story cache cleared');
  } catch (error) {
    console.error('Failed to clear story cache:', error);
    throw new Error('Story cache clearing failed');
  }
}