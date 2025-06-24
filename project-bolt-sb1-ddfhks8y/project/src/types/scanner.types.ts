/**
 * Scanner and QR code-related type definitions for Curmunchkins Mystery Box Explorer
 * Defines camera access, QR detection, and attachment recognition
 */

import type { AttachmentType } from './story.types';

export type ScannerState = 'idle' | 'initializing' | 'scanning' | 'processing' | 'success' | 'error';

export type CameraFacing = 'user' | 'environment';

export type ScanMethod = 'camera' | 'manual' | 'file_upload';

export interface CameraConstraints {
  video: {
    width?: { min?: number; ideal?: number; max?: number };
    height?: { min?: number; ideal?: number; max?: number };
    aspectRatio?: { ideal?: number };
    frameRate?: { ideal?: number; max?: number };
    facingMode?: CameraFacing;
    deviceId?: string;
  };
  audio: false; // We don't need audio for scanning
}

export interface CameraDevice {
  deviceId: string;
  label: string;
  kind: 'videoinput';
  groupId: string;
  facing: CameraFacing;
  capabilities?: {
    width?: { min: number; max: number };
    height?: { min: number; max: number };
    frameRate?: { min: number; max: number };
    focusMode?: string[];
    torch?: boolean;
    zoom?: { min: number; max: number; step: number };
  };
}

export interface ScannerConfig {
  // QR Scanner settings
  qrScanner: {
    highlightScanRegion: boolean;
    highlightCodeOutline: boolean;
    maxScansPerSecond: number;
    preferredCamera: CameraFacing;
    calculateScanRegion: boolean;
    returnDetailedScanResult: boolean;
  };
  
  // Camera settings
  camera: {
    constraints: CameraConstraints;
    autoFocus: boolean;
    torch: boolean;
    zoom: number;
    resolution: 'low' | 'medium' | 'high' | 'ultra';
  };
  
  // Processing settings
  processing: {
    timeout: number; // milliseconds
    retryAttempts: number;
    debounceDelay: number; // milliseconds between scans
    confidenceThreshold: number; // 0-1
    validateChecksum: boolean;
  };
  
  // Accessibility settings
  accessibility: {
    announceResults: boolean;
    hapticFeedback: boolean;
    visualFeedback: boolean;
    audioFeedback: boolean;
    largeTargetArea: boolean;
  };
  
  // Fallback options
  fallback: {
    enableManualEntry: boolean;
    enableFileUpload: boolean;
    showHelpText: boolean;
    provideScanningTips: boolean;
  };
}

export interface QRCodeData {
  data: string;
  format: 'QR_CODE' | 'DATA_MATRIX' | 'CODE_128' | 'CODE_39' | 'EAN_13' | 'EAN_8';
  
  // Scan quality metrics
  quality: {
    confidence: number; // 0-1
    readability: number; // 0-1
    contrast: number; // 0-1
    sharpness: number; // 0-1
  };
  
  // Geometric information
  geometry: {
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    cornerPoints: {
      topLeft: { x: number; y: number };
      topRight: { x: number; y: number };
      bottomLeft: { x: number; y: number };
      bottomRight: { x: number; y: number };
    };
  };
  
  // Scan context
  context: {
    timestamp: number;
    cameraDevice: string;
    scanDuration: number; // milliseconds
    attemptNumber: number;
    lightingConditions: 'poor' | 'fair' | 'good' | 'excellent';
  };
}

export interface AttachmentCode {
  code: string;
  attachmentType: AttachmentType;
  version: string;
  
  // Validation data
  validation: {
    checksum: string;
    isValid: boolean;
    expiresAt?: number;
    activatedAt?: number;
  };
  
  // Metadata
  metadata: {
    manufacturingDate: number;
    batchNumber: string;
    serialNumber: string;
    qualityGrade: 'A' | 'B' | 'C';
  };
  
