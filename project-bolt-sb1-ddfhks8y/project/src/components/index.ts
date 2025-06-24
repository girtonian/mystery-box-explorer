/**
 * Central export point for all UI components
 * Provides clean imports throughout the application
 */

// Layout components
export { default as Layout } from './Layout/Layout';
export { default as Header } from './Layout/Header';
export { default as AccessibilityControls } from './Layout/AccessibilityControls';
export { default as LoadingOverlay } from './Layout/LoadingOverlay';
export { default as NotificationCenter } from './Layout/NotificationCenter';

// Core UI components
export { default as Button } from './Button/Button';
export { default as Card } from './Card/Card';
export { default as Modal } from './Modal/Modal';
export { default as Loading } from './Loading/Loading';

// Error handling components
export { default as ErrorBoundary } from './ErrorBoundary/ErrorBoundary';
export { default as ErrorFallback } from './ErrorBoundary/ErrorFallback';

// Export component prop types for convenience
export type { ButtonProps } from './Button/Button';
export type { CardProps } from './Card/Card';
export type { ModalProps } from './Modal/Modal';
export type { LoadingProps } from './Loading/Loading';
export type { ErrorFallbackProps } from './ErrorBoundary/ErrorFallback';