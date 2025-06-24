/**
 * Scanner utility functions for QR processing and validation
 * Handles QR code detection, validation, and attachment code processing
 */

import type { QRCodeData, AttachmentCode, ScanError } from '@/types';
import { ATTACHMENT_STORIES } from './attachmentWhitelist';

/**
 * Validate QR code format for Curmunchkins attachments
 */
export const validateQRFormat = (data: string): boolean => {
  // Curmunchkins QR codes should match pattern: CMXX123456Y01
  const pattern = /^CM[A-Z]{2}\d{6}[A-Z]\d{2}$/;
  return pattern.test(data);
};

/**
 * Parse attachment code from QR data
 */
export const parseAttachmentCode = (qrData: string): AttachmentCode | null => {
  if (!validateQRFormat(qrData)) {
    return null;
  }

  // Extract components from code
  const prefix = qrData.slice(0, 2); // "CM"
  const attachmentTypeCode = qrData.slice(2, 4); // "FF", "WA", etc.
  const serialNumber = qrData.slice(4, 10); // "123456"
  const qualityGrade = qrData.slice(10, 11); // "A", "B", "C"
  const version = qrData.slice(11, 13); // "01"

  // Map attachment type codes to types
  const attachmentTypeMap: Record<string, string> = {
    'FF': 'fidget_feet',
    'WA': 'weighted_arms',
    'BB': 'bouncy_braids',
    'SB': 'squeeze_belly',
    'TH': 'texture_hands',
    'SE': 'sound_ears',
    'LE': 'light_eyes',
    'SN': 'scent_nose',
  };

  const attachmentType = attachmentTypeMap[attachmentTypeCode];
  if (!attachmentType) {
    return null;
  }

  // Calculate checksum for validation
  const checksum = calculateChecksum(qrData);

  return {
    code: qrData,
    attachmentType: attachmentType as any,
    version: `v${version}`,
    validation: {
      checksum,
      isValid: true, // Would validate against server in real implementation
    },
    metadata: {
      manufacturingDate: Date.now() - (30 * 24 * 60 * 60 * 1000), // Mock: 30 days ago
      batchNumber: `B${serialNumber.slice(0, 3)}`,
      serialNumber: `S${serialNumber}`,
      qualityGrade: qualityGrade as 'A' | 'B' | 'C',
    },
    content: {
      storyIds: ATTACHMENT_STORIES[attachmentType] || [],
      characterCompatibility: getCompatibleCharacters(attachmentType),
      ageRange: { min: 4, max: 12 },
      difficultyLevel: qualityGrade === 'A' ? 'beginner' : qualityGrade === 'B' ? 'intermediate' : 'advanced',
    },
  };
};

/**
 * Calculate simple checksum for code validation
 */
const calculateChecksum = (code: string): string => {
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    sum += code.charCodeAt(i);
  }
  return (sum % 256).toString(16).padStart(2, '0');
};

/**
 * Get compatible characters for attachment type
 */
const getCompatibleCharacters = (attachmentType: string): string[] => {
  const characterMap: Record<string, string[]> = {
    'fidget_feet': ['silo', 'blip'],
    'weighted_arms': ['blip', 'sway'],
    'bouncy_braids': ['pip', 'echo'],
    'squeeze_belly': ['tumble', 'sway'],
    'texture_hands': ['silo', 'pip'],
    'sound_ears': ['echo', 'ponder'],
    'light_eyes': ['pip', 'tally'],
    'scent_nose': ['ponder', 'sway'],
  };

  return characterMap[attachmentType] || ['silo'];
};

/**
 * Create scan error with user-friendly message
 */
