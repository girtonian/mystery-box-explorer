/**
 * Loading overlay with child-friendly animation
 * Provides visual feedback during app operations
 */

import React from 'react';
import { Book, Sparkles } from 'lucide-react';

const LoadingOverlay: React.FC = () => {
  return (
    <div 
      className="fixed inset-0 bg-white bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center"
      role="dialog"
      aria-label="Loading"
      aria-live="polite"
    >
      <div className="text-center">
        {/* Animated logo */}
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-amber-500 rounded-2xl flex items-center justify-center animate-gentle-bounce">
            <Book className="h-10 w-10 text-white" />
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-2 -right-2 animate-soft-pulse">
            <Sparkles className="h-6 w-6 text-amber-400" />
          </div>
          <div className="absolute -bottom-2 -left-2 animate-soft-pulse" style={{ animationDelay: '0.5s' }}>
            <Sparkles className="h-4 w-4 text-purple-400" />
          </div>
        </div>
        
        {/* Loading text */}
        <h2 className="text-xl font-semibold text-gray-800 mb-2 font-primary">
          Getting Ready...
        </h2>
        <p className="text-gray-600 text-sm">
          Preparing your magical adventure
        </p>
        
        {/* Progress indicator */}
        <div className="mt-6 w-48 mx-auto">
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-amber-500 h-full rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;