/**
 * User progress tracking and persistence service
 * Handles story completion, achievements, and therapeutic progress
 */

import { getDB } from './db';
import type { 
  StoryProgress, 
  DecisionRecord, 
  UserAchievement,
  MunchieCharacter,
  AttachmentType 
} from '@/types';

/**
 * Save story progress to IndexedDB
 */
export async function saveProgress(progress: StoryProgress): Promise<void> {
  try {
    const db = await getDB();
    const updatedProgress = {
      ...progress,
      lastAccessedAt: Date.now(),
    };
    
    await db.put('progress', updatedProgress);
    console.log(`Progress saved for story: ${progress.storyId}`);
  } catch (error) {
    console.error('Failed to save progress:', error);
    throw new Error('Progress saving failed');
  }
}

/**
 * Load progress for a specific story
 */
export async function loadProgress(storyId: string): Promise<StoryProgress | null> {
  try {
    const db = await getDB();
    const progress = await db.get('progress', storyId);
    return progress || null;
  } catch (error) {
    console.error('Failed to load progress:', error);
    return null;
  }
}

/**
 * Get all progress for a user
 */
export async function getUserProgress(userId: string): Promise<StoryProgress[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('progress', 'by-user', userId);
  } catch (error) {
    console.error('Failed to get user progress:', error);
    return [];
  }
}

/**
 * Get completed stories for a user
 */
export async function getCompletedStories(userId: string): Promise<StoryProgress[]> {
  try {
    const db = await getDB();
    const allProgress = await getUserProgress(userId);
    return allProgress.filter(progress => progress.isCompleted);
  } catch (error) {
    console.error('Failed to get completed stories:', error);
    return [];
  }
}

/**
 * Get in-progress stories for a user
 */
export async function getInProgressStories(userId: string): Promise<StoryProgress[]> {
  try {
    const db = await getDB();
    const allProgress = await getUserProgress(userId);
    return allProgress.filter(progress => 
      !progress.isCompleted && progress.visitedNodes.length > 0
    );
  } catch (error) {
    console.error('Failed to get in-progress stories:', error);
    return [];
  }
}

/**
 * Update story progress with new node visit
 */
export async function updateProgressNode(
  storyId: string,
  nodeId: string,
  decision?: DecisionRecord
): Promise<void> {
  try {
    const db = await getDB();
    const existingProgress = await db.get('progress', storyId);
    
    if (!existingProgress) {
      throw new Error('Progress record not found');
    }
    
    const updatedProgress: StoryProgress = {
      ...existingProgress,
      currentNodeId: nodeId,
      visitedNodes: [...new Set([...existingProgress.visitedNodes, nodeId])],
      lastAccessedAt: Date.now(),
    };
    
    // Add decision if provided
    if (decision) {
      updatedProgress.choicesMade = [...existingProgress.choicesMade, decision];
    }
    
    // Update total time spent
    const sessionTime = Date.now() - existingProgress.lastAccessedAt;
    updatedProgress.totalTimeSpent = existingProgress.totalTimeSpent + sessionTime;
    
    await db.put('progress', updatedProgress);
    console.log(`Progress updated for story: ${storyId}, node: ${nodeId}`);
  } catch (error) {
    console.error('Failed to update progress node:', error);
    throw new Error('Progress node update failed');
  }
}

/**
 * Mark story as completed
 */
export async function completeStory(storyId: string): Promise<void> {
  try {
    const db = await getDB();
    const existingProgress = await db.get('progress', storyId);
    
    if (!existingProgress) {
      throw new Error('Progress record not found');
    }
    
    const updatedProgress: StoryProgress = {
      ...existingProgress,
      isCompleted: true,
      completedAt: Date.now(),
      lastAccessedAt: Date.now(),
    };
    
    await db.put('progress', updatedProgress);
    console.log(`Story completed: ${storyId}`);
    
    // Check for achievements
    await checkForAchievements(existingProgress.storyId);
  } catch (error) {
    console.error('Failed to complete story:', error);
    throw new Error('Story completion failed');
  }
}

/**
 * Get progress statistics for a user
 */
