/**
 * Home page - Welcome screen for Curmunchkins Mystery Box Explorer
 * Child-friendly interface with clear navigation options
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scan, Star, Settings, Play, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores';
import { Card, Button, Loading } from '@/components';

const Home: React.FC = () => {
  const { currentUser, preferences, addNotification, isInitialized } = useAppStore();
  
  // Mock data for now - will be replaced with actual store data
  const unlockedStories: string[] = [];
  const completedStories: string[] = [];

  useEffect(() => {
    // Welcome message for new users
    if (isInitialized && currentUser && unlockedStories.length === 0) {
      addNotification({
        type: 'info',
        message: 'Welcome! Scan your first Curmunchkin attachment to begin your adventure!',
      });
    }
  }, [isInitialized, currentUser, unlockedStories.length, addNotification]);

  const quickActions = [
    {
      title: 'Scan & Discover',
      description: 'Scan your Curmunchkin attachment to unlock new stories',
      icon: Scan,
      path: '/scanner',
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      primary: true,
    },
    {
      title: 'My Collection',
      description: `View your ${completedStories.length} collected stories`,
      icon: Star,
      path: '/collection',
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      primary: false,
    },
    {
      title: 'Settings',
      description: 'Make the app just right for you',
      icon: Settings,
      path: '/settings',
      color: 'from-green-500 to-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
      primary: false,
    },
  ];

  // Show loading state while app initializes
  if (!isInitialized) {
    return <Loading size="large" message="Preparing your magical adventure" />;
  }
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Welcome header */}
      <div className="text-center mb-12">
        <div className="relative inline-block mb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-primary">
            Welcome to Your
          </h1>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-amber-600 bg-clip-text text-transparent font-primary">
            Magical Adventure!
          </h2>
          
          {/* Decorative sparkles */}
          <div className="absolute -top-4 -right-8 animate-soft-pulse">
            <Sparkles className="h-8 w-8 text-amber-400" />
          </div>
          <div className="absolute -bottom-2 -left-6 animate-soft-pulse" style={{ animationDelay: '1s' }}>
            <Sparkles className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Scan your Curmunchkin attachments to unlock personalized stories with your favorite characters!
        </p>
      </div>

      {/* Quick actions grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {quickActions.map((action) => {
          const Icon = action.icon;
          
          return (
            <Card
              key={action.path}
              variant="interactive"
              padding={action.primary ? 'large' : 'medium'}
              className={`
                group relative overflow-hidden transition-all duration-300 transform hover:scale-105 focus:scale-105
                ${action.primary 
                  ? 'md:col-span-2 bg-gradient-to-br ' + action.color + ' text-white'
                  : action.bgColor
                }
              `}
              onClick={() => window.location.href = action.path}
              role="button"
              aria-label={`${action.title} - ${action.description}`}
            >
              {/* Background pattern for primary action */}
              {action.primary && (
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white"></div>
                  <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full bg-white"></div>
                </div>
              )}
              
              <div className="relative z-10">
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 transition-transform group-hover:scale-110
                  ${action.primary ? 'bg-white bg-opacity-20' : 'bg-white shadow-soft'}
                `}>
                  <Icon className={`h-8 w-8 ${action.primary ? 'text-white' : action.textColor}`} />
                </div>
                
                <h3 className={`text-xl font-bold mb-2 font-primary ${action.primary ? 'text-white' : 'text-gray-900'}`}>
                  {action.title}
                </h3>
                
                <p className={`${action.primary ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                  {action.description}
                </p>
                
                {action.primary && (
                  <div className="flex items-center mt-4 text-white text-opacity-90">
                    <Play className="h-5 w-5 mr-2" />
                    <span className="font-medium">Start Adventure</span>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Recent activity or getting started */}
      {unlockedStories.length > 0 ? (
        <Card variant="default" padding="medium">
          <h3 className="text-xl font-bold text-gray-900 mb-4 font-primary">
            Continue Your Adventure
          </h3>
          <p className="text-gray-600 mb-4">
            You have {unlockedStories.length} stories unlocked and {completedStories.length} completed!
          </p>
          <Button
            variant="primary"
            size="touch"
            icon={Star}
            onClick={() => window.location.href = '/collection'}
          >
            View My Collection
          </Button>
        </Card>
      ) : (
        <Card variant="outlined" padding="medium" className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4 font-primary">
            Getting Started
          </h3>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">1</span>
              </div>
              <p>Find your Curmunchkin attachment with the QR code</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">2</span>
              </div>
              <p>Tap "Scan & Discover" to use your camera</p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 font-bold text-sm">3</span>
              </div>
              <p>Enjoy your personalized story adventure!</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;