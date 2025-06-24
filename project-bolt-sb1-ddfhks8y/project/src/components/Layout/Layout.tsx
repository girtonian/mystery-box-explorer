/**
 * Main layout component for Curmunchkins Mystery Box Explorer
 * Provides consistent structure with accessibility and child-friendly design
 */

import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from '@/stores';
import Header from './Header';
import AccessibilityControls from './AccessibilityControls';
import NotificationCenter from './NotificationCenter';
import LoadingOverlay from './LoadingOverlay';
import { getRouteMetadata } from '@/routes';

const Layout: React.FC = () => {
  const location = useLocation();
  const { isLoading, error, accessibilityMode, preferences } = useAppStore();
  
  const routeMetadata = getRouteMetadata(location.pathname);
  
  // Update document title for accessibility
  React.useEffect(() => {
    document.title = routeMetadata.title;
  }, [routeMetadata.title]);

  // Apply accessibility preferences to document
  React.useEffect(() => {
    if (preferences?.accessibility) {
      const root = document.documentElement;
      
      // Apply font size
      root.style.setProperty('--font-size-base', 
        preferences.accessibility.fontSize === 'small' ? '0.875rem' :
        preferences.accessibility.fontSize === 'large' ? '1.125rem' :
        preferences.accessibility.fontSize === 'extra-large' ? '1.25rem' :
        '1rem'
      );
      
      // Apply contrast
      if (preferences.accessibility.visualContrast === 'high') {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }
      
      // Apply motion preferences
      if (preferences.accessibility.reduceMotion) {
        root.classList.add('reduce-motion');
      } else {
        root.classList.remove('reduce-motion');
      }
    }
  }, [preferences?.accessibility]);
  return (
    <div 
      className={`
        min-h-screen bg-gradient-to-br from-purple-50 to-amber-50
        ${accessibilityMode.highContrastMode ? 'contrast-150' : ''}
        ${accessibilityMode.reducedMotionMode ? 'reduce-motion' : ''}
      `}
    >
      {/* Skip link for screen readers */}
      <a 
        href="#main-content" 
        className="skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50 focus-ring"
      >
        Skip to main content
      </a>
      
      {/* Header navigation */}
      <Header />
      
      {/* Main content area */}
      <main 
        id="main-content"
        className="container mx-auto px-4 py-6 min-h-[calc(100vh-80px)]"
        role="main"
        aria-label={routeMetadata.description}
      >
        <Outlet />
      </main>
      
      {/* Floating accessibility controls */}
      <AccessibilityControls />
      
      {/* Notification system */}
      <NotificationCenter />
      
      {/* Loading overlay */}
      {isLoading && <LoadingOverlay />}
      
      {/* Global error display */}
      {error && (
        <div 
          className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg z-50 max-w-md"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium">Something went wrong</h3>
              <p className="text-sm mt-1">{error.message}</p>
              {error.recoverable && (
                <button
                  onClick={() => useAppStore.getState().clearError()}
                  className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 focus-ring"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;