export async function getProgressStats(userId: string): Promise<{
  totalStories: number;
  completedStories: number;
  inProgressStories: number;
  totalTimeSpent: number;
  averageCompletionTime: number;
  favoriteCharacter: MunchieCharacter | null;
  favoriteAttachment: AttachmentType | null;
  completionRate: number;
}> {
  try {
    const allProgress = await getUserProgress(userId);
    const completed = allProgress.filter(p => p.isCompleted);
    const inProgress = allProgress.filter(p => !p.isCompleted && p.visitedNodes.length > 0);
    
    const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.totalTimeSpent, 0);
    const averageCompletionTime = completed.length > 0 
      ? completed.reduce((sum, p) => sum + p.totalTimeSpent, 0) / completed.length 
      : 0;
    
    // Calculate favorite character and attachment (would need story data)
    // For now, returning null - this would be implemented with story metadata
    
    return {
      totalStories: allProgress.length,
      completedStories: completed.length,
      inProgressStories: inProgress.length,
      totalTimeSpent,
      averageCompletionTime,
      favoriteCharacter: null, // Would be calculated from story metadata
      favoriteAttachment: null, // Would be calculated from story metadata
      completionRate: allProgress.length > 0 ? (completed.length / allProgress.length) * 100 : 0,
    };
  } catch (error) {
    console.error('Failed to get progress stats:', error);
    return {
      totalStories: 0,
      completedStories: 0,
      inProgressStories: 0,
      totalTimeSpent: 0,
      averageCompletionTime: 0,
      favoriteCharacter: null,
      favoriteAttachment: null,
      completionRate: 0,
    };
  }
}

/**
 * Create initial progress record for a new story
 */
export async function initializeStoryProgress(
  userId: string,
  storyId: string,
  startNodeId: string
): Promise<StoryProgress> {
  const initialProgress: StoryProgress = {
    storyId,
    userId,
    currentNodeId: startNodeId,
    visitedNodes: [startNodeId],
    completedNodes: [],
    startedAt: Date.now(),
    lastAccessedAt: Date.now(),
    totalTimeSpent: 0,
    choicesMade: [],
    isCompleted: false,
  };
  
  await saveProgress(initialProgress);
  return initialProgress;
}

/**
 * Check for and award achievements based on progress
 */
async function checkForAchievements(storyId: string): Promise<UserAchievement[]> {
  // This would implement achievement logic
  // For now, just return empty array
  console.log(`Checking achievements for story completion: ${storyId}`);
  return [];
}

/**
 * Get recent activity for a user
 */
export async function getRecentActivity(
  userId: string, 
  limit: number = 10
): Promise<StoryProgress[]> {
  try {
    const db = await getDB();
    const allProgress = await getUserProgress(userId);
    
    // Sort by last accessed and limit results
    return allProgress
      .sort((a, b) => b.lastAccessedAt - a.lastAccessedAt)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get recent activity:', error);
    return [];
  }
}

/**
 * Export progress data for backup
 */
export async function exportProgressData(userId: string): Promise<{
  progress: StoryProgress[];
  stats: any;
  exportedAt: number;
}> {
  try {
    const progress = await getUserProgress(userId);
    const stats = await getProgressStats(userId);
    
    return {
      progress,
      stats,
      exportedAt: Date.now(),
    };
  } catch (error) {
    console.error('Failed to export progress data:', error);
    throw new Error('Progress data export failed');
  }
}

/**
 * Clear all progress for a user (privacy/reset)
 */
export async function clearUserProgress(userId: string): Promise<void> {
  try {
    const db = await getDB();
    const userProgress = await getUserProgress(userId);
    
    // Delete each progress record
    const tx = db.transaction('progress', 'readwrite');
    for (const progress of userProgress) {
      await tx.objectStore('progress').delete(progress.storyId);
    }
    await tx.done;
    
    console.log(`Progress cleared for user: ${userId}`);
  } catch (error) {
    console.error('Failed to clear user progress:', error);
    throw new Error('Progress clearing failed');
  }
}

/**
 * Get progress for stories that haven't been accessed recently
 */
export async function getStaleProgress(
  userId: string,
  daysOld: number = 30
): Promise<StoryProgress[]> {
  try {
    const cutoffDate = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
    const allProgress = await getUserProgress(userId);
    
    return allProgress.filter(progress => 
      progress.lastAccessedAt < cutoffDate && !progress.isCompleted
    );
  } catch (error) {
    console.error('Failed to get stale progress:', error);
    return [];
  }
}