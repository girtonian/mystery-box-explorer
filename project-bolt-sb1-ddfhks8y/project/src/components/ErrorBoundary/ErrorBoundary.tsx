/**
 * Error boundary component for graceful error handling
 * Child-friendly error messages with recovery options
 */

import React from 'react';
import { useRouteError } from 'react-router-dom';
import ErrorFallback from './ErrorFallback';

const ErrorBoundary: React.FC = () => {
  const error = useRouteError() as Error;

  return (
    <ErrorFallback
      error={error}
      showDetails={process.env.NODE_ENV === 'development'}
    />
  );
};

export default ErrorBoundary;