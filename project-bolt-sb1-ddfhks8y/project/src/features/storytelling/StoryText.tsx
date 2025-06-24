/**
 * Story text display component with animations and visual cues
 * Handles text rendering with accessibility and engagement features
 */

import React, { useState, useEffect } from 'react';
import type { StorySegment } from '@/types';

interface StoryTextProps {
  content: StorySegment;
  isPlaying: boolean;
  className?: string;
}

const StoryText: React.FC<StoryTextProps> = ({ content, isPlaying, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Typewriter effect for text display
  useEffect(() => {
    if (!content.text) return;

    setIsAnimating(true);
    setDisplayedText('');

    let currentIndex = 0;
    const text = content.text;
    
    const typeInterval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsAnimating(false);
      }
    }, 30); // Adjust speed as needed

    return () => clearInterval(typeInterval);
  }, [content.text]);

  // Apply visual cues
  useEffect(() => {
    if (content.visualCues) {
      content.visualCues.forEach(cue => {
        const element = document.querySelector(cue.target);
        if (element) {
          // Apply visual cue animation
          element.classList.add(`animate-${cue.type}`);
          
          setTimeout(() => {
            element.classList.remove(`animate-${cue.type}`);
          }, cue.duration);
        }
      });
    }
  }, [content.visualCues]);

  const getEmotionStyles = (emotion: string) => {
    const emotionStyles = {
      curious: 'text-purple-800',
      excited: 'text-amber-800',
      calm: 'text-green-800',
      gentle: 'text-blue-800',
      encouraging: 'text-emerald-800',
      understanding: 'text-indigo-800',
      playful: 'text-pink-800',
      reassuring: 'text-teal-800',
    };

    return emotionStyles[emotion as keyof typeof emotionStyles] || 'text-gray-800';
  };

  return (
    <div className={`story-text ${className}`}>
      {/* Text content */}
      <div 
        className={`
          text-lg leading-relaxed font-reading
          ${getEmotionStyles(content.voiceEmotion)}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
        role="main"
        aria-live="polite"
        aria-label="Story content"
      >
        {displayedText}
        {isAnimating && (
          <span className="inline-block w-1 h-6 bg-current ml-1 animate-pulse" />
        )}
      </div>

      {/* Visual indicators for voice emotion */}
      <div className="flex items-center mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            content.voiceEmotion === 'excited' ? 'bg-amber-400 animate-bounce' :
            content.voiceEmotion === 'calm' ? 'bg-green-400 animate-pulse' :
            content.voiceEmotion === 'curious' ? 'bg-purple-400 animate-ping' :
            'bg-blue-400'
          }`} />
          <span className="capitalize font-medium">
            {content.voiceEmotion} tone
          </span>
        </div>

        {isPlaying && (
          <div className="ml-4 flex items-center space-x-1">
            <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-4 bg-current animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="ml-2 text-xs">Playing...</span>
          </div>
        )}
      </div>

      {/* Reading time estimate */}
      <div className="mt-2 text-xs text-gray-500">
        Estimated reading time: {Math.ceil(content.text.split(' ').length / 150)} minute
        {Math.ceil(content.text.split(' ').length / 150) !== 1 ? 's' : ''}
      </div>
    </div>
  );
};

export default StoryText;