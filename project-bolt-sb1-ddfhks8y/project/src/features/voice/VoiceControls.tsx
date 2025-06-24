/**
 * Voice controls component for audio playback
 * Provides playback controls and settings for voice narration
 */

import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Volume1, Settings, Sliders } from 'lucide-react';
import { useVoiceStore } from '@/stores';
import { Button, Card } from '@/components';

interface VoiceControlsProps {
  showSettings?: boolean;
  compact?: boolean;
  className?: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  showSettings = false,
  compact = false,
  className = '',
}) => {
  const {
    isPlaying,
    isPaused,
    currentVoiceSettings,
    playbackProgress,
    pauseNarration,
    resumeNarration,
    stopNarration,
    updateVoiceSettings,
  } = useVoiceStore();

  const [showVoiceSettings, setShowVoiceSettings] = useState(showSettings);

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseNarration();
    } else {
      resumeNarration();
    }
  };

  const handleReplay = () => {
    // This would trigger a replay of the current segment
    stopNarration();
    // Would need to call playStorySegment again with the same text
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    updateVoiceSettings({ volume });
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const speed = parseFloat(e.target.value);
    updateVoiceSettings({ speed });
  };

  const getVolumeIcon = () => {
    const volume = currentVoiceSettings.volume;
    if (volume === 0) return <VolumeX />;
    if (volume < 0.5) return <Volume1 />;
    return <Volume2 />;
  };

  if (compact) {
    return (
      <div className={`voice-controls-compact flex items-center space-x-2 ${className}`}>
        <Button
          variant={isPlaying ? "secondary" : "primary"}
          size="medium"
          icon={isPlaying ? Pause : Play}
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause narration" : "Play narration"}
        />
        
        <Button
          variant="ghost"
          size="medium"
          icon={RotateCcw}
          onClick={handleReplay}
          aria-label="Replay narration"
        />
        
        <Button
          variant="ghost"
          size="medium"
          icon={getVolumeIcon()}
          onClick={() => setShowVoiceSettings(!showVoiceSettings)}
          aria-label="Voice settings"
        />
      </div>
    );
  }

  return (
    <div className={`voice-controls ${className}`}>
      {/* Main controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant={isPlaying ? "secondary" : "primary"}
          size="touch"
          icon={isPlaying ? Pause : Play}
          onClick={handlePlayPause}
          aria-label={isPlaying ? "Pause narration" : "Play narration"}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>

        <Button
          variant="ghost"
          size="touch"
          icon={RotateCcw}
          onClick={handleReplay}
          aria-label="Replay narration"
        >
          Replay
        </Button>

        <Button
          variant="ghost"
          size="touch"
          icon={Settings}
          onClick={() => setShowVoiceSettings(!showVoiceSettings)}
          aria-label="Voice settings"
        >
          Settings
        </Button>
      </div>

      {/* Progress bar */}
      {isPlaying && (
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-amber-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${playbackProgress}%` }}
              role="progressbar"
              aria-valuenow={playbackProgress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Narration progress"
            />
          </div>
        </div>
      )}

      {/* Voice settings panel */}
      {showVoiceSettings && (
        <Card variant="outlined" padding="medium" className="mt-4 bg-gray-50">
          <div className="flex items-center mb-4">
            <Sliders className="h-5 w-5 text-purple-600 mr-2" />
            <h3 className="text-sm font-bold text-gray-900">Voice Settings</h3>
          </div>
          
          <div className="space-y-4">
            {/* Volume control */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-700">
                  Volume
                </label>
                <span className="text-xs text-gray-500">
                  {Math.round(currentVoiceSettings.volume * 100)}%
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <VolumeX className="h-4 w-4 text-gray-500" />
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
                <Volume2 className="h-4 w-4 text-gray-500" />
              </div>
            </div>
            
            {/* Speed control */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-gray-700">
                  Speed
                </label>
                <span className="text-xs text-gray-500">
                  {currentVoiceSettings.speed}x
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">0.5x</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={currentVoiceSettings.speed}
                  onChange={handleSpeedChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  aria-label="Adjust voice speed"
                />
                <span className="text-xs text-gray-500">2x</span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default VoiceControls;