/**
 * Media asset caching and management service
 * Handles images, audio, and animations with size limits and cleanup
 */

import { getDB } from './db';

export interface AssetRecord {
  id: string;
  type: 'audio' | 'image' | 'animation';
  data: ArrayBuffer;
  metadata: {
    mimeType: string;
    size: number;
    createdAt: number;
    lastAccessed: number;
    accessCount: number;
    url?: string; // Original URL if fetched from network
    characterId?: string; // For character-specific assets
    storyId?: string; // For story-specific assets
  };
}

// Maximum sizes for different asset types
const MAX_ASSET_SIZES = {
  audio: 10 * 1024 * 1024, // 10MB per audio file
  image: 5 * 1024 * 1024,  // 5MB per image
  animation: 15 * 1024 * 1024, // 15MB per animation
};

/**
 * Cache an asset in IndexedDB
 */
export async function cacheAsset(asset: AssetRecord): Promise<void> {
  try {
    // Check size limits
    if (asset.metadata.size > MAX_ASSET_SIZES[asset.type]) {
      throw new Error(`Asset too large: ${asset.metadata.size} bytes (max: ${MAX_ASSET_SIZES[asset.type]})`);
    }
    
    const db = await getDB();
    await db.put('assets', asset);
    console.log(`Asset cached: ${asset.id} (${asset.type})`);
  } catch (error) {
    console.error('Failed to cache asset:', error);
    throw new Error('Asset caching failed');
  }
}

/**
 * Retrieve a cached asset
 */
export async function getCachedAsset(assetId: string): Promise<AssetRecord | null> {
  try {
    const db = await getDB();
    const asset = await db.get('assets', assetId);
    
    if (asset) {
      // Update access tracking
      asset.metadata.lastAccessed = Date.now();
      asset.metadata.accessCount += 1;
      await db.put('assets', asset);
    }
    
    return asset || null;
  } catch (error) {
    console.error('Failed to retrieve cached asset:', error);
    return null;
  }
}

/**
 * Check if an asset is cached
 */
export async function isAssetCached(assetId: string): Promise<boolean> {
  try {
    const db = await getDB();
    const asset = await db.get('assets', assetId);
    return asset !== undefined;
  } catch (error) {
    console.error('Failed to check asset cache status:', error);
    return false;
  }
}

/**
 * Get assets by type
 */
export async function getAssetsByType(type: AssetRecord['type']): Promise<AssetRecord[]> {
  try {
    const db = await getDB();
    return await db.getAllFromIndex('assets', 'by-type', type);
  } catch (error) {
    console.error('Failed to get assets by type:', error);
    return [];
  }
}

/**
 * Remove an asset from cache
 */
export async function removeCachedAsset(assetId: string): Promise<void> {
  try {
    const db = await getDB();
    await db.delete('assets', assetId);
    console.log(`Asset removed from cache: ${assetId}`);
  } catch (error) {
    console.error('Failed to remove cached asset:', error);
    throw new Error('Asset removal failed');
  }
}

/**
 * Get asset cache statistics
 */
