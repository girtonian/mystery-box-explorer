/**
 * Central export point for all storage services
 * Provides unified access to IndexedDB and localStorage operations
 */

// Import functions for internal use
import {
  initializeDB,
  getDB,
  closeDB,
  clearAllData,
  getStorageStats,
  cleanupStorage,
  checkStorageQuota,
  exportUserData,
  importUserData,
} from './db';

import {
  cacheStory,
  getCachedStory,
  getAllCachedStories,
  getStoriesByCharacter,
  getStoriesByAttachment,
  isStoryCached,
  removeCachedStory,
  updateStoryMetadata,
  getStoriesNeedingUpdate,
  validateStoryContent,
  getStoryCacheStats,
  preloadEssentialStories,
  clearStoryCache,
} from './storyStorage';

import {
  saveProgress,
  loadProgress,
  getUserProgress,
  getCompletedStories,
  getInProgressStories,
  updateProgressNode,
  completeStory,
  getProgressStats,
  initializeStoryProgress,
  getRecentActivity,
  exportProgressData,
  clearUserProgress,
  getStaleProgress,
} from './progressStorage';

import {
  savePreferences,
  loadPreferences,
  getDefaultPreferences,
  updateAccessibilitySettings,
  updateStoryPreferences,
  updateInteractionPreferences,
  updateSensoryPreferences,
  applySystemPreferences,
  validatePreferences,
  getAccessibilityOptimizedPreferences,
  exportPreferences,
  importPreferences,
  clearPreferences,
  getAllPreferencesUsers,
} from './preferenceStorage';

import {
  cacheAsset,
  getCachedAsset,
  isAssetCached,
  getAssetsByType,
  removeCachedAsset,
  getAssetCacheStats,
  cleanupAssets,
  fetchAndCacheAsset,
  createAssetBlobUrl,
  preloadEssentialAssets,
  clearAssetCache,
  getLargestAssets,
  getLeastAccessedAssets,
} from './assetStorage';

// Re-export all functions for external use
export {
  // Database initialization and management
  initializeDB,
  getDB,
  closeDB,
  clearAllData,
  getStorageStats,
  cleanupStorage,
  checkStorageQuota,
  exportUserData,
  importUserData,
  
  // Story content caching
  cacheStory,
  getCachedStory,
  getAllCachedStories,
  getStoriesByCharacter,
  getStoriesByAttachment,
  isStoryCached,
  removeCachedStory,
  updateStoryMetadata,
  getStoriesNeedingUpdate,
  validateStoryContent,
  getStoryCacheStats,
  preloadEssentialStories,
  clearStoryCache,
  
  // Progress tracking
  saveProgress,
  loadProgress,
  getUserProgress,
  getCompletedStories,
  getInProgressStories,
  updateProgressNode,
  completeStory,
  getProgressStats,
  initializeStoryProgress,
  getRecentActivity,
  exportProgressData,
  clearUserProgress,
  getStaleProgress,
  
  // User preferences
  savePreferences,
  loadPreferences,
  getDefaultPreferences,
  updateAccessibilitySettings,
  updateStoryPreferences,
  updateInteractionPreferences,
  updateSensoryPreferences,
  applySystemPreferences,
  validatePreferences,
  getAccessibilityOptimizedPreferences,
  exportPreferences,
  importPreferences,
  clearPreferences,
  getAllPreferencesUsers,
  
  // Asset management
  cacheAsset,
  getCachedAsset,
  isAssetCached,
  getAssetsByType,
  removeCachedAsset,
  getAssetCacheStats,
  cleanupAssets,
  fetchAndCacheAsset,
  createAssetBlobUrl,
  preloadEssentialAssets,
  clearAssetCache,
  getLargestAssets,
  getLeastAccessedAssets,
};

// Re-export types for convenience
export type { AssetRecord } from './assetStorage';

/**
 * Initialize all storage services
 * Call this once when the app starts
 */
export async function initializeStorage(): Promise<void> {
  try {
    console.log('Initializing storage services...');
    
    // Initialize the database
    await initializeDB();
    
    // Check storage quota and warn if low
    const quota = await checkStorageQuota();
    if (quota.needsCleanup) {
      console.warn(`Storage usage high: ${quota.percentUsed.toFixed(1)}%`);
      await cleanupStorage();
    }
    
    // Preload essential content for offline use
    await preloadEssentialStories();
    await preloadEssentialAssets();
    
    console.log('Storage services initialized successfully');
  } catch (error) {
    console.error('Failed to initialize storage services:', error);
    throw new Error('Storage initialization failed');
  }
}

/**
 * Cleanup all storage services
 * Call this periodically or when storage is getting full
 */
