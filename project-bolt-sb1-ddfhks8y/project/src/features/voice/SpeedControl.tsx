/**
 * Speed control component for voice playback
 * Provides a slider to adjust voice speed with accessibility features
 */

import React from 'react';
import { FastForward, Rewind } from 'lucide-react';
import { useVoiceStore } from '@/stores';

interface SpeedControlProps {
  min?: number;
  max?: number;
  step?: number;
  showLabels?: boolean;
  showValue?: boolean;
  className?: string;
}

const SpeedControl: React.FC<SpeedControlProps> = ({
  min = 0.5,
  max = 2.0,
  step = 0.1,
  showLabels = true,
  showValue = true,
  className = '',
}) => {
  const { currentVoiceSettings, updateVoiceSettings } = useVoiceStore();
  
  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    updateVoiceSettings({ speed });
  };

  const handlePresetClick = (speed: number) => {
    updateVoiceSettings({ speed });
  };

  return (
    <div className={`speed-control ${className}`}>
      {showLabels && (
        <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">
            Voice Speed
          </label>
          {showValue && (
            <span className="text-sm text-gray-600">
              {currentVoiceSettings.speed}x
            </span>
          )}
        </div>
      )}
      
      <div className="flex items-center space-x-2">
        <Rewind className="h-4 w-4 text-gray-500" />
        
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentVoiceSettings.speed}
          onChange={handleSpeedChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          aria-label="Adjust voice speed"
        />
        
        <FastForward className="h-4 w-4 text-gray-500" />
      </div>
      
      {/* Speed presets */}
      <div className="flex justify-between mt-2">
        {[0.75, 1.0, 1.25, 1.5].map(speed => (
          <button
            key={speed}
            onClick={() => handlePresetClick(speed)}
            className={`
              text-xs px-2 py-1 rounded-md transition-colors
              ${currentVoiceSettings.speed === speed
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }
            `}
            aria-label={`Set speed to ${speed}x`}
            aria-pressed={currentVoiceSettings.speed === speed}
          >
            {speed}x
          </button>
        ))}
      </div>
      
      {/* Accessibility description */}
      <div className="sr-only" aria-live="polite">
        Voice speed is currently set to {currentVoiceSettings.speed}x.
        Slower speeds may help with comprehension, while faster speeds can help with longer content.
      </div>
    </div>
  );
};

export default SpeedControl;