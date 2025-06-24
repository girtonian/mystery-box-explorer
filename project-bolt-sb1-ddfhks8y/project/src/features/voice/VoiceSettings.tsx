/**
 * Voice settings component for customizing voice playback
 * Provides controls for speed, volume, and voice characteristics
 */

import React, { useState } from 'react';
import { Settings, Volume2, FastForward, Sliders, Wand2 } from 'lucide-react';
import { useVoiceStore } from '@/stores';
import { Card, Button } from '@/components';
import SpeedControl from './SpeedControl';
import VoiceVisualizer from './VoiceVisualizer';

interface VoiceSettingsProps {
  showVisualizer?: boolean;
  compact?: boolean;
  className?: string;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({
  showVisualizer = true,
  compact = false,
  className = '',
}) => {
  const { 
    currentVoiceSettings, 
    updateVoiceSettings,
    characterVoices,
    resetToDefaultSettings,
  } = useVoiceStore();
  
  const [expanded, setExpanded] = useState(!compact);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    updateVoiceSettings({ volume });
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pitch = parseFloat(e.target.value);
    updateVoiceSettings({ pitch });
  };

  const handleClarityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const clarity = parseFloat(e.target.value);
    updateVoiceSettings({ clarity });
  };

  const handleReset = () => {
    resetToDefaultSettings();
  };

  if (!expanded) {
    return (
      <Button
        variant="ghost"
        size="medium"
        icon={Settings}
        onClick={() => setExpanded(true)}
        className={className}
        aria-label="Show voice settings"
      >
        Voice Settings
      </Button>
    );
  }

  return (
    <Card 
      variant="outlined" 
      padding={compact ? "small" : "medium"} 
      className={`voice-settings bg-gray-50 ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Settings className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-sm font-bold text-gray-900">Voice Settings</h3>
        </div>
        
        {compact && (
          <Button
            variant="ghost"
            size="small"
            onClick={() => setExpanded(false)}
            aria-label="Hide voice settings"
          >
            Hide
          </Button>
        )}
      </div>
      
      {showVisualizer && (
        <div className="flex justify-center mb-4">
          <VoiceVisualizer size="small" />
        </div>
      )}
      
      <div className="space-y-4">
        {/* Speed control */}
        <SpeedControl />
        
        {/* Volume control */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Volume
            </label>
            <span className="text-sm text-gray-600">
              {Math.round(currentVoiceSettings.volume * 100)}%
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Volume2 className="h-4 w-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={currentVoiceSettings.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              aria-label="Adjust voice volume"
            />
          </div>
        </div>
        
        {/* Advanced settings (collapsible) */}
        <div className="pt-2">
          <details className="group">
            <summary className="flex items-center text-sm font-medium text-gray-700 cursor-pointer">
              <Sliders className="h-4 w-4 text-gray-500 mr-2" />
              Advanced Settings
              <span className="ml-auto text-xs text-gray-500 group-open:rotate-180 transition-transform">
                ▼
              </span>
            </summary>
            
            <div className="mt-3 space-y-3 pl-6">
              {/* Pitch control */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">
                    Pitch
                  </label>
                  <span className="text-xs text-gray-600">
                    {currentVoiceSettings.pitch.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={currentVoiceSettings.pitch}
                  onChange={handlePitchChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Adjust voice pitch"
                />
              </div>
              
              {/* Clarity control */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-700">
                    Clarity
                  </label>
                  <span className="text-xs text-gray-600">
                    {currentVoiceSettings.clarity.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={currentVoiceSettings.clarity}
                  onChange={handleClarityChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Adjust voice clarity"
                />
              </div>
              
              {/* Reset button */}
              <Button
                variant="ghost"
                size="small"
                icon={Wand2}
                onClick={handleReset}
                className="w-full mt-2"
              >
                Reset to Default
              </Button>
            </div>
          </details>
        </div>
      </div>
      
      {/* Accessibility note */}
      <div className="mt-4 text-xs text-gray-500">
        <p>
          Adjust these settings to make the voice easier to understand.
          Slower speeds can help with comprehension.
        </p>
      </div>
    </Card>
  );
};

export default VoiceSettings;