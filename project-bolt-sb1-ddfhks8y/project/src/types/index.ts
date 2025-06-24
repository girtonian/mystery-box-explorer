/**
 * Central type definitions export for Curmunchkins Mystery Box Explorer
 * Provides a single import point for all application types
 */

// Story-related types
export type {
  MunchieCharacter,
  AttachmentType,
  SensoryStrategy,
  EmotionType,
  RarityTier,
  VisualCue,
  VoicePrompt,
  StorySegment,
  StoryBranch,
  StoryNode,
  StoryMetadata,
  StoryContent,
  StoryProgress,
  DecisionRecord,
  StorySession,
  StoryCollection,
  ContentSafetyCheck,
  StoryAnalytics,
  StoryTemplate,
  StoryError,
  StoryNodeUpdate,
  StoryContentUpdate,
  StoryProgressUpdate,
} from './story.types';

export {
  isMunchieCharacter,
  isAttachmentType,
  isSensoryStrategy,
  isEmotionType,
} from './story.types';

// User-related types
export type {
  UserRole,
  AccessibilityNeed,
  UserProfile,
  UserPreferences,
  UserProgress,
  ParentDashboard,
  TherapistInsights,
  UserSession,
  UserAchievement,
  UserProfileUpdate,
  UserPreferencesUpdate,
  UserProgressUpdate,
  AnonymizedUserData,
} from './user.types';

export {
  isUserRole,
  isAccessibilityNeed,
} from './user.types';

// Voice AI types
export type {
  VoiceProvider,
  VoiceQuality,
  SpeechRecognitionLanguage,
  VoiceSettings,
  CharacterVoice,
  VoiceSynthesisRequest,
  VoiceSynthesisResponse,
  SpeechRecognitionConfig,
  SpeechRecognitionResult,
  VoiceInteraction,
  VoiceSession,
  AudioCache,
  VoiceCalibration,
  VoiceError,
  VoiceAnalytics,
  VoiceCommand,
  VoiceCommandConfig,
  AudioEffect,
  AudioProcessingPipeline,
  VoiceSettingsUpdate,
  CharacterVoiceUpdate,
  VoiceSessionUpdate,
} from './voice.types';

export {
  isVoiceProvider,
  isVoiceQuality,
  isSpeechRecognitionLanguage,
  isVoiceCommand,
  DEFAULT_VOICE_SETTINGS,
  DEFAULT_SPEECH_RECOGNITION_CONFIG,
} from './voice.types';

// Blockchain types
export type {
  NetworkType,
  WalletProvider,
  TransactionStatus,
  AssetType,
  WalletConnection,
  AlgorandAccount,
  AlgorandAsset,
  NFTMetadata,
  NFTAsset,
  TransactionRequest,
  TransactionResult,
  MintingRequest,
  MintingResult,
  CollectionStats,
  MarketplaceData,
  BlockchainError,
  IPFSUpload,
  WalletConnectionUpdate,
  NFTMetadataUpdate,
  TransactionRequestUpdate,
} from './blockchain.types';

export {
  isNetworkType,
  isWalletProvider,
  isTransactionStatus,
  isAssetType,
  DEFAULT_NETWORK_CONFIG,
  DEFAULT_MINTING_CONFIG,
} from './blockchain.types';

// Scanner types
export type {
  ScannerState,
  CameraFacing,
  ScanMethod,
  CameraConstraints,
  CameraDevice,
  ScannerConfig,
  QRCodeData,
  AttachmentCode,
  ScanResult,
  ScanErrorCode,
  ScanError,
  ScanSession,
  ScannerCalibration,
  ManualEntryData,
  FileUploadData,
  ScannerConfigUpdate,
  ScanResultUpdate,
  ScanSessionUpdate,
} from './scanner.types';

export {
  isScannerState,
  isCameraFacing,
  isScanMethod,
  isScanErrorCode,
  DEFAULT_SCANNER_CONFIG,
  ATTACHMENT_CODE_PATTERN,
  ATTACHMENT_CODE_LENGTH,
  QR_CODE_FORMATS,
} from './scanner.types';

// Theme and accessibility types (from styles/themes.ts)
export type {
  ThemeMode,
  AccessibilitySettings,
} from '../styles/themes';

