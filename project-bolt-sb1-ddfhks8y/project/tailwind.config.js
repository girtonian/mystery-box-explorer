/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Curmunchkins brand colors - sensory-friendly palette
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed', // Main brand purple
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
          950: '#2e1065',
        },
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Warm amber
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        tertiary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Soft green
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        // Sensory-friendly neutrals
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        },
        // Accessibility states
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      
      // Dyslexia-friendly typography
      fontFamily: {
        'primary': ['Lexend', 'OpenDyslexic', 'Comic Sans MS', 'sans-serif'],
        'reading': ['Lexend', 'Arial', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      
      // Generous spacing for motor accessibility
      spacing: {
        'touch': '44px', // Minimum touch target size
        'content': '24px', // Content spacing
        '18': '4.5rem',
        '88': '22rem',
      },
      
      // Animation durations with reduced motion support
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      
      // Custom border radius for friendly appearance
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      
      // Box shadows for depth without overwhelming
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0, 0, 0, 0.1)',
        'medium': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
        'large': '0 8px 32px 0 rgba(0, 0, 0, 0.15)',
      },
      
      // Custom animations
      keyframes: {
        'gentle-bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'soft-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      
      animation: {
        'gentle-bounce': 'gentle-bounce 2s ease-in-out infinite',
        'soft-pulse': 'soft-pulse 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
    },
  },
  plugins: [
    // Custom plugin for accessibility utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        // Screen reader only content
        '.sr-only': {
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0',
        },
        '.focus\\:not-sr-only:focus': {
          position: 'static',
          width: 'auto',
          height: 'auto',
          padding: 'inherit',
          margin: 'inherit',
          overflow: 'visible',
          clip: 'auto',
          whiteSpace: 'normal',
        },
        
        // High contrast mode utilities
        '.high-contrast': {
          filter: 'contrast(150%)',
        },
        
        // Reduced motion utilities
        '.reduce-motion': {
          animation: 'none !important',
          transition: 'none !important',
        },
        
        // Touch-friendly utilities
        '.touch-target': {
          minHeight: theme('spacing.touch'),
          minWidth: theme('spacing.touch'),
        },
        
        // Focus indicators for accessibility
        '.focus-ring': {
          '&:focus': {
            outline: '2px solid',
            outlineColor: theme('colors.primary.600'),
            outlineOffset: '2px',
          },
        },
      };
      
      addUtilities(newUtilities);
    },
  ],
  
  // Respect user preferences
  darkMode: 'media', // Respects prefers-color-scheme
  
  // Ensure accessibility in all variants
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['active', 'disabled'],
      textColor: ['active', 'disabled'],
    },
  },
};