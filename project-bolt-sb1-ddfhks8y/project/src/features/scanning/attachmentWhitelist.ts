/**
 * Attachment code whitelist and validation rules
 * Defines valid attachment codes and their associated content
 */

import type { AttachmentCode, MunchieCharacter, AttachmentType } from '@/types';

/**
 * Valid attachment type codes and their mappings
 */
export const ATTACHMENT_TYPE_CODES = {
  'FF': 'fidget_feet',
  'WA': 'weighted_arms', 
  'BB': 'bouncy_braids',
  'SB': 'squeeze_belly',
  'TH': 'texture_hands',
  'SE': 'sound_ears',
  'LE': 'light_eyes',
  'SN': 'scent_nose',
} as const;

/**
 * Character compatibility matrix for each attachment type
 */
export const CHARACTER_COMPATIBILITY: Record<AttachmentType, MunchieCharacter[]> = {
  fidget_feet: ['silo', 'blip'],
  weighted_arms: ['blip', 'sway', 'tumble'],
  bouncy_braids: ['pip', 'echo', 'tally'],
  squeeze_belly: ['tumble', 'sway', 'ponder'],
  texture_hands: ['silo', 'pip', 'echo'],
  sound_ears: ['echo', 'ponder', 'tally'],
  light_eyes: ['pip', 'tally', 'silo'],
  scent_nose: ['ponder', 'sway', 'tumble'],
};

/**
 * Story mappings for each attachment type
 */
export const ATTACHMENT_STORIES: Record<AttachmentType, string[]> = {
  fidget_feet: [
    'silo-fidget-feet-001',
    'blip-fidget-feet-001',
  ],
  weighted_arms: [
    'blip-weighted-arms-001',
    'sway-weighted-arms-001',
    'tumble-weighted-arms-001',
  ],
  bouncy_braids: [
    'pip-bouncy-braids-001',
    'echo-bouncy-braids-001',
    'tally-bouncy-braids-001',
  ],
  squeeze_belly: [
    'tumble-squeeze-belly-001',
    'sway-squeeze-belly-001',
    'ponder-squeeze-belly-001',
  ],
  texture_hands: [
    'silo-texture-hands-001',
    'pip-texture-hands-001',
    'echo-texture-hands-001',
  ],
  sound_ears: [
    'echo-sound-ears-001',
    'ponder-sound-ears-001',
    'tally-sound-ears-001',
  ],
  light_eyes: [
    'pip-light-eyes-001',
    'tally-light-eyes-001',
    'silo-light-eyes-001',
  ],
  scent_nose: [
    'ponder-scent-nose-001',
    'sway-scent-nose-001',
    'tumble-scent-nose-001',
  ],
};

/**
 * Sample valid attachment codes for testing
 */
export const SAMPLE_ATTACHMENT_CODES: AttachmentCode[] = [
  {
    code: 'CMFF123456A01',
    attachmentType: 'fidget_feet',
    version: 'v01',
    validation: {
      checksum: 'a1b2',
      isValid: true,
    },
    metadata: {
      manufacturingDate: Date.now() - (30 * 24 * 60 * 60 * 1000),
      batchNumber: 'B123',
      serialNumber: 'S123456',
      qualityGrade: 'A',
    },
    content: {
      storyIds: ATTACHMENT_STORIES.fidget_feet,
      characterCompatibility: CHARACTER_COMPATIBILITY.fidget_feet,
      ageRange: { min: 4, max: 12 },
      difficultyLevel: 'beginner',
    },
  },
  {
    code: 'CMWA789012B02',
    attachmentType: 'weighted_arms',
    version: 'v02',
    validation: {
      checksum: 'c3d4',
      isValid: true,
    },
    metadata: {
      manufacturingDate: Date.now() - (20 * 24 * 60 * 60 * 1000),
      batchNumber: 'B789',
      serialNumber: 'S789012',
      qualityGrade: 'B',
    },
    content: {
      storyIds: ATTACHMENT_STORIES.weighted_arms,
      characterCompatibility: CHARACTER_COMPATIBILITY.weighted_arms,
      ageRange: { min: 4, max: 12 },
      difficultyLevel: 'intermediate',
    },
  },
  {
    code: 'CMBB456789A03',
    attachmentType: 'bouncy_braids',
    version: 'v01',
    validation: {
      checksum: 'e5f6',
      isValid: true,
    },
    metadata: {
      manufacturingDate: Date.now() - (15 * 24 * 60 * 60 * 1000),
      batchNumber: 'B456',
      serialNumber: 'S456789',
      qualityGrade: 'A',
    },
    content: {
      storyIds: ATTACHMENT_STORIES.bouncy_braids,
      characterCompatibility: CHARACTER_COMPATIBILITY.bouncy_braids,
      ageRange: { min: 4, max: 12 },
      difficultyLevel: 'beginner',
    },
  },
];

