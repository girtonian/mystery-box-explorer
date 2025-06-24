/**
 * IndexedDB initialization and schema management for Curmunchkins Mystery Box Explorer
 * Provides offline-first storage with privacy-compliant data handling
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { 
  StoryContent, 
  StoryProgress, 
  UserPreferences, 
  NFTAsset, 
  ScanSession,
  VoiceSession,
  AudioCache 
} from '@/types';

// Database schema definition
interface CurmunchkinsDB extends DBSchema {
  stories: {
    key: string;
    value: StoryContent;
    indexes: {
      'by-character': string;
      'by-attachment': string;
      'by-created': number;
    };
  };
  
  progress: {
    key: string; // userId-storyId combination
    value: StoryProgress;
    indexes: {
      'by-user': string;
      'by-story': string;
      'by-completed': boolean;
      'by-last-accessed': number;
    };
  };
  
  preferences: {
    key: string; // userId
    value: UserPreferences;
    indexes: {
      'by-updated': number;
    };
  };
  
  assets: {
    key: string; // asset hash or ID
    value: {
      id: string;
      type: 'audio' | 'image' | 'animation';
      data: ArrayBuffer;
      metadata: {
        mimeType: string;
        size: number;
        createdAt: number;
        lastAccessed: number;
        accessCount: number;
      };
    };
    indexes: {
      'by-type': string;
      'by-size': number;
      'by-last-accessed': number;
    };
  };
  
  nfts: {
    key: number; // assetId
    value: NFTAsset;
    indexes: {
      'by-owner': string;
      'by-character': string;
      'by-rarity': string;
      'by-minted': number;
    };
  };
  
  sessions: {
    key: string; // session ID
    value: {
      id: string;
      type: 'scan' | 'voice' | 'story';
      userId: string;
      data: ScanSession | VoiceSession | any;
      startTime: number;
      endTime?: number;
    };
    indexes: {
      'by-user': string;
      'by-type': string;
      'by-start-time': number;
    };
  };
  
  audioCache: {
    key: string; // audio content hash
    value: AudioCache;
    indexes: {
      'by-character': string;
      'by-last-accessed': number;
      'by-size': number;
    };
  };
}

// Database configuration
const DB_NAME = 'curmunchkins-db';
const DB_VERSION = 2;

// Maximum storage sizes (in bytes)
const MAX_ASSET_SIZE = 50 * 1024 * 1024; // 50MB for assets
const MAX_AUDIO_CACHE_SIZE = 100 * 1024 * 1024; // 100MB for audio cache
const MAX_TOTAL_STORAGE = 500 * 1024 * 1024; // 500MB total

let dbInstance: IDBPDatabase<CurmunchkinsDB> | null = null;

/**
 * Initialize the IndexedDB database with proper schema and indexes
 */
