/**
 * Main story viewer component for Curmunchkins Mystery Box Explorer
 * Handles story display, navigation, and interaction
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, SkipForward, RotateCcw, Volume2, ArrowLeft, Settings } from 'lucide-react';
import { useStoryStore, useVoiceStore } from '@/stores';
import { Button, Card, Loading } from '@/components';
import StoryText from './StoryText';
import StoryProgress from './StoryProgress';
import StoryNavigation from './StoryNavigation';
import InteractionPrompt from './InteractionPrompt';
import useStoryNarration from './useStoryNarration';
import useStoryProgress from './useStoryProgress';
import { VoiceControls, VoiceSettings } from '@/features/voice';

const StoryViewer: React.FC = () => {
  const { storyId } = useParams<{ storyId: string }>();
  const navigate = useNavigate();
  
  const {
    currentStory,
    currentNode,
    isLoading,
    error,
    loadStory,
    navigateToNode,
    completeStory,
  } = useStoryStore();

  const {
    isPlaying,
    currentVoiceSettings,
    playStorySegment,
    pauseNarration,
    resumeNarration,
  } = useVoiceStore();

  const {
    progress,
    canGoBack,
    canGoForward,
    goToNextNode,
    goToPreviousNode,
    saveCurrentProgress,
  } = useStoryProgress();

  const {
    isNarrating,
    playSegment,
    pauseNarration: pauseStoryNarration,
    resumeNarration: resumeStoryNarration,
    replayCurrentSegment,
  } = useStoryNarration(
    currentStory?.characterId || 'silo',
    currentNode,
    {
      autoPlay: true,
      onSegmentComplete: () => {
        // Auto-advance after a pause if no interaction needed
        if (currentNode && !currentNode.content.voicePrompts) {
          setTimeout(() => {
            if (currentNode.branches.length === 1) {
              handleAutoAdvance();
            }
          }, (currentNode.content.pauseAfter || 2) * 1000);
        }
      },
      onError: (error) => {
        console.error('Narration error:', error);
      }
    }
  );

  const [showSettings, setShowSettings] = useState(false);
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  // Load story when component mounts or storyId changes
  useEffect(() => {
    if (storyId && (!currentStory || currentStory.id !== storyId)) {
      loadStory(storyId);
    }
  }, [storyId, currentStory, loadStory]);

  // Save progress periodically
  useEffect(() => {
    const saveInterval = setInterval(() => {
      if (currentStory && currentNode) {
        saveCurrentProgress();
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [currentStory, currentNode, saveCurrentProgress]); 

  const handlePauseResume = () => {
    if (isPlaying) {
      pauseStoryNarration();
    } else {
      resumeStoryNarration();
    }
  };

  const handleAutoAdvance = () => {
    if (currentNode?.branches.length === 1) {
      const nextNodeId = currentNode.branches[0].targetSegmentId;
      navigateToNode(nextNodeId);
    } else if (currentNode?.isEndNode) {
      handleStoryComplete();
    }
  };

  const handleVoiceResponse = (response: string) => {
    setAwaitingResponse(false);
    
    // Process the response and advance story
    if (currentNode?.branches.length > 0) {
      // For now, just advance to the first branch
      // In a full implementation, this would match the response to appropriate branches
      const nextNodeId = currentNode.branches[0].targetSegmentId;
      navigateToNode(nextNodeId);
    }
  };

  const handleStoryComplete = async () => {
    if (currentStory) {
      await completeStory();
      navigate('/collection', { 
        state: { 
          completedStory: currentStory.id,
          character: currentStory.characterId 
        }
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Loading size="large" message="Loading your story adventure..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card variant="outlined" padding="large" className="bg-red-50 border-red-200">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ArrowLeft className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-900 mb-4 font-primary">
            Story Not Found
          </h2>
          <p className="text-red-800 mb-6">
            {error.message}
          </p>
          <Button
            variant="primary"
            size="touch"
            onClick={handleGoBack}
            icon={ArrowLeft}
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  // No story loaded
  if (!currentStory || !currentNode) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <Card variant="default" padding="large">
          <p className="text-gray-600">No story content available.</p>
          <Button
            variant="ghost"
            size="touch"
            onClick={handleGoBack}
            icon={ArrowLeft}
            className="mt-4"
          >
            Go Back
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Story header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="touch"
            icon={ArrowLeft}
            onClick={handleGoBack}
            aria-label="Go back"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-primary">
              {currentStory.metadata.title}
            </h1>
            <p className="text-gray-600">
              {currentStory.metadata.description}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="touch"
          icon={Settings}
          onClick={() => setShowSettings(!showSettings)}
          aria-label="Story settings"
        />
      </div>

      {/* Story progress indicator */}
      <StoryProgress
        currentNodeId={currentNode.id}
        totalNodes={Object.keys(currentStory.nodes).length}
        visitedNodes={progress?.visitedNodes || []}
        className="mb-6"
      />

      {/* Main story content */}
      <Card variant="elevated" padding="large" className="mb-6">
        {/* Character indicator */}
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-amber-500 rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">
              {currentStory.characterId === 'silo' ? '🧩' : 
               currentStory.characterId === 'blip' ? '⚡' : '🌟'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-primary capitalize">
              {currentStory.characterId}
            </h2>
            <p className="text-sm text-gray-600">
              {currentStory.characterId === 'silo' ? 'Detail-loving and pattern-aware' :
               currentStory.characterId === 'blip' ? 'Energetic and creative' : 'Your Curmunchkin friend'}
            </p>
          </div>
        </div>

        {/* Story text */}
        <StoryText
          content={currentNode.content}
          isPlaying={isPlaying}
          className="mb-6"
        />

        {/* Voice interaction prompt */}
        {awaitingResponse && currentNode.content.voicePrompts && (
          <InteractionPrompt
            prompts={currentNode.content.voicePrompts}
            onResponse={handleVoiceResponse}
            onTimeout={() => setAwaitingResponse(false)}
            className="mb-6"
          />
        )}

        {/* Playback controls */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          <VoiceControls />
        </div>

        {/* Story navigation */}
        <StoryNavigation
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onGoBack={goToPreviousNode}
          onGoForward={goToNextNode}
          onSkip={handleAutoAdvance}
          isEndNode={currentNode.isEndNode}
          branches={currentNode.branches}
          onBranchSelect={(branchId) => {
            const branch = currentNode.branches.find(b => b.condition === branchId);
            if (branch) {
              navigateToNode(branch.targetSegmentId);
            }
          }}
        />
      </Card>

      {/* Settings panel */}
      {showSettings && (
        <VoiceSettings className="mb-6" />
      )}

      {/* Story completion celebration */}
      {currentNode.isEndNode && (
        <Card variant="elevated" padding="large" className="text-center bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-gentle-bounce">
            <span className="text-4xl">🎉</span>
          </div>
          <h3 className="text-2xl font-bold text-green-900 mb-4 font-primary">
            Story Complete!
          </h3>
          <p className="text-green-800 mb-6">
            You've finished this amazing adventure with {currentStory.characterId}!
          </p>
          <div className="space-y-3">
            <Button
              variant="primary"
              size="touch"
              fullWidth
              onClick={handleStoryComplete}
            >
              Collect Your Story
            </Button>
            <Button
              variant="ghost"
              size="touch"
              fullWidth
              onClick={handleGoBack}
            >
              Explore More Stories
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default StoryViewer;