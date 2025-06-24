/**
 * Floating accessibility controls panel
 * Provides quick access to sensory-friendly adjustments
 */

import React, { useState } from 'react';
import { Settings, Volume2, Eye, Zap, Type, Palette } from 'lucide-react';
import { useAppStore } from '@/stores';

const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, updateUserPreferences, accessibilityMode, isLoading } = useAppStore();

  if (!preferences) return null;

  const togglePanel = () => setIsOpen(!isOpen);

  const updateAccessibility = (updates: any) => {
    updateUserPreferences({
      accessibility: {
        ...preferences.accessibility,
        ...updates,
      },
    });
  };

  // Don't show controls while app is loading
  if (isLoading) return null;
  return (
    <div className="fixed bottom-4 left-4 z-40">
      {/* Toggle button */}
      <button
        onClick={togglePanel}
        className={`
          touch-target flex items-center justify-center rounded-full shadow-large transition-all duration-300 focus-ring
          ${isOpen 
            ? 'bg-purple-600 text-white' 
            : 'bg-white text-purple-600 hover:bg-purple-50'
          }
        `}
        aria-label={`${isOpen ? 'Close' : 'Open'} accessibility controls`}
        aria-expanded={isOpen}
      >
        <Settings className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
      </button>

      {/* Controls panel */}
      {isOpen && (
        <div 
          className="absolute bottom-16 left-0 bg-white rounded-2xl shadow-large border border-gray-200 p-4 w-80 max-w-[calc(100vw-2rem)]"
          role="dialog"
          aria-label="Accessibility controls"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-primary">
            Make It Just Right
          </h3>
          
          <div className="space-y-4">
            {/* Voice Speed */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Volume2 className="h-4 w-4 mr-2 text-purple-600" />
                Voice Speed
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={preferences.accessibility.voiceSpeed}
                onChange={(e) => updateAccessibility({ voiceSpeed: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                aria-label="Adjust voice speed"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow</span>
                <span>{preferences.accessibility.voiceSpeed}x</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Type className="h-4 w-4 mr-2 text-purple-600" />
                Text Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateAccessibility({ fontSize: size })}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium transition-colors focus-ring
                      ${preferences.accessibility.fontSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    aria-label={`Set text size to ${size}`}
                    aria-pressed={preferences.accessibility.fontSize === size}
                  >
                    {size === 'extra-large' ? 'XL' : size.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Contrast */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Eye className="h-4 w-4 mr-2 text-purple-600" />
                Visual Contrast
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'high', 'ultra-high'] as const).map((contrast, index) => (
                  <button
                    key={contrast}
                    onClick={() => updateAccessibility({ visualContrast: contrast })}
                    className={`
                      px-3 py-2 rounded-lg text-xs font-medium transition-colors focus-ring
                      ${preferences.accessibility.visualContrast === contrast
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    aria-label={`Set contrast to ${contrast}`}
                    aria-pressed={preferences.accessibility.visualContrast === contrast}
                    autoFocus={index === 0 && preferences.accessibility.visualContrast !== 'normal'}
                  >
                    {contrast === 'ultra-high' ? 'Ultra' : contrast}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Settings */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Zap className="h-4 w-4 mr-2 text-purple-600" />
                Motion & Animation
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.reduceMotion}
                    onChange={(e) => updateAccessibility({ reduceMotion: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-700">Reduce motion</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.accessibility.reduceAnimations}
                    onChange={(e) => updateAccessibility({ reduceAnimations: e.target.checked })}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-700">Reduce animations</span>
                </label>
              </div>
            </div>

            {/* Color Scheme */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Palette className="h-4 w-4 mr-2 text-purple-600" />
                Color Support
              </label>
              <select
                value={preferences.accessibility.colorScheme}
                onChange={(e) => updateAccessibility({ colorScheme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
                aria-label="Select color scheme for visual accessibility"
              >
                <option value="default">Default colors</option>
                <option value="deuteranopia">Red-green support</option>
                <option value="protanopia">Red-blind support</option>
                <option value="tritanopia">Blue-yellow support</option>
              </select>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={togglePanel}
            className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus-ring"
            aria-label="Close accessibility controls"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default AccessibilityControls;