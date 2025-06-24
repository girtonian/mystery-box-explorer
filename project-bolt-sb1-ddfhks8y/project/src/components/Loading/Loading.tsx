/**
 * Loading component with child-friendly animations
 * Provides visual feedback during app operations
 */

import React from 'react';
import { Book, Sparkles } from 'lucide-react';

export interface LoadingProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
  showIcon?: boolean;
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({
  size = 'medium',
  message = 'Loading...',
  showIcon = true,
  className = '',
}) => {
  const sizeClasses = {
    small: {
      container: 'p-4',
      icon: 'w-8 h-8',
      sparkle: 'h-3 w-3',
      text: 'text-sm',
    },
    medium: {
      container: 'p-8',
      icon: 'w-12 h-12',
      sparkle: 'h-4 w-4',
      text: 'text-base',
    },
    large: {
      container: 'p-12',
      icon: 'w-16 h-16',
      sparkle: 'h-6 w-6',
      text: 'text-lg',
    },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center ${classes.container} ${className}`}>
      {showIcon && (
        <div className="relative mb-4">
          {/* Main icon with gentle bounce */}
          <div className="bg-gradient-to-br from-purple-500 to-amber-500 rounded-2xl flex items-center justify-center animate-gentle-bounce">
            <div className={`${classes.icon} flex items-center justify-center`}>
              <Book className={`${classes.icon} text-white`} />
            </div>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-1 -right-1 animate-soft-pulse">
            <Sparkles className={`${classes.sparkle} text-amber-400`} />
          </div>
          <div 
            className="absolute -bottom-1 -left-1 animate-soft-pulse" 
            style={{ animationDelay: '0.5s' }}
          >
            <Sparkles className={`${classes.sparkle} text-purple-400`} />
          </div>
        </div>
      )}
      
      {/* Loading text */}
      <p className={`text-gray-700 font-medium font-primary ${classes.text}`}>
        {message}
      </p>
      
      {/* Progress indicator */}
      <div className="mt-4 w-32 mx-auto">
        <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-amber-500 h-full rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;