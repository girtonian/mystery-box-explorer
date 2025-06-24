/**
 * Story navigation component
 * Handles story flow control and choice selection
 */

import React from 'react';
import { ChevronLeft, ChevronRight, SkipForward, Flag } from 'lucide-react';
import { Button } from '@/components';
import type { StoryBranch } from '@/types';

interface StoryNavigationProps {
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onSkip: () => void;
  isEndNode: boolean;
  branches: StoryBranch[];
  onBranchSelect: (branchId: string) => void;
}

const StoryNavigation: React.FC<StoryNavigationProps> = ({
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  onSkip,
  isEndNode,
  branches,
  onBranchSelect,
}) => {
  // If there are multiple branches, show choice buttons
  if (branches.length > 1) {
    return (
      <div className="story-navigation">
        <div className="text-center mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2 font-primary">
            What would you like to do?
          </h3>
          <p className="text-gray-600 text-sm">
            Choose your path in the story
          </p>
        </div>
        
        <div className="space-y-3">
          {branches.map((branch, index) => (
            <Button
              key={branch.condition}
              variant="outlined"
              size="touch"
              fullWidth
              onClick={() => onBranchSelect(branch.condition)}
              className="text-left justify-start hover:bg-purple-50 hover:border-purple-300"
            >
              <span className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-bold mr-3">
                {index + 1}
              </span>
              {getChoiceText(branch.condition)}
            </Button>
          ))}
        </div>
      </div>
    );
  }

  // Standard navigation controls
  return (
    <div className="story-navigation">
      <div className="flex items-center justify-between">
        {/* Back button */}
        <Button
          variant="ghost"
          size="touch"
          icon={ChevronLeft}
          onClick={onGoBack}
          disabled={!canGoBack}
          aria-label="Go to previous part"
        >
          Previous
        </Button>

        {/* Center content */}
        <div className="flex items-center space-x-4">
          {isEndNode ? (
            <Button
              variant="primary"
              size="touch"
              icon={Flag}
              onClick={onSkip}
              className="bg-green-600 hover:bg-green-700"
            >
              Finish Story
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="touch"
              icon={SkipForward}
              onClick={onSkip}
              aria-label="Skip to next part"
            >
              Continue
            </Button>
          )}
        </div>

        {/* Forward button */}
        <Button
          variant="ghost"
          size="touch"
          icon={ChevronRight}
          iconPosition="right"
          onClick={onGoForward}
          disabled={!canGoForward || isEndNode}
          aria-label="Go to next part"
        >
          Next
        </Button>
      </div>

      {/* Navigation hints */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          {isEndNode 
            ? 'You\'ve reached the end of this story!'
            : canGoForward 
              ? 'Use the controls above to navigate through the story'
              : 'Listen to the story and it will continue automatically'
          }
        </p>
      </div>
    </div>
  );
};

// Helper function to convert branch conditions to readable text
const getChoiceText = (condition: string): string => {
  const choiceMap: Record<string, string> = {
    'voice_response': 'Respond with your voice',
    'continue': 'Continue the story',
    'explore_more': 'Explore this topic more',
    'practice_technique': 'Practice the technique',
    'ask_question': 'Ask a question',
    'share_feeling': 'Share how you feel',
    'try_different_way': 'Try a different approach',
    'take_break': 'Take a sensory break',
  };

  return choiceMap[condition] || condition.replace(/_/g, ' ');
};

export default StoryNavigation;