/**
 * Story progress indicator component
 * Shows visual progress through the story with accessibility features
 */

import React from 'react';
import { CheckCircle, Circle, Play } from 'lucide-react';

interface StoryProgressProps {
  currentNodeId: string;
  totalNodes: number;
  visitedNodes: string[];
  className?: string;
}

const StoryProgress: React.FC<StoryProgressProps> = ({
  currentNodeId,
  totalNodes,
  visitedNodes,
  className = '',
}) => {
  const progressPercentage = (visitedNodes.length / totalNodes) * 100;
  const currentNodeIndex = visitedNodes.indexOf(currentNodeId) + 1;

  return (
    <div className={`story-progress ${className}`}>
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Story Progress
          </span>
          <span className="text-sm text-gray-600">
            {visitedNodes.length} of {totalNodes} parts
          </span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-purple-500 to-amber-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Story progress: ${Math.round(progressPercentage)}% complete`}
          />
        </div>
      </div>

      {/* Node indicators */}
      <div className="flex items-center justify-between">
        {Array.from({ length: Math.min(totalNodes, 5) }, (_, index) => {
          const nodeNumber = index + 1;
          const isVisited = visitedNodes.length > index;
          const isCurrent = currentNodeIndex === nodeNumber;
          
          return (
            <div
              key={index}
              className="flex flex-col items-center space-y-1"
            >
              {/* Node circle */}
              <div className={`
                relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300
                ${isCurrent 
                  ? 'bg-purple-600 text-white shadow-lg scale-110' 
                  : isVisited 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }
              `}>
                {isCurrent ? (
                  <Play className="h-4 w-4" />
                ) : isVisited ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                
                {/* Pulse animation for current node */}
                {isCurrent && (
                  <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-75" />
                )}
              </div>
              
              {/* Node label */}
              <span className={`
                text-xs font-medium transition-colors duration-300
                ${isCurrent 
                  ? 'text-purple-600' 
                  : isVisited 
                    ? 'text-green-600' 
                    : 'text-gray-500'
                }
              `}>
                {nodeNumber}
              </span>
            </div>
          );
        })}
        
        {/* Show ellipsis if more than 5 nodes */}
        {totalNodes > 5 && (
          <div className="flex flex-col items-center space-y-1">
            <div className="w-8 h-8 flex items-center justify-center text-gray-400">
              <span className="text-lg">...</span>
            </div>
            <span className="text-xs text-gray-500">
              {totalNodes}
            </span>
          </div>
        )}
      </div>

      {/* Progress summary for screen readers */}
      <div className="sr-only">
        You are on part {currentNodeIndex} of {totalNodes} in this story. 
        You have completed {visitedNodes.length} parts so far.
      </div>
    </div>
  );
};

export default StoryProgress;