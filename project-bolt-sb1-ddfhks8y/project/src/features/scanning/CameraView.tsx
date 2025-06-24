/**
 * Camera viewport component for QR code scanning
 * Handles camera stream display and QR detection
 */

import React, { useRef, useEffect, useState } from 'react';
import { Camera, SwitchCamera, Flashlight, FlashlightOff } from 'lucide-react';
import { useScannerStore } from '@/stores';
import { Button } from '@/components';

const CameraView: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const {
    cameraStream,
    availableCameras,
    selectedCamera,
    config,
    switchCamera,
    processScanResult,
  } = useScannerStore();

  // Set up video stream
  useEffect(() => {
    if (cameraStream && videoRef.current) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  // Mock QR detection (in real implementation, would use qr-scanner library)
  useEffect(() => {
    if (!cameraStream || !videoRef.current) return;

    const detectQRCode = () => {
      if (isDetecting) return;

      // Simulate QR detection delay
      const detectionInterval = setInterval(() => {
        // Mock detection of a valid QR code after 3-5 seconds
        const shouldDetect = Math.random() > 0.7; // 30% chance per interval
        
        if (shouldDetect) {
          setIsDetecting(true);
          clearInterval(detectionInterval);
          
          // Simulate successful scan
          const mockQRData = {
            data: 'CMFF123456A01', // Mock Curmunchkin code
            format: 'QR_CODE' as const,
            quality: {
              confidence: 0.95,
              readability: 0.9,
              contrast: 0.8,
              sharpness: 0.85,
            },
            geometry: {
              boundingBox: { x: 100, y: 100, width: 200, height: 200 },
              cornerPoints: {
                topLeft: { x: 100, y: 100 },
                topRight: { x: 300, y: 100 },
                bottomLeft: { x: 100, y: 300 },
                bottomRight: { x: 300, y: 300 },
              },
            },
            context: {
              timestamp: Date.now(),
              cameraDevice: selectedCamera || 'default',
              scanDuration: 2000,
              attemptNumber: 1,
              lightingConditions: 'good' as const,
            },
          };

          processScanResult(mockQRData);
        }
      }, 1000);

      return () => clearInterval(detectionInterval);
    };

    const cleanup = detectQRCode();
    return cleanup;
  }, [cameraStream, selectedCamera, processScanResult, isDetecting]);

  const handleTorchToggle = () => {
    // In real implementation, would control camera torch
    setTorchEnabled(!torchEnabled);
    console.log('Torch toggled:', !torchEnabled);
  };

  const handleCameraSwitch = () => {
    if (availableCameras.length > 1) {
      switchCamera();
    }
  };

  return (
    <div className="relative">
      {/* Camera viewport */}
      <div className="relative bg-black rounded-2xl overflow-hidden aspect-square max-w-md mx-auto">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Scanning overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Scanning frame */}
          <div className="relative w-64 h-64 border-4 border-white rounded-2xl">
            {/* Corner indicators */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-l-4 border-t-4 border-purple-400 rounded-tl-lg"></div>
            <div className="absolute -top-2 -right-2 w-8 h-8 border-r-4 border-t-4 border-purple-400 rounded-tr-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-4 border-b-4 border-purple-400 rounded-bl-lg"></div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-4 border-b-4 border-purple-400 rounded-br-lg"></div>
            
            {/* Scanning line animation */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Camera controls */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          {/* Torch control */}
          <Button
            variant="ghost"
            size="touch"
            icon={torchEnabled ? FlashlightOff : Flashlight}
            onClick={handleTorchToggle}
            className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            aria-label={torchEnabled ? 'Turn off flashlight' : 'Turn on flashlight'}
          />

          {/* Camera switch */}
          {availableCameras.length > 1 && (
            <Button
              variant="ghost"
              size="touch"
              icon={SwitchCamera}
              onClick={handleCameraSwitch}
              className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              aria-label="Switch camera"
            />
          )}
        </div>

        {/* Status indicator */}
        <div className="absolute top-4 left-4 right-4 text-center">
          <div className="inline-flex items-center px-3 py-1 bg-black bg-opacity-50 text-white text-sm rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
            {isDetecting ? 'Processing...' : 'Looking for QR code...'}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mt-4">
        <p className="text-gray-600">
          Hold your device steady and center the QR code in the frame
        </p>
      </div>
    </div>
  );
};

export default CameraView;