  // Associated content
  content: {
    storyIds: string[];
    characterCompatibility: string[];
    ageRange: { min: number; max: number };
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  };
}

export interface ScanResult {
  success: boolean;
  method: ScanMethod;
  timestamp: number;
  
  // Successful scan data
  data?: {
    qrCode: QRCodeData;
    attachment: AttachmentCode;
    unlockData: {
      storyId: string;
      characterId: string;
      newContent: boolean;
      previouslyUnlocked: boolean;
    };
  };
  
  // Error information
  error?: {
    code: ScanErrorCode;
    message: string;
    details?: any;
    recoverable: boolean;
    suggestedAction: string;
  };
  
  // Performance metrics
  metrics: {
    scanDuration: number; // milliseconds
    processingTime: number; // milliseconds
    retryCount: number;
    cameraInitTime: number; // milliseconds
    qrDetectionTime: number; // milliseconds
  };
}

export type ScanErrorCode = 
  | 'CAMERA_PERMISSION_DENIED'
  | 'CAMERA_NOT_AVAILABLE'
  | 'CAMERA_INITIALIZATION_FAILED'
  | 'QR_CODE_NOT_DETECTED'
  | 'QR_CODE_UNREADABLE'
  | 'INVALID_QR_FORMAT'
  | 'ATTACHMENT_NOT_RECOGNIZED'
  | 'ATTACHMENT_EXPIRED'
  | 'ATTACHMENT_ALREADY_USED'
  | 'NETWORK_ERROR'
  | 'VALIDATION_FAILED'
  | 'TIMEOUT'
  | 'UNKNOWN_ERROR';

export interface ScanError {
  code: ScanErrorCode;
  message: string;
  timestamp: number;
  context: {
    scannerState: ScannerState;
    method: ScanMethod;
    retryCount: number;
    cameraDevice?: string;
    qrData?: string;
  };
  recoverable: boolean;
  suggestedActions: string[];
  userFriendlyMessage: string; // Child-appropriate error message
}

export interface ScanSession {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  
  // Session configuration
  config: ScannerConfig;
  
  // Scan attempts
  attempts: {
    timestamp: number;
    method: ScanMethod;
    result: ScanResult;
    userAction: string; // What the user did after this attempt
  }[];
  
  // Session outcomes
  outcomes: {
    successfulScans: number;
    failedScans: number;
    storiesUnlocked: string[];
    attachmentsScanned: AttachmentType[];
    errorsEncountered: ScanErrorCode[];
  };
  
  // User experience metrics
  experience: {
    frustrationLevel: number; // 0-10, estimated from retry patterns
    helpRequestsCount: number;
    settingsChangedCount: number;
    sessionRating?: number; // 1-5, if user provides feedback
  };
  
  // Accessibility usage
  accessibility: {
    manualEntryUsed: boolean;
    fileUploadUsed: boolean;
    audioFeedbackUsed: boolean;
    hapticFeedbackUsed: boolean;
    visualAidsUsed: boolean;
  };
}

export interface ScannerCalibration {
  userId: string;
  deviceId: string;
  
  // Optimal settings discovered through usage
  optimalSettings: {
    cameraDevice: string;
    resolution: string;
    focusMode: string;
    torchUsage: boolean;
    scanRegionSize: number; // percentage of screen
    debounceDelay: number;
  };
  
  // User patterns
  userPatterns: {
    averageScanTime: number;
    preferredScanDistance: number; // cm
    commonScanAngles: number[]; // degrees
    lightingPreferences: string[];
    successfulScanConditions: string[];
  };
  
  // Performance history
  performance: {
    successRate: number; // 0-1
    averageRetries: number;
    fastestScanTime: number;
    mostReliableConditions: string[];
  };
  
  lastCalibrated: number;
  calibrationCount: number;
}

export interface ManualEntryData {
  code: string;
  enteredAt: number;
  method: 'keyboard' | 'voice' | 'paste';
  
