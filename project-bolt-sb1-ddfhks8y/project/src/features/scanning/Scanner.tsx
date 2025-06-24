/**
 * Main scanner component for Curmunchkins Mystery Box Explorer
 * Handles QR code scanning with camera and fallback options
 */

import React, { useState, useEffect } from 'react';
import { Camera, Upload, Keyboard, AlertCircle, CheckCircle } from 'lucide-react';
import { useScannerStore } from '@/stores';
import { Button, Card, Loading } from '@/components';
import CameraView from './CameraView';
import ManualEntry from './ManualEntry';
import ScanFeedback from './ScanFeedback';

const Scanner: React.FC = () => {
  const {
    state,
    isActive,
    error,
    lastScanResult,
    manualEntryMode,
    hasPermission,
    initializeScanner,
    startScanning,
    stopScanning,
    setManualEntryMode,
    clearError,
  } = useScannerStore();

  const [showInstructions, setShowInstructions] = useState(true);

  useEffect(() => {
    // Initialize scanner when component mounts
    // Only initialize once when the component mounts
    if (!hasPermission) {
      initializeScanner();
    }
  }, [initializeScanner]);

  const handleStartScanning = async () => {
    clearError();
    await startScanning();
  };

  const handleToggleManualEntry = () => {
    if (isActive) {
      stopScanning();
    }
    setManualEntryMode(!manualEntryMode);
  };

  const renderInstructions = () => (
    <Card variant="outlined" padding="medium" className="mb-6 bg-blue-50 border-blue-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Camera className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-blue-900 mb-2 font-primary">
            How to Scan Your Curmunchkin
          </h3>
          <div className="space-y-2 text-blue-800">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-sm font-bold">1</div>
              <p>Find the QR code on your Curmunchkin attachment</p>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-sm font-bold">2</div>
              <p>Hold your device steady and point the camera at the code</p>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center mr-3 text-sm font-bold">3</div>
              <p>Wait for the magic to happen!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowInstructions(false)}
            className="mt-3"
          >
            Got it!
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderScannerContent = () => {
    if (manualEntryMode) {
      return <ManualEntry />;
    }

    if (state === 'initializing') {
      return (
        <Card variant="default" padding="large" className="text-center">
          <Loading size="medium" message="Setting up camera..." />
        </Card>
      );
    }

    if (error) {
      return (
        <Card variant="outlined" padding="medium" className="bg-red-50 border-red-200">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-red-900 mb-2 font-primary">
              Camera Not Working
            </h3>
            <p className="text-red-800 mb-4">
              {error.userFriendlyMessage}
            </p>
            <div className="space-y-2">
              <Button
                variant="primary"
                size="touch"
                fullWidth
                onClick={handleStartScanning}
              >
                Try Again
              </Button>
              <Button
                variant="ghost"
                size="touch"
                fullWidth
                onClick={() => setManualEntryMode(true)}
              >
                Enter Code Manually
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (lastScanResult?.success) {
      return <ScanFeedback result={lastScanResult} />;
    }

    return <CameraView />;
  };

  const renderActionButtons = () => {
    if (lastScanResult?.success) {
      return null; // ScanFeedback component handles navigation
    }

    return (
      <div className="grid md:grid-cols-2 gap-4 mt-6">
        <Button
          variant={manualEntryMode ? "ghost" : "primary"}
          size="touch"
          fullWidth
          icon={Camera}
          onClick={manualEntryMode ? () => setManualEntryMode(false) : handleStartScanning}
          disabled={state === 'initializing'}
        >
          {manualEntryMode ? 'Use Camera' : isActive ? 'Scanning...' : 'Start Camera'}
        </Button>

        <Button
          variant={manualEntryMode ? "primary" : "ghost"}
          size="touch"
          fullWidth
          icon={Keyboard}
          onClick={handleToggleManualEntry}
        >
          {manualEntryMode ? 'Manual Entry' : 'Enter Code'}
        </Button>
      </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-primary">
          Scan Your Curmunchkin
        </h1>
        <p className="text-lg text-gray-600">
          Point your camera at the QR code to unlock your story adventure!
        </p>
      </div>

      {/* Instructions */}
      {showInstructions && renderInstructions()}

      {/* Scanner content */}
      {renderScannerContent()}

      {/* Action buttons */}
      {renderActionButtons()}

      {/* Help text */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Having trouble? Try manual entry or ask a grown-up for help.
        </p>
      </div>
    </div>
  );
};

export default Scanner;