/**
 * Validate attachment code against whitelist
 */
export const validateAttachmentCode = (code: string): AttachmentCode | null => {
  // Check against sample codes first (for demo purposes)
  const sampleCode = SAMPLE_ATTACHMENT_CODES.find(ac => ac.code === code);
  if (sampleCode) {
    return sampleCode;
  }

  // For codes not in samples, try to parse them
  const pattern = /^CM([A-Z]{2})(\d{6})([A-Z])(\d{2})$/;
  const match = code.match(pattern);
  
  if (!match) {
    return null;
  }

  const [, typeCode, serialNumber, qualityGrade, version] = match;
  const attachmentType = ATTACHMENT_TYPE_CODES[typeCode as keyof typeof ATTACHMENT_TYPE_CODES];
  
  if (!attachmentType) {
    return null;
  }

  // Generate attachment code for valid format
  return {
    code,
    attachmentType,
    version: `v${version}`,
    validation: {
      checksum: calculateChecksum(code),
      isValid: true,
    },
    metadata: {
      manufacturingDate: Date.now() - (Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within 90 days
      batchNumber: `B${serialNumber.slice(0, 3)}`,
      serialNumber: `S${serialNumber}`,
      qualityGrade: qualityGrade as 'A' | 'B' | 'C',
    },
    content: {
      storyIds: ATTACHMENT_STORIES[attachmentType],
      characterCompatibility: CHARACTER_COMPATIBILITY[attachmentType],
      ageRange: { min: 4, max: 12 },
      difficultyLevel: qualityGrade === 'A' ? 'beginner' : qualityGrade === 'B' ? 'intermediate' : 'advanced',
    },
  };
};

/**
 * Calculate simple checksum for validation
 */
const calculateChecksum = (code: string): string => {
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    sum += code.charCodeAt(i);
  }
  return (sum % 256).toString(16).padStart(2, '0');
};

/**
 * Get all valid attachment type codes
 */
export const getValidAttachmentTypeCodes = (): string[] => {
  return Object.keys(ATTACHMENT_TYPE_CODES);
};

/**
 * Get attachment type from code
 */
export const getAttachmentTypeFromCode = (code: string): AttachmentType | null => {
  const typeCode = code.slice(2, 4);
  return ATTACHMENT_TYPE_CODES[typeCode as keyof typeof ATTACHMENT_TYPE_CODES] || null;
};

/**
 * Check if attachment code format is valid
 */
export const isValidAttachmentCodeFormat = (code: string): boolean => {
  const pattern = /^CM[A-Z]{2}\d{6}[A-Z]\d{2}$/;
  return pattern.test(code);
};

/**
 * Generate sample attachment codes for testing
 */
export const generateSampleCodes = (count: number = 5): string[] => {
  const typeCodes = Object.keys(ATTACHMENT_TYPE_CODES);
  const qualityGrades = ['A', 'B', 'C'];
  const codes: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const typeCode = typeCodes[Math.floor(Math.random() * typeCodes.length)];
    const serialNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const qualityGrade = qualityGrades[Math.floor(Math.random() * qualityGrades.length)];
    const version = '01';
    
    const code = `CM${typeCode}${serialNumber}${qualityGrade}${version}`;
    codes.push(code);
  }
  
  return codes;
};

export default {
  ATTACHMENT_TYPE_CODES,
  CHARACTER_COMPATIBILITY,
  ATTACHMENT_STORIES,
  SAMPLE_ATTACHMENT_CODES,
  validateAttachmentCode,
  getValidAttachmentTypeCodes,
  getAttachmentTypeFromCode,
  isValidAttachmentCodeFormat,
  generateSampleCodes,
};