export {
  DEFAULT_THEME,
  DEFAULT_ACCESSIBILITY,
  COLOR_SCHEMES,
  FONT_SCALES,
  MOTION_CONFIGS,
  CONTRAST_RATIOS,
  SPACING_SCALES,
  getColorScheme,
  getFontScale,
  getMotionConfig,
  getContrastRatio,
  generateCSSVariables,
  detectSystemPreferences,
  validateAccessibility,
} from '../styles/themes';

// Common utility types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
  requestId: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export interface AsyncState<T = any> extends LoadingState {
  data: T | null;
}

// Event types for application-wide communication
export interface AppEvent {
  type: string;
  payload?: any;
  timestamp: number;
  source: string;
}

export interface StoryEvent extends AppEvent {
  type: 'story_started' | 'story_completed' | 'story_paused' | 'story_resumed' | 'story_error';
  payload: {
    storyId: string;
    characterId: MunchieCharacter;
    attachmentType: AttachmentType;
    progress?: number;
    error?: string;
  };
}

export interface ScanEvent extends AppEvent {
  type: 'scan_started' | 'scan_success' | 'scan_failed' | 'scan_cancelled';
  payload: {
    method: ScanMethod;
    attachmentType?: AttachmentType;
    error?: ScanErrorCode;
    duration?: number;
  };
}

export interface VoiceEvent extends AppEvent {
  type: 'voice_started' | 'voice_completed' | 'voice_error' | 'voice_settings_changed';
  payload: {
    characterId: MunchieCharacter;
    text?: string;
    emotion?: EmotionType;
    settings?: Partial<VoiceSettings>;
    error?: string;
  };
}

export interface BlockchainEvent extends AppEvent {
  type: 'wallet_connected' | 'wallet_disconnected' | 'nft_minted' | 'transaction_completed' | 'blockchain_error';
  payload: {
    walletAddress?: string;
    assetId?: number;
    txId?: string;
    error?: string;
  };
}

// Configuration types
export interface AppConfig {
  version: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    voiceAI: boolean;
    blockchain: boolean;
    analytics: boolean;
    parentControls: boolean;
    offlineMode: boolean;
  };
  limits: {
    maxSessionDuration: number; // minutes
    maxStoriesPerDay: number;
    maxRetryAttempts: number;
    cacheSize: number; // MB
  };
  urls: {
    api: string;
    ipfs: string;
    support: string;
    privacy: string;
    terms: string;
  };
}

// Error handling types
export interface AppError {
  id: string;
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  context: {
    userId?: string;
    storyId?: string;
    component: string;
    action: string;
    userAgent: string;
    url: string;
  };
  stack?: string;
  recoverable: boolean;
  reported: boolean;
}

// Performance monitoring types
export interface PerformanceMetrics {
  timestamp: number;
  metrics: {
    loadTime: number;
    renderTime: number;
    interactionTime: number;
    memoryUsage: number;
    cacheHitRate: number;
    errorRate: number;
  };
  context: {
    userId: string;
    deviceType: string;
    networkType: string;
    batteryLevel?: number;
  };
}

// Accessibility compliance types
export interface AccessibilityCompliance {
  wcagLevel: 'A' | 'AA' | 'AAA';
  checks: {
    colorContrast: boolean;
    keyboardNavigation: boolean;
    screenReaderSupport: boolean;
    focusManagement: boolean;
    semanticMarkup: boolean;
    alternativeText: boolean;
    captionsAvailable: boolean;
  };
  lastAudited: number;
  auditedBy: string;
  issues: {
    severity: 'minor' | 'moderate' | 'major' | 'critical';
    description: string;
    location: string;
    recommendation: string;
  }[];
}

// Type utility helpers
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Brand types for type safety
export type UserId = string & { readonly brand: unique symbol };
export type StoryId = string & { readonly brand: unique symbol };
export type AssetId = number & { readonly brand: unique symbol };
export type TransactionId = string & { readonly brand: unique symbol };
export type DeviceId = string & { readonly brand: unique symbol };

// Type guards for branded types
export const isUserId = (value: string): value is UserId => {
  return typeof value === 'string' && value.length > 0;
};

export const isStoryId = (value: string): value is StoryId => {
  return typeof value === 'string' && value.length > 0;
};

export const isAssetId = (value: number): value is AssetId => {
  return typeof value === 'number' && value > 0;
};

export const isTransactionId = (value: string): value is TransactionId => {
  return typeof value === 'string' && value.length > 0;
};

export const isDeviceId = (value: string): value is DeviceId => {
  return typeof value === 'string' && value.length > 0;
};