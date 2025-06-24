/**
 * Notification center for displaying app-wide messages
 * Child-friendly design with clear visual feedback
 */

import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/stores';

const NotificationCenter: React.FC = () => {
  const { notifications, dismissNotification } = useAppStore();

  if (notifications.length === 0) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div 
      className="fixed top-4 right-4 z-50 space-y-2 max-w-md"
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {notifications
        .filter(notification => !notification.dismissed)
        .map((notification) => (
          <div
            key={notification.id}
            className={`
              ${getNotificationStyles(notification.type)}
              border rounded-xl p-4 shadow-medium transition-all duration-300 transform
              ${notification.dismissed ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
            `}
            role="alert"
            aria-atomic="true"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {getNotificationIcon(notification.type)}
              </div>
              
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium font-primary">
                  {notification.message}
                </p>
                
                {/* Timestamp for context */}
                <p className="text-xs opacity-75 mt-1">
                  {new Date(notification.timestamp).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="inline-flex rounded-md p-1.5 hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  aria-label="Dismiss notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default NotificationCenter;