export const createScanError = (
  code: string,
  message: string,
  context: any = {}
): ScanError => {
  const userFriendlyMessages: Record<string, string> = {
    'QR_CODE_NOT_DETECTED': 'No QR code found. Try moving closer or improving lighting.',
    'INVALID_QR_FORMAT': 'This QR code is not a Curmunchkin attachment. Check you have the right code!',
    'ATTACHMENT_NOT_RECOGNIZED': 'This attachment code is not recognized. Make sure it\'s a real Curmunchkin!',
    'CAMERA_PERMISSION_DENIED': 'Camera access needed to scan codes. You can enter codes manually instead!',
    'CAMERA_NOT_AVAILABLE': 'Camera not working. Try manual code entry!',
    'NETWORK_ERROR': 'Connection problem. Check your internet and try again.',
  };

  const suggestedActions: Record<string, string[]> = {
    'QR_CODE_NOT_DETECTED': ['Move closer to the code', 'Improve lighting', 'Hold device steady'],
    'INVALID_QR_FORMAT': ['Check you have a Curmunchkin QR code', 'Try manual entry'],
    'ATTACHMENT_NOT_RECOGNIZED': ['Verify the code is correct', 'Contact support if problem continues'],
    'CAMERA_PERMISSION_DENIED': ['Enable camera in browser settings', 'Use manual entry'],
    'CAMERA_NOT_AVAILABLE': ['Try different camera', 'Use manual entry'],
    'NETWORK_ERROR': ['Check internet connection', 'Try again in a moment'],
  };

  return {
    code: code as any,
    message,
    timestamp: Date.now(),
    context: {
      scannerState: 'error',
      method: 'camera',
      retryCount: 0,
      ...context,
    },
    recoverable: true,
    suggestedActions: suggestedActions[code] || ['Try again'],
    userFriendlyMessage: userFriendlyMessages[code] || message,
  };
};

/**
 * Simulate QR code detection (for development/demo)
 */
export const simulateQRDetection = (
  videoElement: HTMLVideoElement,
  onDetected: (qrData: QRCodeData) => void
): (() => void) => {
  let isDetecting = false;
  
  const detectInterval = setInterval(() => {
    if (isDetecting) return;
    
    // Simulate detection after random delay
    const shouldDetect = Math.random() > 0.8; // 20% chance per interval
    
    if (shouldDetect) {
      isDetecting = true;
      
      // Generate mock QR data
      const mockCodes = [
        'CMFF123456A01', // Fidget feet
        'CMWA789012B02', // Weighted arms
        'CMBB456789A03', // Bouncy braids
      ];
      
      const randomCode = mockCodes[Math.floor(Math.random() * mockCodes.length)];
      
      const qrData: QRCodeData = {
        data: randomCode,
        format: 'QR_CODE',
        quality: {
          confidence: 0.9 + Math.random() * 0.1,
          readability: 0.8 + Math.random() * 0.2,
          contrast: 0.7 + Math.random() * 0.3,
          sharpness: 0.8 + Math.random() * 0.2,
        },
        geometry: {
          boundingBox: {
            x: 100 + Math.random() * 50,
            y: 100 + Math.random() * 50,
            width: 200 + Math.random() * 50,
            height: 200 + Math.random() * 50,
          },
          cornerPoints: {
            topLeft: { x: 100, y: 100 },
            topRight: { x: 300, y: 100 },
            bottomLeft: { x: 100, y: 300 },
            bottomRight: { x: 300, y: 300 },
          },
        },
        context: {
          timestamp: Date.now(),
          cameraDevice: 'mock-camera',
          scanDuration: 1000 + Math.random() * 2000,
          attemptNumber: 1,
          lightingConditions: 'good',
        },
      };
      
      setTimeout(() => {
        onDetected(qrData);
      }, 500); // Small delay to simulate processing
    }
  }, 2000); // Check every 2 seconds
  
  // Return cleanup function
  return () => {
    clearInterval(detectInterval);
  };
};

/**
 * Format attachment code for display
 */
export const formatAttachmentCode = (code: string): string => {
  if (code.length <= 4) return code;
  if (code.length <= 10) return `${code.slice(0, 4)}-${code.slice(4)}`;
  return `${code.slice(0, 4)}-${code.slice(4, 10)}-${code.slice(10)}`;
};

/**
 * Clean and validate manual entry code
 */
export const cleanManualCode = (input: string): string => {
  return input
    .replace(/[^A-Z0-9]/g, '') // Remove non-alphanumeric
    .toUpperCase()
    .slice(0, 12); // Limit to 12 characters
};

/**
 * Get attachment type display name
 */
export const getAttachmentDisplayName = (attachmentType: string): string => {
  const displayNames: Record<string, string> = {
    'fidget_feet': 'Fidget Feet',
    'weighted_arms': 'Weighted Arms',
    'bouncy_braids': 'Bouncy Braids',
    'squeeze_belly': 'Squeeze Belly',
    'texture_hands': 'Texture Hands',
    'sound_ears': 'Sound Ears',
    'light_eyes': 'Light Eyes',
    'scent_nose': 'Scent Nose',
  };

  return displayNames[attachmentType] || attachmentType;
};