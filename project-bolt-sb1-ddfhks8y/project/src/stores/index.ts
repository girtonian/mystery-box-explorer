/**
 * Central export point for all Zustand stores
 * Provides unified access to application state management
 */

// Export individual stores
export { useAppStore } from './appStore';
export { useScannerStore } from './scannerStore';
export { useStoryStore } from './storyStore';
export { useVoiceStore } from './voiceStore';
export { useBlockchainStore } from './blockchainStore';

// Export store types for convenience
export type { AppState, AppActions } from './appStore';
export type { ScannerStoreState, ScannerStoreActions } from './scannerStore';
export type { StoryStoreState, StoryStoreActions } from './storyStore';
export type { VoiceStoreState, VoiceStoreActions } from './voiceStore';
export type { BlockchainStoreState, BlockchainStoreActions } from './blockchainStore';

/**
 * Initialize all stores
 * Call this once when the app starts
 */
export function initializeStores(): void {
  console.log('Initializing Zustand stores...');
  
  // Stores are automatically initialized when first accessed
  // This function serves as a placeholder for any future initialization logic
  
  console.log('Zustand stores initialized');
}

/**
 * Reset all stores to initial state
 * Useful for testing or user logout
 */
export function resetAllStores(): void {
  console.log('Resetting all stores...');
  
  // Get store instances and reset them
  const appStore = useAppStore.getState();
  const scannerStore = useScannerStore.getState();
  const storyStore = useStoryStore.getState();
  const voiceStore = useVoiceStore.getState();
  const blockchainStore = useBlockchainStore.getState();
  
  // Reset scanner
  scannerStore.resetScanner();
  
  // Unload current story
  storyStore.unloadStory();
  
  // End voice session
  if (voiceStore.currentSession) {
    voiceStore.endVoiceSession();
  }
  
  // Disconnect wallet
  if (blockchainStore.isConnected) {
    blockchainStore.disconnectWallet();
  }
  
  console.log('All stores reset');
}

/**
 * Get combined app state for debugging
 */
export function getAppState(): {
  app: any;
  scanner: any;
  story: any;
  voice: any;
  blockchain: any;
} {
  return {
    app: useAppStore.getState(),
    scanner: useScannerStore.getState(),
    story: useStoryStore.getState(),
    voice: useVoiceStore.getState(),
    blockchain: useBlockchainStore.getState(),
  };
}

/**
 * Subscribe to store changes for debugging
 */
export function subscribeToStoreChanges(callback: (state: any) => void): () => void {
  const unsubscribers = [
    useAppStore.subscribe(callback),
    useScannerStore.subscribe(callback),
    useStoryStore.subscribe(callback),
    useVoiceStore.subscribe(callback),
    useBlockchainStore.subscribe(callback),
  ];
  
  // Return function to unsubscribe from all stores
  return () => {
    unsubscribers.forEach(unsubscribe => unsubscribe());
  };
}