/**
 * Voice visualizer component for audio feedback
 * Provides visual representation of audio playback
 */

import React, { useEffect, useRef, useState } from 'react';
import { useVoiceStore } from '@/stores';

interface VoiceVisualizerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({
  size = 'medium',
  color = '#7C3AED', // Purple
  className = '',
}) => {
  const { isPlaying, isPaused } = useVoiceStore();
  const [amplitude, setAmplitude] = useState(0);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  // Sizes for different visualizer options
  const sizeMap = {
    small: {
      width: 60,
      height: 30,
      barCount: 5,
      barWidth: 3,
      barGap: 2,
    },
    medium: {
      width: 100,
      height: 40,
      barCount: 8,
      barWidth: 4,
      barGap: 3,
    },
    large: {
      width: 160,
      height: 60,
      barCount: 12,
      barWidth: 5,
      barGap: 4,
    },
  };

  const dimensions = sizeMap[size];

  // Animate the visualizer
  useEffect(() => {
    if (!isPlaying || isPaused) {
      // Reset animation when not playing
      setAmplitude(0);
      return;
    }

    const animate = (time: number) => {
      if (previousTimeRef.current === undefined) {
        previousTimeRef.current = time;
      }

      const deltaTime = time - (previousTimeRef.current || 0);
      previousTimeRef.current = time;

      // Simulate audio amplitude with a sine wave
      const newAmplitude = 0.5 + 0.5 * Math.sin(time / 200);
      setAmplitude(newAmplitude);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPlaying, isPaused]);

  // Generate bars for the visualizer
  const generateBars = () => {
    const bars = [];
    const { barCount, barWidth, barGap, height } = dimensions;

    for (let i = 0; i < barCount; i++) {
      // Create a pattern where middle bars are taller
      const position = i / (barCount - 1);
      const distanceFromCenter = Math.abs(position - 0.5) * 2;
      const baseHeight = 0.3 + 0.7 * (1 - distanceFromCenter);
      
      // Add some randomness and apply the current amplitude
      const randomFactor = 0.8 + 0.4 * Math.random();
      const barHeight = height * baseHeight * randomFactor * (isPlaying ? amplitude : 0.1);
      
      const x = i * (barWidth + barGap);
      const y = (height - barHeight) / 2;
      
      bars.push(
        <rect
          key={i}
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          rx={1}
          fill={color}
          opacity={isPlaying ? 0.8 : 0.3}
        />
      );
    }

    return bars;
  };

  return (
    <div className={`voice-visualizer ${className}`}>
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        className={`transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}
        role="img"
        aria-label={isPlaying ? "Voice is playing" : "Voice is paused"}
      >
        {generateBars()}
      </svg>
    </div>
  );
};

export default VoiceVisualizer;