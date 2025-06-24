/**
 * Scan feedback component showing scan results
 * Provides visual and audio feedback for successful/failed scans
 */

import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Card } from '@/components';
import type { ScanResult } from '@/types';

interface ScanFeedbackProps {
  result: ScanResult;
}

const ScanFeedback: React.FC<ScanFeedbackProps> = ({ result }) => {
  // Announce result to screen readers
  useEffect(() => {
    const message = result.success 
      ? 'Scan successful! Story unlocked.'
      : 'Scan failed. Please try again.';
    
    // Create announcement for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      if (document.body.contains(announcement)) {
        document.body.removeChild(announcement);
      }
    }, 1000);
  }, [result.success]);

  if (result.success && result.data) {
    const { attachment, unlockData } = result.data;
    
    return (
      <div className="max-w-md mx-auto">
        <Card variant="elevated" padding="large" className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          {/* Success animation */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto animate-gentle-bounce">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            {/* Sparkle effects */}
            <div className="absolute -top-2 -right-2 animate-soft-pulse">
              <Sparkles className="h-6 w-6 text-amber-400" />
            </div>
            <div className="absolute -bottom-2 -left-2 animate-soft-pulse" style={{ animationDelay: '0.5s' }}>
              <Sparkles className="h-4 w-4 text-green-400" />
            </div>
          </div>

          {/* Success message */}
          <h3 className="text-2xl font-bold text-green-900 mb-2 font-primary">
            Story Unlocked!
          </h3>
          
          <p className="text-green-800 mb-4">
            You found a {attachment.attachmentType.replace('_', ' ')} attachment!
          </p>

          {/* Story preview */}
          <Card variant="outlined" padding="medium" className="mb-6 bg-white border-green-200">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🧩</span>
              </div>
              <div className="text-left">
                <h4 className="font-bold text-gray-900">
                  {unlockData.characterId === 'silo' ? "Silo's" : 'Character'} Adventure
                </h4>
                <p className="text-sm text-gray-600">
                  {attachment.attachmentType === 'fidget_feet' ? 'Fidget Feet Discovery' : 'Sensory Story'}
                </p>
              </div>
            </div>
          </Card>

          {/* Action buttons */}
          <div className="space-y-3">
            <Link to={`/story/${unlockData.storyId}`}>
              <Button
                variant="primary"
                size="touch"
                fullWidth
                icon={ArrowRight}
                iconPosition="right"
              >
                Start Adventure
              </Button>
            </Link>
            
            <Link to="/collection">
              <Button
                variant="ghost"
                size="touch"
                fullWidth
              >
                View Collection
              </Button>
            </Link>
          </div>

          {/* Scan metrics (for debugging) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs text-gray-600">
              <p>Scan time: {result.metrics.scanDuration}ms</p>
              <p>Processing: {result.metrics.processingTime}ms</p>
              <p>Method: {result.method}</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Error state
  return (
    <div className="max-w-md mx-auto">
      <Card variant="outlined" padding="large" className="text-center bg-red-50 border-red-200">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <h3 className="text-xl font-bold text-red-900 mb-2 font-primary">
          Scan Not Recognized
        </h3>
        
        <p className="text-red-800 mb-4">
          {result.error?.message || 'The code could not be recognized. Please try again.'}
        </p>

        {result.error?.suggestedAction && (
          <p className="text-red-700 text-sm mb-4">
            💡 {result.error.suggestedAction}
          </p>
        )}

        <div className="space-y-2">
          <Button
            variant="primary"
            size="touch"
            fullWidth
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
          
          <Link to="/">
            <Button
              variant="ghost"
              size="touch"
              fullWidth
            >
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default ScanFeedback;