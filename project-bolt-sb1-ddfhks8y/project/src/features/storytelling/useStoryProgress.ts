/**
 * Story progress tracking hook
 * Manages story navigation and progress persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { useStoryStore } from '@/stores';
import { saveProgress, loadProgress } from '@/services/storage';
import type { StoryProgress, DecisionRecord } from '@/types';

export const useStoryProgress = () => {
  const {
    currentStory,
    currentNode,
    visitedNodes,
    navigateToNode,
  } = useStoryStore();

  const [progress, setProgress] = useState<StoryProgress | null>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  // Load progress when story changes
  useEffect(() => {
    if (currentStory) {
      loadStoryProgress();
    }
  }, [currentStory]);

  // Update navigation state when current node changes
  useEffect(() => {
    updateNavigationState();
  }, [currentNode, visitedNodes]);

  const loadStoryProgress = async () => {
    if (!currentStory) return;

    try {
      const existingProgress = await loadProgress(currentStory.id);
      if (existingProgress) {
        setProgress(existingProgress);
      } else {
        // Create new progress
        const newProgress: StoryProgress = {
          storyId: currentStory.id,
          userId: 'current-user', // Would get from app store
          currentNodeId: currentStory.startNodeId,
          visitedNodes: [currentStory.startNodeId],
          completedNodes: [],
          startedAt: Date.now(),
          lastAccessedAt: Date.now(),
          totalTimeSpent: 0,
          choicesMade: [],
          isCompleted: false,
        };
        setProgress(newProgress);
        await saveProgress(newProgress);
      }
    } catch (error) {
      console.error('Failed to load story progress:', error);
    }
  };

  const updateNavigationState = () => {
    if (!currentNode || !visitedNodes) {
      setCanGoBack(false);
      setCanGoForward(false);
      return;
    }

    const currentIndex = visitedNodes.indexOf(currentNode.id);
    setCanGoBack(currentIndex > 0);
    setCanGoForward(currentIndex < visitedNodes.length - 1);
  };

  const goToNextNode = useCallback(() => {
    if (!currentNode || !visitedNodes) return;

    const currentIndex = visitedNodes.indexOf(currentNode.id);
    if (currentIndex < visitedNodes.length - 1) {
      const nextNodeId = visitedNodes[currentIndex + 1];
      navigateToNode(nextNodeId);
    }
  }, [currentNode, visitedNodes, navigateToNode]);

  const goToPreviousNode = useCallback(() => {
    if (!currentNode || !visitedNodes) return;

    const currentIndex = visitedNodes.indexOf(currentNode.id);
    if (currentIndex > 0) {
      const previousNodeId = visitedNodes[currentIndex - 1];
      navigateToNode(previousNodeId);
    }
  }, [currentNode, visitedNodes, navigateToNode]);

  const recordDecision = useCallback(async (choice: string, responseTime: number = 0) => {
    if (!currentNode || !progress) return;

    const decision: DecisionRecord = {
      nodeId: currentNode.id,
      choice,
      timestamp: Date.now(),
      responseTime,
    };

    const updatedProgress: StoryProgress = {
      ...progress,
      choicesMade: [...progress.choicesMade, decision],
      lastAccessedAt: Date.now(),
    };

    setProgress(updatedProgress);
    await saveProgress(updatedProgress);
  }, [currentNode, progress]);

  const markNodeCompleted = useCallback(async (nodeId: string) => {
    if (!progress) return;

    const updatedProgress: StoryProgress = {
      ...progress,
      completedNodes: [...new Set([...progress.completedNodes, nodeId])],
      lastAccessedAt: Date.now(),
    };

    setProgress(updatedProgress);
    await saveProgress(updatedProgress);
  }, [progress]);

  const saveCurrentProgress = useCallback(async () => {
    if (!progress || !currentNode) return;

    const updatedProgress: StoryProgress = {
      ...progress,
      currentNodeId: currentNode.id,
      lastAccessedAt: Date.now(),
      totalTimeSpent: progress.totalTimeSpent + (Date.now() - progress.lastAccessedAt),
    };

    setProgress(updatedProgress);
    await saveProgress(updatedProgress);
  }, [progress, currentNode]);

  const getProgressPercentage = useCallback(() => {
    if (!currentStory || !progress) return 0;

    const totalNodes = Object.keys(currentStory.nodes).length;
    const visitedCount = progress.visitedNodes.length;
    return Math.round((visitedCount / totalNodes) * 100);
  }, [currentStory, progress]);

  const getTimeSpent = useCallback(() => {
    if (!progress) return 0;
    
    const currentSessionTime = Date.now() - progress.lastAccessedAt;
    return progress.totalTimeSpent + currentSessionTime;
  }, [progress]);

  const isStoryCompleted = useCallback(() => {
    return progress?.isCompleted || false;
  }, [progress]);

  const getCompletionStats = useCallback(() => {
    if (!currentStory || !progress) {
      return {
        nodesVisited: 0,
        totalNodes: 0,
        choicesMade: 0,
        timeSpent: 0,
        completionRate: 0,
      };
    }

    const totalNodes = Object.keys(currentStory.nodes).length;
    const timeSpent = getTimeSpent();

    return {
      nodesVisited: progress.visitedNodes.length,
      totalNodes,
      choicesMade: progress.choicesMade.length,
      timeSpent,
      completionRate: getProgressPercentage(),
    };
  }, [currentStory, progress, getTimeSpent, getProgressPercentage]);

  return {
    progress,
    canGoBack,
    canGoForward,
    goToNextNode,
    goToPreviousNode,
    recordDecision,
    markNodeCompleted,
    saveCurrentProgress,
    getProgressPercentage,
    getTimeSpent,
    isStoryCompleted,
    getCompletionStats,
  };
};

export default useStoryProgress;