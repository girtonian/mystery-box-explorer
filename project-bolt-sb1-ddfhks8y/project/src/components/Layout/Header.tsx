/**
 * Header component with child-friendly navigation
 * Implements large touch targets and clear visual hierarchy
 */

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Scan, Book, Star, Settings, ArrowLeft } from 'lucide-react';
import { useAppStore } from '@/stores';
import { getRouteMetadata, isChildFriendlyRoute } from '@/routes';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, accessibilityMode, preferences } = useAppStore();
  
  const routeMetadata = getRouteMetadata(location.pathname);
  const isChildRoute = isChildFriendlyRoute(location.pathname);
  
  // Navigation items for children
  const childNavItems = [
    { path: '/', icon: Home, label: 'Home', color: 'text-purple-600' },
    { path: '/scanner', icon: Scan, label: 'Scan', color: 'text-amber-600' },
    { path: '/collection', icon: Star, label: 'Collection', color: 'text-green-600' },
    { path: '/settings', icon: Settings, label: 'Settings', color: 'text-blue-600' },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <header 
      className="bg-white shadow-soft border-b-2 border-purple-100"
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo and brand */}
          <div className="flex items-center space-x-4">
            {/* Back button for story pages */}
            {location.pathname.startsWith('/story') && (
              <button
                onClick={handleBack}
                className="touch-target flex items-center justify-center rounded-xl bg-purple-100 hover:bg-purple-200 transition-colors focus-ring"
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6 text-purple-600" />
              </button>
            )}
            
            {/* Brand logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 focus-ring rounded-lg p-2"
              aria-label="Curmunchkins Mystery Box Explorer - Go to home"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Book className="h-7 w-7 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-gray-900 font-primary">
                  Curmunchkins
                </h1>
                <p className="text-sm text-gray-600">Mystery Box Explorer</p>
              </div>
            </Link>
          </div>

          {/* Page title for context */}
          <div className="hidden md:block text-center">
            <h2 className="text-lg font-semibold text-gray-800 font-primary">
              {routeMetadata.description}
            </h2>
          </div>

          {/* Navigation for child-friendly routes */}
          {isChildRoute && (
            <nav 
              className="flex items-center space-x-2"
              role="navigation"
              aria-label="Main navigation"
            >
              {childNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      touch-target flex flex-col items-center justify-center rounded-xl transition-all duration-200 focus-ring
                      ${isActive 
                        ? 'bg-purple-100 text-purple-700 shadow-medium' 
                        : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
                      }
                      ${accessibilityMode.keyboardNavigationActive ? 'ring-2 ring-purple-300' : ''}
                    `}
                    aria-label={`${item.label} - ${isActive ? 'Current page' : 'Navigate to ' + item.label.toLowerCase()}`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? item.color : ''}`} />
                    <span className="text-xs font-medium mt-1 hidden sm:block">
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Parent access button for non-child routes */}
          {!isChildRoute && (
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="touch-target flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors focus-ring"
                aria-label="Return to child interface"
              >
                <Home className="h-5 w-5" />
                <span className="hidden sm:inline">Child Mode</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;