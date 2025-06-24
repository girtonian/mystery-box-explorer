/**
 * Main App component for Curmunchkins Mystery Box Explorer
 * Initializes the application and provides routing with accessibility support
 */

import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useAppStore } from '@/stores';
import { router } from '@/routes';

const App: React.FC = () => {
  const { initializeApp, isInitialized } = useAppStore();

  // Initialize the app when component mounts
  useEffect(() => {
    if (!isInitialized) {
      initializeApp();
    }
  }, [initializeApp, isInitialized]);

  return (
    <RouterProvider router={router} />
  );
};

export default App;