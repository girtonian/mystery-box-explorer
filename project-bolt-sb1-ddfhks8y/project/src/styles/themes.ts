/**
 * Theme configuration for Curmunchkins Mystery Box Explorer
 * Defines accessibility modes and sensory-friendly design tokens
 */

export interface ThemeMode {
  contrast: 'normal' | 'high' | 'ultra-high';
  motion: 'full' | 'reduced' | 'none';
  colorScheme: 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  voiceControl: boolean;
}

export const DEFAULT_THEME: ThemeMode = {
  contrast: 'normal', // Always default to normal contrast
  motion: 'full',
  colorScheme: 'default',
  fontSize: 'medium',
};

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  largeText: false,
  screenReader: false,
  keyboardNavigation: true,
  voiceControl: false,
};

// Color palettes for different accessibility needs
export const COLOR_SCHEMES = {
  default: {
    primary: '#7C3AED',
    secondary: '#F59E0B',
    tertiary: '#10B981',
    background: '#FAFAF9',
    surface: '#FFFFFF',
    text: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
  },
  
  // Deuteranopia (red-green colorblind) friendly
  deuteranopia: {
    primary: '#3B82F6', // Blue instead of purple
    secondary: '#F59E0B', // Amber works well
    tertiary: '#8B5CF6', // Purple instead of green
    background: '#FAFAF9',
    surface: '#FFFFFF',
    text: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
  },
  
  // Protanopia (red-blind) friendly
  protanopia: {
    primary: '#3B82F6', // Blue
    secondary: '#F59E0B', // Amber
    tertiary: '#06B6D4', // Cyan instead of green
    background: '#FAFAF9',
    surface: '#FFFFFF',
    text: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
  },
  
  // Tritanopia (blue-yellow colorblind) friendly
  tritanopia: {
    primary: '#EC4899', // Pink instead of purple
    secondary: '#EF4444', // Red instead of amber
    tertiary: '#10B981', // Green works
    background: '#FAFAF9',
    surface: '#FFFFFF',
    text: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
  },
} as const;

// Font size scales for different accessibility needs
export const FONT_SCALES = {
  small: {
    xs: '0.625rem',   // 10px
    sm: '0.75rem',    // 12px
    base: '0.875rem', // 14px
    lg: '1rem',       // 16px
    xl: '1.125rem',   // 18px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '1.875rem', // 30px
  },
  
  medium: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  
  large: {
    xs: '0.875rem',   // 14px
    sm: '1rem',       // 16px
    base: '1.125rem', // 18px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    '2xl': '1.875rem', // 30px
    '3xl': '2.25rem', // 36px
    '4xl': '2.75rem', // 44px
  },
  
  'extra-large': {
    xs: '1rem',       // 16px
    sm: '1.125rem',   // 18px
    base: '1.25rem',  // 20px
    lg: '1.5rem',     // 24px
    xl: '1.875rem',   // 30px
    '2xl': '2.25rem', // 36px
    '3xl': '2.75rem', // 44px
    '4xl': '3.25rem', // 52px
  },
} as const;

// Animation configurations for different motion preferences
export const MOTION_CONFIGS = {
  full: {
    duration: {
      fast: '150ms',
      normal: '250ms',
      slow: '350ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
    scale: 1,
  },
  
  reduced: {
    duration: {
      fast: '100ms',
      normal: '150ms',
      slow: '200ms',
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
    scale: 0.5,
  },
  
  none: {
    duration: {
      fast: '0ms',
      normal: '0ms',
      slow: '0ms',
    },
    easing: {
      ease: 'none',
      easeIn: 'none',
      easeOut: 'none',
      easeInOut: 'none',
    },
    scale: 0,
  },
} as const;

// Contrast ratios for different accessibility needs
export const CONTRAST_RATIOS = {
  normal: {
    text: 4.5,      // WCAG AA
    largeText: 3,   // WCAG AA for large text
    ui: 3,          // WCAG AA for UI components
  },
  
  high: {
    text: 7,        // WCAG AAA
    largeText: 4.5, // WCAG AAA for large text
    ui: 4.5,        // Enhanced for UI components
  },
  
  'ultra-high': {
    text: 10,       // Beyond WCAG AAA
    largeText: 7,   // Beyond WCAG AAA
    ui: 7,          // Maximum contrast for UI
  },
} as const;

// Spacing scales for different motor accessibility needs
export const SPACING_SCALES = {
  compact: {
    touchTarget: '40px',
    padding: '8px',
    margin: '12px',
    section: '24px',
  },
  
  comfortable: {
    touchTarget: '44px', // WCAG minimum
    padding: '12px',
    margin: '16px',
    section: '32px',
  },
  
  spacious: {
    touchTarget: '48px',
    padding: '16px',
    margin: '24px',
    section: '48px',
  },
} as const;

// Utility functions for theme management
export const getColorScheme = (scheme: ThemeMode['colorScheme']) => {
  return COLOR_SCHEMES[scheme] || COLOR_SCHEMES.default;
};

export const getFontScale = (size: ThemeMode['fontSize']) => {
  return FONT_SCALES[size] || FONT_SCALES.medium;
};

export const getMotionConfig = (motion: ThemeMode['motion']) => {
  return MOTION_CONFIGS[motion] || MOTION_CONFIGS.full;
};

export const getContrastRatio = (contrast: ThemeMode['contrast']) => {
  return CONTRAST_RATIOS[contrast] || CONTRAST_RATIOS.normal;
};

// CSS custom property generators
export const generateCSSVariables = (theme: ThemeMode) => {
  const colors = getColorScheme(theme.colorScheme);
  const fonts = getFontScale(theme.fontSize);
  const motion = getMotionConfig(theme.motion);
  
  return {
    // Colors
    '--color-primary': colors.primary,
    '--color-secondary': colors.secondary,
    '--color-tertiary': colors.tertiary,
    '--color-background': colors.background,
    '--color-surface': colors.surface,
    '--color-text': colors.text,
    '--color-text-secondary': colors.textSecondary,
    '--color-text-muted': colors.textMuted,
    
    // Typography
    '--font-size-xs': fonts.xs,
    '--font-size-sm': fonts.sm,
    '--font-size-base': fonts.base,
    '--font-size-lg': fonts.lg,
    '--font-size-xl': fonts.xl,
    '--font-size-2xl': fonts['2xl'],
    '--font-size-3xl': fonts['3xl'],
    '--font-size-4xl': fonts['4xl'],
    
    // Motion
    '--duration-fast': motion.duration.fast,
    '--duration-normal': motion.duration.normal,
    '--duration-slow': motion.duration.slow,
    '--easing-ease': motion.easing.ease,
    '--easing-ease-in': motion.easing.easeIn,
    '--easing-ease-out': motion.easing.easeOut,
    '--easing-ease-in-out': motion.easing.easeInOut,
  };
};

// Theme detection utilities
export const detectSystemPreferences = (): Partial<ThemeMode> => {
  const preferences: Partial<ThemeMode> = {};
  
  // Detect reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    preferences.motion = 'reduced';
  }
  
  // Detect high contrast preference
  if (window.matchMedia('(prefers-contrast: high)').matches) {
    preferences.contrast = 'high';
  }
  
  return preferences;
};

// Accessibility validation
export const validateAccessibility = (theme: ThemeMode): string[] => {
  const warnings: string[] = [];
  const colors = getColorScheme(theme.colorScheme);
  const contrast = getContrastRatio(theme.contrast);
  
  // Add validation logic here
  // This would typically include color contrast calculations
  // For now, we'll return an empty array
  
  return warnings;
};