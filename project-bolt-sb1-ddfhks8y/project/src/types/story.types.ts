/**
 * Story-related type definitions for Curmunchkins Mystery Box Explorer
 * Defines the structure for story content, nodes, and narrative elements
 */

export type MunchieCharacter = 
  | 'silo'      // Autism: Detail-oriented, pattern-loving, sensory-aware
  | 'blip'      // ADHD: Energetic, creative, hyperfocus capable
  | 'pip'       // Dyslexia: Visual storyteller, creative problem-solver
  | 'tally'     // Dyscalculia: Word-loving, innovative thinking
  | 'tumble'    // Dyspraxia: Empathetic, intuitive, persistent
  | 'echo'      // Tourette's: Quick-thinking, observant, resilient
  | 'sway'      // Mental Health: Emotionally intelligent, reflective
  | 'ponder';   // Acquired Neurodivergence: Adaptive, wise, transformative

export type AttachmentType = 
  | 'fidget_feet'     // Proprioceptive input through foot movement
  | 'weighted_arms'   // Deep pressure for calming
  | 'bouncy_braids'   // Tactile stimulation and visual tracking
  | 'squeeze_belly'   // Pressure regulation and emotional comfort
  | 'texture_hands'   // Tactile exploration and sensory input
  | 'sound_ears'      // Auditory processing and noise regulation
  | 'light_eyes'      // Visual processing and light sensitivity
  | 'scent_nose';     // Olfactory regulation and memory triggers

export type SensoryStrategy = 
  | 'proprioceptive_input'    // Body awareness and positioning
  | 'deep_pressure'           // Calming through weighted input
  | 'tactile_exploration'     // Touch-based learning and regulation
  | 'vestibular_movement'     // Balance and spatial awareness
  | 'auditory_processing'     // Sound-based regulation
  | 'visual_organization'     // Sight-based calming and focus
  | 'olfactory_grounding'     // Scent-based emotional regulation
  | 'interoceptive_awareness'; // Internal body signal recognition

export type EmotionType = 
  | 'calm'
  | 'excited'
  | 'curious'
  | 'gentle'
  | 'encouraging'
  | 'understanding'
  | 'playful'
  | 'reassuring';

export type RarityTier = 'common' | 'rare' | 'epic' | 'legendary';

export interface VisualCue {
  type: 'animation' | 'highlight' | 'glow' | 'pulse' | 'bounce';
  target: string; // CSS selector or element ID
  duration: number; // milliseconds
  intensity: 'subtle' | 'moderate' | 'strong';
}

export interface VoicePrompt {
  text: string;
  expectedResponses: string[];
  timeout: number; // milliseconds to wait for response
  fallbackAction: 'continue' | 'repeat' | 'skip';
  encouragement: string; // What to say if child doesn't respond
}

export interface StorySegment {
  id: string;
  text: string;
  voiceEmotion: EmotionType;
  visualCues: VisualCue[];
  voicePrompts?: VoicePrompt[];
  duration: number; // Expected reading/listening time in seconds
  pauseAfter?: number; // Optional pause for processing
}

export interface StoryBranch {
  condition: string; // Condition for taking this branch
  targetSegmentId: string;
  weight: number; // Probability weight for random selection
}

export interface StoryNode {
  id: string;
  attachmentType: AttachmentType;
  content: StorySegment;
  branches: StoryBranch[];
  sensoryStrategy: SensoryStrategy;
  isEndNode: boolean;
  unlockRequirements?: string[]; // Prerequisites for accessing this node
}

export interface StoryMetadata {
  title: string;
  description: string;
  estimatedDuration: number; // Total story duration in minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  sensoryFocus: SensoryStrategy[];
  therapeuticGoals: string[];
  ageRange: {
    min: number;
    max: number;
  };
}

export interface StoryContent {
  id: string;
  attachmentId: string;
  characterId: MunchieCharacter;
  metadata: StoryMetadata;
  startNodeId: string;
  nodes: Record<string, StoryNode>;
  version: string;
  lastModified: number;
  createdAt: number;
}

