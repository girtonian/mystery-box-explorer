/**
 * User-related type definitions for Curmunchkins Mystery Box Explorer
 * Defines user profiles, preferences, and progress tracking
 */

import type { MunchieCharacter, AttachmentType, SensoryStrategy } from './story.types';

export type UserRole = 'child' | 'parent' | 'therapist' | 'educator';

export type AccessibilityNeed = 
  | 'visual_impairment'
  | 'hearing_impairment'
  | 'motor_impairment'
  | 'cognitive_differences'
  | 'autism_spectrum'
  | 'adhd'
  | 'dyslexia'
  | 'dyspraxia'
  | 'sensory_processing'
  | 'anxiety'
  | 'none';

export interface UserProfile {
  id: string;
  deviceId: string; // Unique device identifier for privacy
  role: UserRole;
  createdAt: number;
  lastActiveAt: number;
  
  // Child-specific information (optional, parent-controlled)
  childInfo?: {
    ageRange: '4-6' | '7-9' | '10-12';
    accessibilityNeeds: AccessibilityNeed[];
    sensoryPreferences: SensoryStrategy[];
    communicationStyle: 'verbal' | 'non_verbal' | 'mixed';
    attentionSpan: 'short' | 'medium' | 'long'; // 3-5min, 6-10min, 11-15min
    preferredInteractionStyle: 'independent' | 'guided' | 'collaborative';
  };
  
  // Privacy and safety settings
  privacy: {
    dataCollection: 'minimal' | 'standard' | 'enhanced';
    parentalControls: boolean;
    shareWithTherapist: boolean;
    anonymousAnalytics: boolean;
  };
}

export interface UserPreferences {
  userId: string;
  
  // Accessibility settings
  accessibility: {
    voiceSpeed: number; // 0.5 - 2.0
    voicePitch: number; // 0.5 - 2.0
    voiceVolume: number; // 0 - 1
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    visualContrast: 'normal' | 'high' | 'ultra-high';
    colorScheme: 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia';
    reduceMotion: boolean;
    reduceAnimations: boolean;
    simplifiedInterface: boolean;
    screenReaderOptimized: boolean;
  };
  
  // Story preferences
  story: {
    preferredCharacter: MunchieCharacter;
    favoriteAttachments: AttachmentType[];
    preferredStoryLength: 'short' | 'medium' | 'long'; // 3-5min, 6-10min, 11-15min
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
    autoplay: boolean;
    pauseBetweenSegments: boolean;
    repeatPrompts: boolean;
  };
  
  // Interaction preferences
  interaction: {
    voiceInteraction: boolean;
    touchInteraction: boolean;
    keyboardNavigation: boolean;
    gestureControls: boolean;
    hapticFeedback: boolean;
    confirmationPrompts: boolean;
  };
  
  // Sensory preferences
  sensory: {
    preferredSensoryStrategies: SensoryStrategy[];
    sensoryBreakFrequency: 'never' | 'low' | 'medium' | 'high';
    sensoryBreakDuration: number; // seconds
    backgroundSounds: boolean;
    visualEffects: 'minimal' | 'moderate' | 'full';
  };
  
  lastUpdated: number;
}

export interface UserProgress {
  userId: string;
  
  // Overall statistics
  stats: {
    totalStoriesUnlocked: number;
    totalStoriesCompleted: number;
    totalTimeSpent: number; // milliseconds
    sessionsCount: number;
    averageSessionDuration: number; // milliseconds
    longestStreak: number; // consecutive days
    currentStreak: number; // consecutive days
    lastSessionDate: number;
  };
  
  // Story-specific progress
  storyProgress: Record<string, {
    unlocked: boolean;
    started: boolean;
    completed: boolean;
    completionPercentage: number;
    bestTime: number; // fastest completion time
    timesPlayed: number;
    lastPlayed: number;
    favorited: boolean;
  }>;
  
  // Character relationships
  characterBonds: Record<MunchieCharacter, {
    storiesCompleted: number;
    timeSpent: number;
    favoriteLevel: number; // 0-10
    lastInteraction: number;
  }>;
  
  // Attachment usage
  attachmentUsage: Record<AttachmentType, {
    timesScanned: number;
    storiesUnlocked: number;
    lastUsed: number;
    effectivenessRating: number; // 0-10, based on completion rates
  }>;
  
  // Learning and development insights
  development: {
    sensoryStrategiesLearned: SensoryStrategy[];
    regulationSkillsImproved: string[];
    communicationGrowth: string[];
    confidenceLevel: number; // 0-10
    independenceLevel: number; // 0-10
  };
  
  lastUpdated: number;
}

export interface ParentDashboard {
  childUserId: string;
  parentUserId: string;
  
