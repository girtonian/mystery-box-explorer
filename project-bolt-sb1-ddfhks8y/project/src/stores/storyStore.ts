/**
 * Story state management using Zustand
 * Handles story content, progress tracking, and narrative flow
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  StoryContent,
  StoryProgress,
  StorySession,
  StoryNode,
  DecisionRecord,
  MunchieCharacter,
  AttachmentType,
  StoryError 
} from '@/types';

export interface StoryStoreState {
  // Current story state
  currentStory: StoryContent | null;
  currentProgress: StoryProgress | null;
  currentSession: StorySession | null;
  
  // Story navigation
  currentNode: StoryNode | null;
  visitedNodes: string[];
  availableChoices: string[];
  
  // Story collection
  unlockedStories: string[];
  completedStories: string[];
  favoriteStories: string[];
  
  // Loading and error states
  isLoading: boolean;
  error: StoryError | null;
  
  // Story preferences
  autoplay: boolean;
  pauseBetweenSegments: boolean;
  
  // Analytics
  sessionStartTime: number | null;
  totalTimeSpent: number;
  decisionsThisSession: DecisionRecord[];
}

export interface StoryStoreActions {
  // Story loading
  loadStory: (storyId: string) => Promise<void>;
  unloadStory: () => void;
  
  // Story navigation
  navigateToNode: (nodeId: string) => Promise<void>;
  makeDecision: (choice: string, voiceResponse?: string) => Promise<void>;
  goToNextNode: () => Promise<void>;
  goToPreviousNode: () => Promise<void>;
  
  // Story progress
  startStory: (storyId: string, characterId: MunchieCharacter) => Promise<void>;
  pauseStory: () => void;
  resumeStory: () => void;
  completeStory: () => Promise<void>;
  saveProgress: () => Promise<void>;
  
  // Story collection management
  unlockStory: (storyId: string, attachmentType: AttachmentType) => Promise<void>;
  toggleFavoriteStory: (storyId: string) => void;
  getStoryStats: () => Promise<any>;
  
  // Story preferences
  setAutoplay: (enabled: boolean) => void;
  setPauseBetweenSegments: (enabled: boolean) => void;
  
  // Error handling
  setError: (error: StoryError | null) => void;
  clearError: () => void;
  
  // Utilities
  getAvailableStories: () => Promise<StoryContent[]>;
  getStoriesByCharacter: (characterId: MunchieCharacter) => Promise<StoryContent[]>;
  getStoriesByAttachment: (attachmentType: AttachmentType) => Promise<StoryContent[]>;
  exportStoryData: () => any;
}

export const useStoryStore = create<StoryStoreState & StoryStoreActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentStory: null,
    currentProgress: null,
    currentSession: null,
    currentNode: null,
    visitedNodes: [],
    availableChoices: [],
    unlockedStories: [],
    completedStories: [],
    favoriteStories: [],
    isLoading: false,
    error: null,
    autoplay: true,
    pauseBetweenSegments: false,
    sessionStartTime: null,
    totalTimeSpent: 0,
    decisionsThisSession: [],

    // Actions
    loadStory: async (storyId) => {
      set({ isLoading: true, error: null });
      
      try {
        // Load story from cache or network
        const { storyLoader } = await import('@/features/storytelling/storyLoader');
        const story = await storyLoader.loadStory(storyId);
        
        if (!story) {
          throw new Error('Story not found');
        }
        
        // Load existing progress
        const { loadProgress } = await import('@/services/storage');
        const progress = await loadProgress(storyId);
        
        // Get current node
        const currentNodeId = progress?.currentNodeId || story.startNodeId;
        const currentNode = story.nodes[currentNodeId];
        
        if (!currentNode) {
          throw new Error('Story start node not found');
        }
        
        set({
          currentStory: story,
          currentProgress: progress,
          currentNode,
          visitedNodes: progress?.visitedNodes || [currentNodeId],
          isLoading: false,
        });
        
        console.log(`Story loaded: ${story.metadata.title}`);
        
      } catch (error) {
        console.error('Failed to load story:', error);
        get().setError({
          code: 'STORY_NOT_FOUND',
          message: 'Failed to load story',
          storyId,
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try again or select a different story',
        });
        set({ isLoading: false });
      }
    },

    unloadStory: () => {
      // Save progress before unloading
      get().saveProgress();
      
      set({
        currentStory: null,
        currentProgress: null,
        currentSession: null,
        currentNode: null,
        visitedNodes: [],
        availableChoices: [],
        sessionStartTime: null,
        decisionsThisSession: [],
      });
    },

    navigateToNode: async (nodeId) => {
      const { currentStory, currentProgress } = get();
      
      if (!currentStory || !currentProgress) {
        throw new Error('No active story');
      }
      
      const node = currentStory.nodes[nodeId];
      if (!node) {
        throw new Error('Node not found');
      }
      
      // Update progress
      const { updateProgressNode } = await import('@/services/storage');
      await updateProgressNode(currentStory.id, nodeId);
      
      // Update state
      set(state => ({
        currentNode: node,
        visitedNodes: [...new Set([...state.visitedNodes, nodeId])],
        currentProgress: state.currentProgress ? {
          ...state.currentProgress,
          currentNodeId: nodeId,
          visitedNodes: [...new Set([...state.visitedNodes, nodeId])],
          lastAccessedAt: Date.now(),
        } : null,
      }));
      
      console.log(`Navigated to node: ${nodeId}`);
    },

    makeDecision: async (choice, voiceResponse) => {
      const { currentNode, currentStory } = get();
      
      if (!currentNode || !currentStory) {
        throw new Error('No active story or node');
      }
      
      const decision: DecisionRecord = {
        nodeId: currentNode.id,
        choice,
        timestamp: Date.now(),
        responseTime: 0, // Would calculate from when choice was presented
        voiceResponse,
      };
      
      // Add to session decisions
      set(state => ({
        decisionsThisSession: [...state.decisionsThisSession, decision],
      }));
      
      // Find next node based on choice
      const branch = currentNode.branches.find(b => b.condition === choice);
      if (branch) {
        await get().navigateToNode(branch.targetSegmentId);
      }
      
      console.log(`Decision made: ${choice}`);
    },

    goToNextNode: async () => {
      const { currentNode } = get();
      
      if (!currentNode || currentNode.branches.length === 0) {
        return;
      }
      
      // If only one branch, auto-navigate
      if (currentNode.branches.length === 1) {
        await get().navigateToNode(currentNode.branches[0].targetSegmentId);
      } else {
        // Multiple choices available - set them for UI
        set({
          availableChoices: currentNode.branches.map(b => b.condition),
        });
      }
    },

    goToPreviousNode: async () => {
      const { visitedNodes } = get();
      
      if (visitedNodes.length < 2) {
        return; // Can't go back from first node
      }
      
      const previousNodeId = visitedNodes[visitedNodes.length - 2];
      await get().navigateToNode(previousNodeId);
    },

    startStory: async (storyId, characterId) => {
      try {
        // Load the story
        await get().loadStory(storyId);
        
        const { currentStory } = get();
        if (!currentStory) {
          throw new Error('Failed to load story');
        }
        
        // Initialize progress if not exists
        const { initializeStoryProgress } = await import('@/services/storage');
        const progress = await initializeStoryProgress(
          'current-user', // Would get from app store
          storyId,
          currentStory.startNodeId
        );
        
        // Create story session
        const session: StorySession = {
          id: crypto.randomUUID(),
          storyId,
          userId: 'current-user',
          startedAt: Date.now(),
          progress,
          accessibilitySettings: {
            voiceSpeed: 1.0,
            fontSize: 'medium',
            highContrast: false,
            reducedMotion: false,
          },
          parentSupervision: false,
        };
        
        set({
          currentSession: session,
          sessionStartTime: Date.now(),
          decisionsThisSession: [],
        });
        
        console.log(`Story started: ${currentStory.metadata.title}`);
        
      } catch (error) {
        console.error('Failed to start story:', error);
        get().setError({
          code: 'STORY_NOT_FOUND',
          message: 'Failed to start story',
          storyId,
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try again or select a different story',
        });
      }
    },

    pauseStory: () => {
      const { sessionStartTime, totalTimeSpent } = get();
      
      if (sessionStartTime) {
        const sessionTime = Date.now() - sessionStartTime;
        set({
          totalTimeSpent: totalTimeSpent + sessionTime,
          sessionStartTime: null,
        });
      }
      
      // Save progress
      get().saveProgress();
      
      console.log('Story paused');
    },

    resumeStory: () => {
      set({ sessionStartTime: Date.now() });
      console.log('Story resumed');
    },

    completeStory: async () => {
      const { currentStory, currentSession } = get();
      
      if (!currentStory) {
        return;
      }
      
      try {
        // Mark story as completed
        const { completeStory } = await import('@/services/storage');
        await completeStory(currentStory.id);
        
        // Update session
        if (currentSession) {
          const completedSession = {
            ...currentSession,
            endedAt: Date.now(),
          };
          
          set({ currentSession: completedSession });
        }
        
        // Add to completed stories
        set(state => ({
          completedStories: [...new Set([...state.completedStories, currentStory.id])],
        }));
        
        console.log(`Story completed: ${currentStory.metadata.title}`);
        
        // Trigger NFT minting (would integrate with blockchain store)
        // get().mintStoryNFT(currentStory.id);
        
      } catch (error) {
        console.error('Failed to complete story:', error);
        get().setError({
          code: 'NETWORK_ERROR',
          message: 'Failed to save story completion',
          storyId: currentStory.id,
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try again',
        });
      }
    },

    saveProgress: async () => {
      const { currentProgress } = get();
      
      if (!currentProgress) {
        return;
      }
      
      try {
        const { saveProgress } = await import('@/services/storage');
        await saveProgress(currentProgress);
        console.log('Progress saved');
      } catch (error) {
        console.error('Failed to save progress:', error);
      }
    },

    unlockStory: async (storyId, attachmentType) => {
      try {
        // Check if story is already unlocked
        const { unlockedStories } = get();
        if (unlockedStories.includes(storyId)) {
          console.log(`Story already unlocked: ${storyId}`);
          return;
        }
        
        // Add to unlocked stories
        set(state => ({
          unlockedStories: [...state.unlockedStories, storyId],
        }));
        
        console.log(`Story unlocked: ${storyId} (${attachmentType})`);
        
        // Save to storage
        // This would be implemented with user preferences
        
      } catch (error) {
        console.error('Failed to unlock story:', error);
        get().setError({
          code: 'NETWORK_ERROR',
          message: 'Failed to unlock story',
          storyId,
          timestamp: Date.now(),
          recoverable: true,
          suggestedAction: 'Try scanning again',
        });
      }
    },

    toggleFavoriteStory: (storyId) => {
      set(state => {
        const isFavorite = state.favoriteStories.includes(storyId);
        return {
          favoriteStories: isFavorite
            ? state.favoriteStories.filter(id => id !== storyId)
            : [...state.favoriteStories, storyId],
        };
      });
    },

    getStoryStats: async () => {
      try {
        const { getProgressStats } = await import('@/services/storage');
        return await getProgressStats('current-user');
      } catch (error) {
        console.error('Failed to get story stats:', error);
        return null;
      }
    },

    setAutoplay: (enabled) => {
      set({ autoplay: enabled });
    },

    setPauseBetweenSegments: (enabled) => {
      set({ pauseBetweenSegments: enabled });
    },

    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    getAvailableStories: async () => {
      try {
        const { getAllCachedStories } = await import('@/services/storage');
        return await getAllCachedStories();
      } catch (error) {
        console.error('Failed to get available stories:', error);
        return [];
      }
    },

    getStoriesByCharacter: async (characterId) => {
      try {
        const { getStoriesByCharacter } = await import('@/services/storage');
        return await getStoriesByCharacter(characterId);
      } catch (error) {
        console.error('Failed to get stories by character:', error);
        return [];
      }
    },

    getStoriesByAttachment: async (attachmentType) => {
      try {
        const { getStoriesByAttachment } = await import('@/services/storage');
        return await getStoriesByAttachment(attachmentType);
      } catch (error) {
        console.error('Failed to get stories by attachment:', error);
        return [];
      }
    },

    exportStoryData: () => {
      const { 
        currentStory, 
        currentProgress, 
        unlockedStories, 
        completedStories, 
        favoriteStories,
        totalTimeSpent,
        decisionsThisSession 
      } = get();
      
      return {
        currentStory: currentStory?.id,
        currentProgress,
        unlockedStories,
        completedStories,
        favoriteStories,
        totalTimeSpent,
        decisionsThisSession,
        exportedAt: Date.now(),
      };
    },
  }))
);

// Auto-save progress periodically
if (typeof window !== 'undefined') {
  setInterval(() => {
    const { currentProgress } = useStoryStore.getState();
    if (currentProgress) {
      useStoryStore.getState().saveProgress();
    }
  }, 30000); // Save every 30 seconds
}