export interface StoryProgress {
  storyId: string;
  userId: string;
  currentNodeId: string;
  visitedNodes: string[];
  completedNodes: string[];
  startedAt: number;
  lastAccessedAt: number;
  completedAt?: number;
  totalTimeSpent: number; // milliseconds
  choicesMade: DecisionRecord[];
  isCompleted: boolean;
}

export interface DecisionRecord {
  nodeId: string;
  choice: string;
  timestamp: number;
  responseTime: number; // milliseconds taken to make choice
  voiceResponse?: string; // What the child said, if applicable
}

export interface StorySession {
  id: string;
  storyId: string;
  userId: string;
  startedAt: number;
  endedAt?: number;
  progress: StoryProgress;
  accessibilitySettings: {
    voiceSpeed: number;
    fontSize: string;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  parentSupervision: boolean;
}

export interface StoryCollection {
  userId: string;
  unlockedStories: string[];
  favoriteStories: string[];
  completedStories: string[];
  totalStoriesRead: number;
  totalTimeSpent: number;
  preferredCharacter: MunchieCharacter;
  preferredAttachments: AttachmentType[];
  lastUpdated: number;
}

// Story validation and content safety
export interface ContentSafetyCheck {
  storyId: string;
  checkedAt: number;
  checkedBy: string; // Therapist or content reviewer ID
  safetyRating: 'safe' | 'review_needed' | 'unsafe';
  therapeuticValue: 'high' | 'medium' | 'low';
  ageAppropriate: boolean;
  sensoryConsiderations: string[];
  notes: string;
}

// Story analytics for therapeutic insights
export interface StoryAnalytics {
  storyId: string;
  totalPlays: number;
  averageCompletionTime: number;
  completionRate: number; // Percentage of users who complete the story
  popularChoices: Record<string, number>; // Choice frequency
  dropOffPoints: string[]; // Node IDs where users commonly stop
  therapeuticEffectiveness: number; // 0-10 rating from parent feedback
  accessibilityUsage: {
    voiceSpeedAdjustments: number;
    fontSizeChanges: number;
    contrastToggled: number;
    motionReduced: number;
  };
}

// Story creation and editing (for future content management)
export interface StoryTemplate {
  id: string;
  name: string;
  description: string;
  characterId: MunchieCharacter;
  attachmentType: AttachmentType;
  sensoryStrategy: SensoryStrategy;
  nodeTemplates: Partial<StoryNode>[];
  estimatedCreationTime: number; // minutes
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Error handling for story loading and playback
export interface StoryError {
  code: 'STORY_NOT_FOUND' | 'INVALID_FORMAT' | 'NETWORK_ERROR' | 'PERMISSION_DENIED' | 'CONTENT_UNSAFE';
  message: string;
  storyId?: string;
  nodeId?: string;
  timestamp: number;
  recoverable: boolean;
  suggestedAction: string;
}

// Type guards for runtime validation
export const isMunchieCharacter = (value: string): value is MunchieCharacter => {
  return ['silo', 'blip', 'pip', 'tally', 'tumble', 'echo', 'sway', 'ponder'].includes(value);
};

export const isAttachmentType = (value: string): value is AttachmentType => {
  return [
    'fidget_feet', 'weighted_arms', 'bouncy_braids', 'squeeze_belly',
    'texture_hands', 'sound_ears', 'light_eyes', 'scent_nose'
  ].includes(value);
};

export const isSensoryStrategy = (value: string): value is SensoryStrategy => {
  return [
    'proprioceptive_input', 'deep_pressure', 'tactile_exploration',
    'vestibular_movement', 'auditory_processing', 'visual_organization',
    'olfactory_grounding', 'interoceptive_awareness'
  ].includes(value);
};

export const isEmotionType = (value: string): value is EmotionType => {
  return ['calm', 'excited', 'curious', 'gentle', 'encouraging', 'understanding', 'playful', 'reassuring'].includes(value);
};

// Utility types for story manipulation
export type StoryNodeUpdate = Partial<Omit<StoryNode, 'id'>>;
export type StoryContentUpdate = Partial<Omit<StoryContent, 'id' | 'createdAt'>>;
export type StoryProgressUpdate = Partial<Omit<StoryProgress, 'storyId' | 'startedAt'>>;