/**
 * Error fallback component for graceful error handling
 * Child-friendly error messages with recovery options
 */

import React from 'react';
import { AlertTriangle, Home, RefreshCw, HelpCircle } from 'lucide-react';
import Button from '../Button/Button';
import Card from '../Card/Card';

export interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showDetails?: boolean;
  showHomeButton?: boolean;
  showHelpButton?: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  title = "Oops! Something Went Wrong",
  message = "Don't worry! Sometimes apps need a little help. Let's try to fix this together.",
  showDetails = false,
  showHomeButton = true,
  showHelpButton = true,
}) => {
  const handleReload = () => {
    if (resetError) {
      resetError();
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGetHelp = () => {
    // In a real app, this would open a help modal or contact form
    console.log('Help requested for error:', error?.message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-amber-50 flex items-center justify-center p-4">
      <Card variant="elevated" padding="large" className="max-w-md w-full text-center">
        {/* Error icon */}
        <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-red-600" />
        </div>

        {/* Error message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4 font-primary">
          {title}
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Error details (for development) */}
        {showDetails && error && (
          <Card variant="outlined" padding="small" className="mb-6 text-left">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Technical Details:
            </h3>
            <p className="text-xs font-mono text-gray-600 break-all">
              {error.message || 'Unknown error occurred'}
            </p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-gray-500 cursor-pointer">
                  Show stack trace
                </summary>
                <pre className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">
                  {error.stack}
                </pre>
              </details>
            )}
          </Card>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          <Button
            variant="primary"
            size="touch"
            fullWidth
            icon={RefreshCw}
            onClick={handleReload}
          >
            Try Again
          </Button>

          {showHomeButton && (
            <Button
              variant="ghost"
              size="touch"
              fullWidth
              icon={Home}
              onClick={handleGoHome}
            >
              Go Home
            </Button>
          )}

          {showHelpButton && (
            <Button
              variant="ghost"
              size="medium"
              fullWidth
              icon={HelpCircle}
              onClick={handleGetHelp}
            >
              Get Help
            </Button>
          )}
        </div>

        {/* Help text */}
        <p className="text-sm text-gray-500 mt-6">
          If this keeps happening, ask a grown-up to help you.
        </p>
      </Card>
    </div>
  );
};

export default ErrorFallback;