  // Summary insights
  insights: {
    weeklyProgress: {
      storiesCompleted: number;
      timeSpent: number;
      newSkillsLearned: string[];
      challengesEncountered: string[];
    };
    
    monthlyTrends: {
      engagementLevel: number; // 0-10
      preferredActivities: AttachmentType[];
      growthAreas: SensoryStrategy[];
      recommendedFocus: string[];
    };
    
    therapeuticGoals: {
      current: string[];
      achieved: string[];
      inProgress: string[];
      recommended: string[];
    };
  };
  
  // Settings and controls
  controls: {
    sessionTimeLimit: number; // minutes, 0 = no limit
    allowedStoryTypes: AttachmentType[];
    requireParentApproval: boolean;
    shareDataWithTherapist: boolean;
    emergencyContact: string;
  };
  
  // Communication log
  communicationLog: {
    date: number;
    type: 'achievement' | 'concern' | 'milestone' | 'recommendation';
    message: string;
    actionRequired: boolean;
  }[];
  
  lastUpdated: number;
}

export interface TherapistInsights {
  childUserId: string;
  therapistId: string;
  
  // Clinical observations
  observations: {
    sensoryProcessingPatterns: {
      seeking: SensoryStrategy[];
      avoiding: SensoryStrategy[];
      neutral: SensoryStrategy[];
    };
    
    regulationStrategies: {
      effective: string[];
      emerging: string[];
      needsSupport: string[];
    };
    
    communicationPatterns: {
      preferredMethods: string[];
      strengths: string[];
      growthAreas: string[];
    };
    
    socialEmotionalDevelopment: {
      strengths: string[];
      challenges: string[];
      progress: string[];
    };
  };
  
  // Recommendations
  recommendations: {
    storyFocus: AttachmentType[];
    sensoryStrategies: SensoryStrategy[];
    parentGuidance: string[];
    environmentalModifications: string[];
    nextSteps: string[];
  };
  
  // Progress tracking
  clinicalGoals: {
    id: string;
    description: string;
    targetDate: number;
    progress: number; // 0-100%
    status: 'not_started' | 'in_progress' | 'achieved' | 'modified';
    notes: string[];
  }[];
  
  lastUpdated: number;
  nextReviewDate: number;
}

export interface UserSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  duration?: number; // milliseconds
  
  // Session activities
  activities: {
    storiesViewed: string[];
    attachmentsScanned: AttachmentType[];
    settingsChanged: string[];
    errorsEncountered: string[];
    achievementsUnlocked: string[];
  };
  
  // Performance metrics
  metrics: {
    engagementLevel: number; // 0-10
    frustrationLevel: number; // 0-10
    completionRate: number; // 0-100%
    helpRequestsCount: number;
    pausesCount: number;
    averageResponseTime: number; // milliseconds
  };
  
  // Context information
  context: {
    deviceType: 'mobile' | 'tablet' | 'desktop';
    browserInfo: string;
    networkQuality: 'poor' | 'fair' | 'good' | 'excellent';
    parentPresent: boolean;
    environmentalFactors: string[]; // noise, lighting, etc.
  };
}

export interface UserAchievement {
  id: string;
  userId: string;
  type: 'story_completion' | 'character_bond' | 'skill_mastery' | 'consistency' | 'exploration';
  title: string;
  description: string;
  iconUrl: string;
  unlockedAt: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  
  // Achievement criteria
  criteria: {
    requirement: string;
    progress: number;
    target: number;
    completed: boolean;
  };
  
  // Rewards
  rewards: {
    nftMinted: boolean;
    storyUnlocked?: string;
    characterUnlocked?: MunchieCharacter;
    attachmentUnlocked?: AttachmentType;
  };
}

// Type guards for user data validation
export const isUserRole = (value: string): value is UserRole => {
  return ['child', 'parent', 'therapist', 'educator'].includes(value);
};

export const isAccessibilityNeed = (value: string): value is AccessibilityNeed => {
  return [
    'visual_impairment', 'hearing_impairment', 'motor_impairment',
    'cognitive_differences', 'autism_spectrum', 'adhd', 'dyslexia',
    'dyspraxia', 'sensory_processing', 'anxiety', 'none'
  ].includes(value);
};

// Utility types for user data manipulation
export type UserProfileUpdate = Partial<Omit<UserProfile, 'id' | 'deviceId' | 'createdAt'>>;
export type UserPreferencesUpdate = Partial<Omit<UserPreferences, 'userId'>>;
export type UserProgressUpdate = Partial<Omit<UserProgress, 'userId'>>;

// Privacy-safe user data (for analytics and sharing)
export interface AnonymizedUserData {
  ageRange?: '4-6' | '7-9' | '10-12';
  accessibilityNeeds: AccessibilityNeed[];
  sensoryPreferences: SensoryStrategy[];
  usagePatterns: {
    averageSessionDuration: number;
    preferredStoryLength: string;
    completionRate: number;
  };
  therapeuticProgress: {
    skillsImproved: string[];
    strategiesLearned: SensoryStrategy[];
    engagementTrends: number[];
  };
  timestamp: number;
}