export async function initializeDB(): Promise<IDBPDatabase<CurmunchkinsDB>> {
  if (dbInstance) {
    return dbInstance;
  }

  try {
    dbInstance = await openDB<CurmunchkinsDB>(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion, newVersion, transaction) {
        console.log(`Upgrading database from version ${oldVersion} to ${newVersion}`);
        
        // Stories store
        if (!db.objectStoreNames.contains('stories')) {
          const storiesStore = db.createObjectStore('stories', { keyPath: 'id' });
          storiesStore.createIndex('by-character', 'characterId');
          storiesStore.createIndex('by-attachment', 'attachmentId');
          storiesStore.createIndex('by-created', 'createdAt');
        }
        
        // Progress store
        if (!db.objectStoreNames.contains('progress')) {
          const progressStore = db.createObjectStore('progress', { keyPath: 'storyId' });
          progressStore.createIndex('by-user', 'userId');
          progressStore.createIndex('by-story', 'storyId');
          progressStore.createIndex('by-completed', 'isCompleted');
          progressStore.createIndex('by-last-accessed', 'lastAccessedAt');
        }
        
        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          const preferencesStore = db.createObjectStore('preferences', { keyPath: 'userId' });
          preferencesStore.createIndex('by-updated', 'lastUpdated');
        }
        
        // Assets store
        if (!db.objectStoreNames.contains('assets')) {
          const assetsStore = db.createObjectStore('assets', { keyPath: 'id' });
          assetsStore.createIndex('by-type', 'type');
          assetsStore.createIndex('by-size', 'metadata.size');
          assetsStore.createIndex('by-last-accessed', 'metadata.lastAccessed');
        }
        
        // NFTs store
        if (!db.objectStoreNames.contains('nfts')) {
          const nftsStore = db.createObjectStore('nfts', { keyPath: 'assetId' });
          nftsStore.createIndex('by-owner', 'owner');
          nftsStore.createIndex('by-character', 'metadata.properties.character');
          nftsStore.createIndex('by-rarity', 'metadata.properties.rarity');
          nftsStore.createIndex('by-minted', 'mintedAt');
        }
        
        // Sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('by-user', 'userId');
          sessionsStore.createIndex('by-type', 'type');
          sessionsStore.createIndex('by-start-time', 'startTime');
        }
        
        // Audio cache store
        if (!db.objectStoreNames.contains('audioCache')) {
          const audioCacheStore = db.createObjectStore('audioCache', { keyPath: 'key' });
          audioCacheStore.createIndex('by-character', 'metadata.characterId');
          audioCacheStore.createIndex('by-last-accessed', 'lastAccessed');
          audioCacheStore.createIndex('by-size', 'size');
        }
      },
      
      blocked() {
        console.warn('Database upgrade blocked. Please close other tabs.');
      },
      
      blocking() {
        console.warn('Database blocking upgrade. Closing connection.');
        dbInstance?.close();
        dbInstance = null;
      },
    });

    console.log('Database initialized successfully');
    return dbInstance;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw new Error('Database initialization failed');
  }
}

/**
 * Get the database instance, initializing if necessary
 */
export async function getDB(): Promise<IDBPDatabase<CurmunchkinsDB>> {
  if (!dbInstance) {
    return await initializeDB();
  }
  return dbInstance;
}

/**
 * Close the database connection
 */
export function closeDB(): void {
  if (dbInstance) {
    dbInstance.close();
    dbInstance = null;
  }
}

/**
 * Clear all data from the database (for privacy/reset purposes)
 */
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['stories', 'progress', 'preferences', 'assets', 'nfts', 'sessions', 'audioCache'], 'readwrite');
  
  await Promise.all([
    tx.objectStore('stories').clear(),
    tx.objectStore('progress').clear(),
    tx.objectStore('preferences').clear(),
    tx.objectStore('assets').clear(),
    tx.objectStore('nfts').clear(),
    tx.objectStore('sessions').clear(),
    tx.objectStore('audioCache').clear(),
  ]);
  
  await tx.done;
  console.log('All database data cleared');
}

/**
 * Get storage usage statistics
 */
export async function getStorageStats(): Promise<{
  totalSize: number;
  storesSizes: Record<string, number>;
  itemCounts: Record<string, number>;
}> {
  const db = await getDB();
  const stores = ['stories', 'progress', 'preferences', 'assets', 'nfts', 'sessions', 'audioCache'] as const;
  
  const stats = {
    totalSize: 0,
    storesSizes: {} as Record<string, number>,
    itemCounts: {} as Record<string, number>,
  };
  
  for (const storeName of stores) {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const items = await store.getAll();
    
    let storeSize = 0;
    items.forEach(item => {
      // Rough size estimation
      storeSize += JSON.stringify(item).length * 2; // UTF-16 encoding
    });
    
    stats.storesSizes[storeName] = storeSize;
    stats.itemCounts[storeName] = items.length;
    stats.totalSize += storeSize;
  }
  
  return stats;
}

/**
 * Clean up old or unused data to free storage space
 */
