/**
 * Settings page - Accessibility and preference configuration
 * Child-friendly interface for customizing the experience
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Volume2, Eye, Type, Palette, Zap, User } from 'lucide-react';
import { useAppStore } from '@/stores';

const Settings: React.FC = () => {
  const { preferences, updateUserPreferences } = useAppStore();

  if (!preferences) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-gray-600">Loading settings...</p>
      </div>
    );
  }

  const updateAccessibility = (updates: any) => {
    updateUserPreferences({
      accessibility: {
        ...preferences.accessibility,
        ...updates,
      },
    });
  };

  const updateStoryPreferences = (updates: any) => {
    updateUserPreferences({
      story: {
        ...preferences.story,
        ...updates,
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-primary">
          Make It Just Right
        </h1>
        <p className="text-lg text-gray-600">
          Adjust these settings to make your experience perfect for you
        </p>
      </div>

      <div className="space-y-8">
        {/* Voice Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
              <Volume2 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-primary">Voice & Sound</h2>
              <p className="text-gray-600">How you want to hear the stories</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Voice Speed */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Speed
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={preferences.accessibility.voiceSpeed}
                onChange={(e) => updateAccessibility({ voiceSpeed: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Slow</span>
                <span>{preferences.accessibility.voiceSpeed}x</span>
                <span>Fast</span>
              </div>
            </div>

            {/* Voice Volume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Voice Volume
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={preferences.accessibility.voiceVolume}
                onChange={(e) => updateAccessibility({ voiceVolume: parseFloat(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Quiet</span>
                <span>{Math.round(preferences.accessibility.voiceVolume * 100)}%</span>
                <span>Loud</span>
              </div>
            </div>

            {/* Story Preferences */}
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.story.autoplay}
                  onChange={(e) => updateStoryPreferences({ autoplay: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Auto-play stories</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.story.pauseBetweenSegments}
                  onChange={(e) => updateStoryPreferences({ pauseBetweenSegments: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Pause between parts</span>
              </label>
            </div>
          </div>
        </div>

        {/* Visual Settings */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mr-4">
              <Eye className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-primary">Visual Comfort</h2>
              <p className="text-gray-600">How things look on your screen</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Text Size
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['small', 'medium', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => updateAccessibility({ fontSize: size })}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring
                      ${preferences.accessibility.fontSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {size === 'extra-large' ? 'XL' : size.charAt(0).toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Visual Contrast */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Visual Contrast
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['normal', 'high', 'ultra-high'] as const).map((contrast, index) => (
                  <button
                    key={contrast}
                    onClick={() => updateAccessibility({ visualContrast: contrast })}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring
                      ${preferences.accessibility.visualContrast === contrast
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                    autoFocus={index === 0 && preferences.accessibility.visualContrast !== 'normal'}
                  >
                    {contrast === 'ultra-high' ? 'Ultra' : contrast}
                  </button>
                ))}
              </div>
            </div>

            {/* Motion Settings */}
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.accessibility.reduceMotion}
                  onChange={(e) => updateAccessibility({ reduceMotion: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Reduce motion and movement</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={preferences.accessibility.reduceAnimations}
                  onChange={(e) => updateAccessibility({ reduceAnimations: e.target.checked })}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-700">Reduce animations</span>
              </label>
            </div>
          </div>
        </div>

        {/* Character Preferences */}
        <div className="bg-white rounded-2xl p-6 shadow-soft">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 font-primary">Story Preferences</h2>
              <p className="text-gray-600">Choose your favorite character and story style</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Preferred Character */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Favorite Character
              </label>
              <select
                value={preferences.story.preferredCharacter}
                onChange={(e) => updateStoryPreferences({ preferredCharacter: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="silo">Silo - Detail-loving and pattern-aware</option>
                <option value="blip">Blip - Energetic and creative</option>
                <option value="pip">Pip - Visual storyteller</option>
                <option value="tally">Tally - Word-loving thinker</option>
                <option value="tumble">Tumble - Empathetic and persistent</option>
                <option value="echo">Echo - Quick-thinking and observant</option>
                <option value="sway">Sway - Emotionally intelligent</option>
                <option value="ponder">Ponder - Adaptive and wise</option>
              </select>
            </div>

            {/* Story Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Story Length
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['short', 'medium', 'long'] as const).map((length) => (
                  <button
                    key={length}
                    onClick={() => updateStoryPreferences({ preferredStoryLength: length })}
                    className={`
                      px-3 py-2 rounded-lg text-sm font-medium transition-colors focus-ring
                      ${preferences.story.preferredStoryLength === length
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {length} ({length === 'short' ? '3-5min' : length === 'medium' ? '6-10min' : '11-15min'})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Back navigation */}
      <div className="mt-8">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors focus-ring"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Settings;