export async function performStorageCleanup(): Promise<{
  assetsCleanedUp: number;
  storageFreed: number;
}> {
  try {
    console.log('Performing storage cleanup...');
    
    const statsBefore = await getStorageStats();
    const assetsCleanedUp = await cleanupAssets();
    await cleanupStorage();
    const statsAfter = await getStorageStats();
    
    const storageFreed = statsBefore.totalSize - statsAfter.totalSize;
    
    console.log(`Cleanup completed: ${assetsCleanedUp} assets removed, ${storageFreed} bytes freed`);
    
    return {
      assetsCleanedUp,
      storageFreed,
    };
  } catch (error) {
    console.error('Storage cleanup failed:', error);
    return {
      assetsCleanedUp: 0,
      storageFreed: 0,
    };
  }
}

/**
 * Get comprehensive storage health report
 */
export async function getStorageHealthReport(): Promise<{
  quota: {
    usage: number;
    quota: number;
    percentUsed: number;
    needsCleanup: boolean;
  };
  database: {
    totalSize: number;
    storesSizes: Record<string, number>;
    itemCounts: Record<string, number>;
  };
  assets: {
    totalAssets: number;
    totalSize: number;
    assetsByType: Record<string, number>;
    sizesByType: Record<string, number>;
  };
  stories: {
    totalStories: number;
    totalSize: number;
  };
  recommendations: string[];
}> {
  try {
    // Get quota information
    const quota = await checkStorageQuota();
    
    // Get database stats
    const database = await getStorageStats();
    
    // Get asset stats with fallback
    let assets;
    try {
      assets = await getAssetCacheStats();
    } catch (error) {
      console.warn('Failed to get asset cache stats:', error);
      assets = {
        totalAssets: 0,
        totalSize: 0,
        assetsByType: {},
        sizesByType: {},
        oldestAsset: Date.now(),
        newestAsset: 0,
      };
    }
    
    // Get story stats with fallback
    let stories;
    try {
      stories = await getStoryCacheStats();
    } catch (error) {
      console.warn('Failed to get story cache stats:', error);
      stories = {
        totalStories: 0,
        totalSize: 0,
        storiesByCharacter: {},
        storiesByAttachment: {},
        oldestStory: Date.now(),
        newestStory: 0,
      };
    }
    
    const recommendations: string[] = [];
    
    // Generate recommendations based on usage
    if (quota.percentUsed > 80) {
      recommendations.push('Storage usage is high. Consider cleaning up old data.');
    }
    
    if (assets.totalSize > 100 * 1024 * 1024) { // 100MB
      recommendations.push('Asset cache is large. Consider removing unused assets.');
    }
    
    if (database.itemCounts.sessions > 100) {
      recommendations.push('Many session records stored. Consider cleaning up old sessions.');
    }
    
    return {
      quota,
      database,
      assets: {
        totalAssets: assets.totalAssets,
        totalSize: assets.totalSize,
        assetsByType: assets.assetsByType,
        sizesByType: assets.sizesByType,
      },
      stories: {
        totalStories: stories.totalStories,
        totalSize: stories.totalSize,
      },
      recommendations,
    };
  } catch (error) {
    console.error('Failed to generate storage health report:', error);
    // Return a safe fallback instead of throwing
    return {
      quota: {
        usage: 0,
        quota: 0,
        percentUsed: 0,
        needsCleanup: false,
      },
      database: {
        totalSize: 0,
        storesSizes: {},
        itemCounts: {},
      },
      assets: {
        totalAssets: 0,
        totalSize: 0,
        assetsByType: {},
        sizesByType: {},
      },
      stories: {
        totalStories: 0,
        totalSize: 0,
      },
      recommendations: ['Unable to generate storage health report. Please try again later.'],
    };
  }
}

/**
 * Emergency storage cleanup (when quota is exceeded)
 */
export async function emergencyStorageCleanup(): Promise<void> {
  try {
    console.warn('Performing emergency storage cleanup...');
    
    // Clear all non-essential data
    await cleanupAssets(7); // Remove assets older than 7 days
    await cleanupStorage(); // Remove old sessions and cache
    
    // If still over quota, clear more aggressively
    const quota = await checkStorageQuota();
    if (quota.percentUsed > 90) {
      console.warn('Aggressive cleanup required');
      await cleanupAssets(1); // Remove assets older than 1 day
      
      // Clear least accessed assets
      const leastAccessed = await getLeastAccessedAssets(50);
      for (const asset of leastAccessed) {
        await removeCachedAsset(asset.id);
      }
    }
    
    console.log('Emergency cleanup completed');
  } catch (error) {
    console.error('Emergency storage cleanup failed:', error);
    throw new Error('Emergency cleanup failed');
  }
}