export async function getAssetCacheStats(): Promise<{
  totalAssets: number;
  totalSize: number;
  assetsByType: Record<string, number>;
  sizesByType: Record<string, number>;
  oldestAsset: number;
  newestAsset: number;
}> {
  try {
    const db = await getDB();
    const allAssets = await db.getAll('assets');
    
    const stats = {
      totalAssets: allAssets.length,
      totalSize: 0,
      assetsByType: {} as Record<string, number>,
      sizesByType: {} as Record<string, number>,
      oldestAsset: Date.now(),
      newestAsset: 0,
    };
    
    allAssets.forEach(asset => {
      stats.totalSize += asset.metadata.size;
      
      // Count by type
      stats.assetsByType[asset.type] = (stats.assetsByType[asset.type] || 0) + 1;
      stats.sizesByType[asset.type] = (stats.sizesByType[asset.type] || 0) + asset.metadata.size;
      
      // Track dates
      if (asset.metadata.createdAt < stats.oldestAsset) {
        stats.oldestAsset = asset.metadata.createdAt;
      }
      if (asset.metadata.createdAt > stats.newestAsset) {
        stats.newestAsset = asset.metadata.createdAt;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Failed to get asset cache stats:', error);
    return {
      totalAssets: 0,
      totalSize: 0,
      assetsByType: {},
      sizesByType: {},
      oldestAsset: Date.now(),
      newestAsset: 0,
    };
  }
}

/**
 * Clean up old or unused assets
 */
export async function cleanupAssets(maxAge: number = 30): Promise<number> {
  try {
    const db = await getDB();
    const cutoffDate = Date.now() - (maxAge * 24 * 60 * 60 * 1000);
    
    // Get assets that haven't been accessed recently
    const oldAssets = await db.getAllFromIndex('assets', 'by-last-accessed', IDBKeyRange.upperBound(cutoffDate));
    
    let cleanedCount = 0;
    const tx = db.transaction('assets', 'readwrite');
    
    for (const asset of oldAssets) {
      await tx.objectStore('assets').delete(asset.id);
      cleanedCount++;
    }
    
    await tx.done;
    console.log(`Cleaned up ${cleanedCount} old assets`);
    return cleanedCount;
  } catch (error) {
    console.error('Failed to cleanup assets:', error);
    return 0;
  }
}

/**
 * Fetch and cache an asset from URL
 */
export async function fetchAndCacheAsset(
  url: string,
  assetId: string,
  type: AssetRecord['type'],
  metadata?: Partial<AssetRecord['metadata']>
): Promise<AssetRecord> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch asset: ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const mimeType = response.headers.get('content-type') || 'application/octet-stream';
    
    const asset: AssetRecord = {
      id: assetId,
      type,
      data: arrayBuffer,
      metadata: {
        mimeType,
        size: arrayBuffer.byteLength,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 1,
        url,
        ...metadata,
      },
    };
    
    await cacheAsset(asset);
    return asset;
  } catch (error) {
    console.error('Failed to fetch and cache asset:', error);
    throw new Error('Asset fetching failed');
  }
}

/**
 * Create a blob URL from cached asset
 */
export async function createAssetBlobUrl(assetId: string): Promise<string | null> {
  try {
    const asset = await getCachedAsset(assetId);
    if (!asset) {
      return null;
    }
    
    const blob = new Blob([asset.data], { type: asset.metadata.mimeType });
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Failed to create blob URL:', error);
    return null;
  }
}

/**
 * Preload essential assets for offline use
 */
export async function preloadEssentialAssets(): Promise<void> {
  // This would typically preload character images, common UI assets, etc.
  // For now, we'll just log what would be preloaded
  
  const essentialAssets = [
    { url: '/images/characters/silo.png', id: 'character-silo', type: 'image' as const },
    { url: '/images/characters/blip.png', id: 'character-blip', type: 'image' as const },
    { url: '/images/attachments/fidget-feet.png', id: 'attachment-fidget-feet', type: 'image' as const },
    { url: '/images/attachments/weighted-arms.png', id: 'attachment-weighted-arms', type: 'image' as const },
  ];
  
  console.log('Essential assets would be preloaded:', essentialAssets.map(a => a.id));
  
  // In a real implementation, we would:
  // for (const asset of essentialAssets) {
  //   try {
  //     await fetchAndCacheAsset(asset.url, asset.id, asset.type);
  //   } catch (error) {
  //     console.warn(`Failed to preload asset: ${asset.id}`, error);
  //   }
  // }
}

/**
 * Clear asset cache
 */
export async function clearAssetCache(): Promise<void> {
  try {
    const db = await getDB();
    await db.clear('assets');
    console.log('Asset cache cleared');
  } catch (error) {
    console.error('Failed to clear asset cache:', error);
    throw new Error('Asset cache clearing failed');
  }
}

/**
 * Get assets that are taking up the most space
 */
export async function getLargestAssets(limit: number = 10): Promise<AssetRecord[]> {
  try {
    const db = await getDB();
    const allAssets = await db.getAll('assets');
    
    return allAssets
      .sort((a, b) => b.metadata.size - a.metadata.size)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get largest assets:', error);
    return [];
  }
}

/**
 * Get least accessed assets (candidates for cleanup)
 */
export async function getLeastAccessedAssets(limit: number = 10): Promise<AssetRecord[]> {
  try {
    const db = await getDB();
    const allAssets = await db.getAll('assets');
    
    return allAssets
      .sort((a, b) => a.metadata.accessCount - b.metadata.accessCount)
      .slice(0, limit);
  } catch (error) {
    console.error('Failed to get least accessed assets:', error);
    return [];
  }
}