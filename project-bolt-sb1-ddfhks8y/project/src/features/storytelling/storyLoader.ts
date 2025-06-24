/**
 * Story loading service for Curmunchkins Mystery Box Explorer
 * Handles loading, caching, and validation of story content
 */

import type { StoryContent, StoryError, MunchieCharacter, AttachmentType } from '@/types';
import { cacheStory, getCachedStory, isStoryCached } from '@/services/storage';

export class StoryLoader {
  private static instance: StoryLoader;
  private loadingPromises: Map<string, Promise<StoryContent>> = new Map();

  public static getInstance(): StoryLoader {
    if (!StoryLoader.instance) {
      StoryLoader.instance = new StoryLoader();
    }
    return StoryLoader.instance;
  }

  /**
   * Load a story by ID with caching
   */
  async loadStory(storyId: string): Promise<StoryContent> {
    // Check if already loading
    if (this.loadingPromises.has(storyId)) {
      return this.loadingPromises.get(storyId)!;
    }

    // Check cache first
    const cachedStory = await getCachedStory(storyId);
    if (cachedStory) {
      console.log(`Story loaded from cache: ${storyId}`);
      return cachedStory;
    }

    // Load from network
    const loadPromise = this.fetchStoryFromNetwork(storyId);
    this.loadingPromises.set(storyId, loadPromise);

    try {
      const story = await loadPromise;
      
      // Cache the story
      await cacheStory(story);
      
      console.log(`Story loaded and cached: ${storyId}`);
      return story;
    } catch (error) {
      console.error(`Failed to load story: ${storyId}`, error);
      throw this.createStoryError('STORY_NOT_FOUND', `Story ${storyId} could not be loaded`, storyId);
    } finally {
      this.loadingPromises.delete(storyId);
    }
  }

  /**
   * Load story by character and attachment type
   */
  async loadStoryByAttachment(
    characterId: MunchieCharacter,
    attachmentType: AttachmentType
  ): Promise<StoryContent> {
    const storyId = `${characterId}-${attachmentType.replace('_', '-')}-001`;
    return this.loadStory(storyId);
  }

  /**
   * Preload essential stories for offline use
   */
  async preloadEssentialStories(): Promise<void> {
    const essentialStories = [
      'silo-fidget-feet-001',
      'blip-weighted-arms-001',
    ];

    const preloadPromises = essentialStories.map(async (storyId) => {
      try {
        const isCached = await isStoryCached(storyId);
        if (!isCached) {
          await this.loadStory(storyId);
          console.log(`Preloaded story: ${storyId}`);
        }
      } catch (error) {
        console.warn(`Failed to preload story: ${storyId}`, error);
      }
    });

    await Promise.allSettled(preloadPromises);
    console.log('Story preloading completed');
  }

  /**
   * Get available stories for a character
   */
  async getStoriesForCharacter(characterId: MunchieCharacter): Promise<string[]> {
    // In a real implementation, this would query an API or index
    const storyMap: Record<MunchieCharacter, string[]> = {
      silo: ['silo-fidget-feet-001', 'silo-texture-hands-001'],
      blip: ['blip-weighted-arms-001', 'blip-fidget-feet-001'],
      pip: ['pip-bouncy-braids-001', 'pip-light-eyes-001'],
      tally: ['tally-sound-ears-001', 'tally-light-eyes-001'],
      tumble: ['tumble-squeeze-belly-001', 'tumble-weighted-arms-001'],
      echo: ['echo-bouncy-braids-001', 'echo-sound-ears-001'],
      sway: ['sway-weighted-arms-001', 'sway-scent-nose-001'],
      ponder: ['ponder-scent-nose-001', 'ponder-sound-ears-001'],
    };

    return storyMap[characterId] || [];
  }

  /**
   * Get available stories for an attachment type
   */
  async getStoriesForAttachment(attachmentType: AttachmentType): Promise<string[]> {
    const storyMap: Record<AttachmentType, string[]> = {
      fidget_feet: ['silo-fidget-feet-001', 'blip-fidget-feet-001'],
      weighted_arms: ['blip-weighted-arms-001', 'sway-weighted-arms-001', 'tumble-weighted-arms-001'],
      bouncy_braids: ['pip-bouncy-braids-001', 'echo-bouncy-braids-001'],
      squeeze_belly: ['tumble-squeeze-belly-001'],
      texture_hands: ['silo-texture-hands-001'],
      sound_ears: ['echo-sound-ears-001', 'tally-sound-ears-001', 'ponder-sound-ears-001'],
      light_eyes: ['pip-light-eyes-001', 'tally-light-eyes-001'],
      scent_nose: ['ponder-scent-nose-001', 'sway-scent-nose-001'],
    };

    return storyMap[attachmentType] || [];
  }

  /**
   * Check if a story exists
   */
  async storyExists(storyId: string): Promise<boolean> {
    try {
      // Check cache first
      const isCached = await isStoryCached(storyId);
      if (isCached) {
        return true;
      }

      // Check if story file exists
      const response = await fetch(`/stories/${storyId}.json`, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Fetch story from network (public folder or API)
   */
  private async fetchStoryFromNetwork(storyId: string): Promise<StoryContent> {
    try {
      // Remove version suffix from storyId to match actual filenames
      // e.g., 'silo-fidget-feet-001' -> 'silo-fidget-feet'
      const baseStoryId = storyId.replace(/-\d{3}$/, '');
      const response = await fetch(`/stories/${baseStoryId}.json`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const story: StoryContent = await response.json();
      
      // Validate story structure
      this.validateStoryStructure(story);
      
      return story;
    } catch (error) {
      console.error(`Network fetch failed for story: ${storyId}`, error);
      throw error;
    }
  }

  /**
   * Validate story structure
   */
  private validateStoryStructure(story: StoryContent): void {
    if (!story.id || !story.characterId || !story.attachmentId) {
      throw new Error('Story missing required fields');
    }

    if (!story.nodes || Object.keys(story.nodes).length === 0) {
      throw new Error('Story has no content nodes');
    }

    if (!story.startNodeId || !story.nodes[story.startNodeId]) {
      throw new Error('Story start node not found');
    }

    // Validate node structure
    for (const [nodeId, node] of Object.entries(story.nodes)) {
      if (!node.content || !node.content.text) {
        throw new Error(`Node ${nodeId} missing content`);
      }

      // Validate branches point to existing nodes
      for (const branch of node.branches) {
        if (!story.nodes[branch.targetSegmentId]) {
          throw new Error(`Node ${nodeId} branch points to non-existent node: ${branch.targetSegmentId}`);
        }
      }
    }
  }

  /**
   * Create a story error
   */
  private createStoryError(
    code: StoryError['code'],
    message: string,
    storyId?: string,
    nodeId?: string
  ): StoryError {
    return {
      code,
      message,
      storyId,
      nodeId,
      timestamp: Date.now(),
      recoverable: true,
      suggestedAction: 'Try again or select a different story',
    };
  }

  /**
   * Clear loading cache (for testing)
   */
  clearLoadingCache(): void {
    this.loadingPromises.clear();
  }
}

// Export singleton instance
export const storyLoader = StoryLoader.getInstance();
export default storyLoader;