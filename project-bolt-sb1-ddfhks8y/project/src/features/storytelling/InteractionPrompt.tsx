/**
 * Interactive voice prompt component
 * Handles voice interaction and user responses during story
 */

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, RotateCcw } from 'lucide-react';
import { Button, Card } from '@/components';
import type { VoicePrompt } from '@/types';

interface InteractionPromptProps {
  prompts: VoicePrompt[];
  onResponse: (response: string) => void;
  onTimeout: () => void;
  className?: string;
}

const InteractionPrompt: React.FC<InteractionPromptProps> = ({
  prompts,
  onResponse,
  onTimeout,
  className = '',
}) => {
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [userResponse, setUserResponse] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  const currentPrompt = prompts[currentPromptIndex];

  // Timeout countdown
  useEffect(() => {
    if (currentPrompt && timeRemaining === 0) {
      setTimeRemaining(Math.floor(currentPrompt.timeout / 1000));
    }

    if (timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && currentPrompt) {
      handleTimeout();
    }
  }, [timeRemaining, currentPrompt]);

  const handleStartListening = () => {
    setIsListening(true);
    
    // Simulate voice recognition (in real implementation, would use Web Speech API)
    setTimeout(() => {
      setIsListening(false);
      // Simulate successful recognition
      const mockResponses = ['hello silo', 'yes', 'i can feel it', 'ready'];
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      handleVoiceResponse(randomResponse);
    }, 2000);
  };

  const handleStopListening = () => {
    setIsListening(false);
  };

  const handleVoiceResponse = (response: string) => {
    const normalizedResponse = response.toLowerCase().trim();
    
    // Check if response matches expected responses
    const isValidResponse = currentPrompt.expectedResponses.some(expected =>
      normalizedResponse.includes(expected.toLowerCase())
    );

    if (isValidResponse || currentPrompt.expectedResponses.length === 0) {
      onResponse(response);
    } else {
      // Encourage and try again
      setUserResponse(response);
      setTimeout(() => {
        setUserResponse('');
        setTimeRemaining(Math.floor(currentPrompt.timeout / 1000));
      }, 2000);
    }
  };

  const handleManualResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (userResponse.trim()) {
      handleVoiceResponse(userResponse);
    }
  };

  const handleTimeout = () => {
    if (currentPrompt.fallbackAction === 'continue') {
      onTimeout();
    } else if (currentPrompt.fallbackAction === 'repeat') {
      setTimeRemaining(Math.floor(currentPrompt.timeout / 1000));
    }
  };

  const handleRepeatPrompt = () => {
    setTimeRemaining(Math.floor(currentPrompt.timeout / 1000));
    setUserResponse('');
  };

  if (!currentPrompt) return null;

  return (
    <Card 
      variant="outlined" 
      padding="medium" 
      className={`interaction-prompt bg-blue-50 border-blue-200 ${className}`}
    >
      {/* Prompt text */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
          <Volume2 className="h-6 w-6 text-blue-600" />
        </div>
        <p className="text-lg font-medium text-blue-900 font-primary">
          {currentPrompt.text}
        </p>
        
        {/* Expected responses hint */}
        {currentPrompt.expectedResponses.length > 0 && (
          <p className="text-sm text-blue-700 mt-2">
            Try saying: "{currentPrompt.expectedResponses[0]}"
          </p>
        )}
      </div>

      {/* User response feedback */}
      {userResponse && (
        <div className="text-center mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <p className="text-amber-800">
            I heard: "{userResponse}"
          </p>
          <p className="text-sm text-amber-700 mt-1">
            {currentPrompt.encouragement}
          </p>
        </div>
      )}

      {/* Voice interaction controls */}
      <div className="flex items-center justify-center space-x-4 mb-4">
        <Button
          variant={isListening ? "secondary" : "primary"}
          size="touch"
          icon={isListening ? MicOff : Mic}
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={timeRemaining === 0}
          className={isListening ? 'animate-pulse' : ''}
        >
          {isListening ? 'Listening...' : 'Speak'}
        </Button>

        <Button
          variant="ghost"
          size="touch"
          icon={RotateCcw}
          onClick={handleRepeatPrompt}
          aria-label="Repeat prompt"
        >
          Repeat
        </Button>
      </div>

      {/* Manual input option */}
      <div className="text-center">
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showManualInput ? 'Hide' : 'Type your response instead'}
        </button>
      </div>

      {showManualInput && (
        <form onSubmit={handleManualResponse} className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              placeholder="Type your response here..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="submit"
              variant="primary"
              size="medium"
              disabled={!userResponse.trim()}
            >
              Send
            </Button>
          </div>
        </form>
      )}

      {/* Timeout indicator */}
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <div className={`w-2 h-2 rounded-full ${
            timeRemaining > 5 ? 'bg-green-400' : 
            timeRemaining > 2 ? 'bg-amber-400' : 'bg-red-400'
          }`} />
          <span>
            {timeRemaining > 0 
              ? `${timeRemaining} seconds remaining`
              : 'Time\'s up! The story will continue...'
            }
          </span>
        </div>
        
        {timeRemaining > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div 
              className={`h-1 rounded-full transition-all duration-1000 ${
                timeRemaining > 5 ? 'bg-green-400' : 
                timeRemaining > 2 ? 'bg-amber-400' : 'bg-red-400'
              }`}
              style={{ 
                width: `${(timeRemaining / (currentPrompt.timeout / 1000)) * 100}%` 
              }}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default InteractionPrompt;