export async function cleanupStorage(): Promise<void> {
  const db = await getDB();
  const now = Date.now();
  const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = now - (30 * 24 * 60 * 60 * 1000);
  
  // Clean up old sessions (older than 1 week)
  const sessionsTx = db.transaction('sessions', 'readwrite');
  const sessionsStore = sessionsTx.objectStore('sessions');
  const oldSessions = await sessionsStore.index('by-start-time').getAllKeys(IDBKeyRange.upperBound(oneWeekAgo));
  
  for (const key of oldSessions) {
    await sessionsStore.delete(key);
  }
  
  // Clean up unused audio cache (not accessed in 1 month)
  const audioTx = db.transaction('audioCache', 'readwrite');
  const audioStore = audioTx.objectStore('audioCache');
  const oldAudio = await audioStore.index('by-last-accessed').getAllKeys(IDBKeyRange.upperBound(oneMonthAgo));
  
  for (const key of oldAudio) {
    await audioStore.delete(key);
  }
  
  // Clean up large unused assets
  const assetsTx = db.transaction('assets', 'readwrite');
  const assetsStore = assetsTx.objectStore('assets');
  const oldAssets = await assetsStore.index('by-last-accessed').getAllKeys(IDBKeyRange.upperBound(oneMonthAgo));
  
  for (const key of oldAssets) {
    await assetsStore.delete(key);
  }
  
  await Promise.all([sessionsTx.done, audioTx.done, assetsTx.done]);
  console.log('Storage cleanup completed');
}

/**
 * Check if storage quota is approaching limits
 */
export async function checkStorageQuota(): Promise<{
  usage: number;
  quota: number;
  percentUsed: number;
  needsCleanup: boolean;
}> {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    const usage = estimate.usage || 0;
    const quota = estimate.quota || 0;
    const percentUsed = quota > 0 ? (usage / quota) * 100 : 0;
    
    return {
      usage,
      quota,
      percentUsed,
      needsCleanup: percentUsed > 80, // Cleanup when over 80% full
    };
  }
  
  // Fallback for browsers without storage estimation
  return {
    usage: 0,
    quota: 0,
    percentUsed: 0,
    needsCleanup: false,
  };
}

/**
 * Export data for backup or transfer (privacy-compliant)
 */
export async function exportUserData(userId: string): Promise<{
  preferences: UserPreferences | null;
  progress: StoryProgress[];
  nfts: NFTAsset[];
  exportedAt: number;
}> {
  const db = await getDB();
  
  // Get user preferences
  const preferences = await db.get('preferences', userId);
  
  // Get user progress
  const progressTx = db.transaction('progress', 'readonly');
  const allProgress = await progressTx.objectStore('progress').index('by-user').getAll(userId);
  
  // Get user NFTs (if any)
  const nftsTx = db.transaction('nfts', 'readonly');
  const allNFTs = await nftsTx.objectStore('nfts').getAll();
  const userNFTs = allNFTs.filter(nft => nft.owner === userId);
  
  return {
    preferences: preferences || null,
    progress: allProgress,
    nfts: userNFTs,
    exportedAt: Date.now(),
  };
}

/**
 * Import user data from backup
 */
export async function importUserData(
  userId: string, 
  data: {
    preferences?: UserPreferences;
    progress?: StoryProgress[];
    nfts?: NFTAsset[];
  }
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['preferences', 'progress', 'nfts'], 'readwrite');
  
  // Import preferences
  if (data.preferences) {
    await tx.objectStore('preferences').put({ ...data.preferences, userId });
  }
  
  // Import progress
  if (data.progress) {
    for (const progress of data.progress) {
      await tx.objectStore('progress').put(progress);
    }
  }
  
  // Import NFTs
  if (data.nfts) {
    for (const nft of data.nfts) {
      await tx.objectStore('nfts').put(nft);
    }
  }
  
  await tx.done;
  console.log('User data imported successfully');
}