  // Validation
  validation: {
    format: 'valid' | 'invalid' | 'unknown';
    suggestions: string[]; // Suggested corrections
    confidence: number; // 0-1
  };
  
  // User assistance
  assistance: {
    hintsUsed: boolean;
    autocompleteUsed: boolean;
    voiceInputUsed: boolean;
    retryCount: number;
  };
}

export interface FileUploadData {
  file: File;
  uploadedAt: number;
  
  // File information
  fileInfo: {
    name: string;
    size: number;
    type: string;
    lastModified: number;
  };
  
  // Processing results
  processing: {
    imageQuality: number; // 0-1
    qrCodesDetected: number;
    processingTime: number; // milliseconds
    success: boolean;
    extractedData?: string[];
  };
  
  // User experience
  userExperience: {
    uploadMethod: 'drag_drop' | 'file_picker' | 'camera_capture';
    retryCount: number;
    helpUsed: boolean;
  };
}

// Type guards for scanner data validation
export const isScannerState = (value: string): value is ScannerState => {
  return ['idle', 'initializing', 'scanning', 'processing', 'success', 'error'].includes(value);
};

export const isCameraFacing = (value: string): value is CameraFacing => {
  return ['user', 'environment'].includes(value);
};

export const isScanMethod = (value: string): value is ScanMethod => {
  return ['camera', 'manual', 'file_upload'].includes(value);
};

export const isScanErrorCode = (value: string): value is ScanErrorCode => {
  return [
    'CAMERA_PERMISSION_DENIED', 'CAMERA_NOT_AVAILABLE', 'CAMERA_INITIALIZATION_FAILED',
    'QR_CODE_NOT_DETECTED', 'QR_CODE_UNREADABLE', 'INVALID_QR_FORMAT',
    'ATTACHMENT_NOT_RECOGNIZED', 'ATTACHMENT_EXPIRED', 'ATTACHMENT_ALREADY_USED',
    'NETWORK_ERROR', 'VALIDATION_FAILED', 'TIMEOUT', 'UNKNOWN_ERROR'
  ].includes(value);
};

// Utility types for scanner data manipulation
export type ScannerConfigUpdate = Partial<ScannerConfig>;
export type ScanResultUpdate = Partial<Omit<ScanResult, 'timestamp'>>;
export type ScanSessionUpdate = Partial<Omit<ScanSession, 'id' | 'userId' | 'startTime'>>;

// Default configurations
export const DEFAULT_SCANNER_CONFIG: ScannerConfig = {
  qrScanner: {
    highlightScanRegion: true,
    highlightCodeOutline: true,
    maxScansPerSecond: 5,
    preferredCamera: 'environment',
    calculateScanRegion: true,
    returnDetailedScanResult: true,
  },
  camera: {
    constraints: {
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        frameRate: { ideal: 30 },
        facingMode: 'environment',
      },
      audio: false,
    },
    autoFocus: true,
    torch: false,
    zoom: 1,
    resolution: 'medium',
  },
  processing: {
    timeout: 10000,
    retryAttempts: 3,
    debounceDelay: 500,
    confidenceThreshold: 0.8,
    validateChecksum: true,
  },
  accessibility: {
    announceResults: true,
    hapticFeedback: true,
    visualFeedback: true,
    audioFeedback: true,
    largeTargetArea: true,
  },
  fallback: {
    enableManualEntry: true,
    enableFileUpload: true,
    showHelpText: true,
    provideScanningTips: true,
  },
};

// Attachment code format validation
export const ATTACHMENT_CODE_PATTERN = /^CM[A-Z]{2}\d{6}[A-Z]\d{2}$/;
export const ATTACHMENT_CODE_LENGTH = 12;

// QR code format specifications
export const QR_CODE_FORMATS = {
  CURMUNCHKINS: {
    prefix: 'curmunchkins://',
    version: 'v1',
    structure: 'curmunchkins://v1/attachment/{type}/{code}',
  },
} as const;