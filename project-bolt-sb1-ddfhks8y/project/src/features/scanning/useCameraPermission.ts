/**
 * Custom hook for managing camera permissions
 * Provides functions to request and check camera access status
 */

import { useState, useEffect, useCallback } from 'react';
import { useScannerStore } from '@/stores';
import type { ScanError } from '@/types';

export interface CameraPermissionHook {
  hasPermission: boolean;
  permissionStatus: PermissionState | 'unknown';
  requestPermission: () => Promise<boolean>;
  checkPermission: () => Promise<PermissionState>;
  error: ScanError | null;
}

const useCameraPermission = (): CameraPermissionHook => {
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | 'unknown'>('unknown');
  const [hasPermission, setHasPermission] = useState(false);
  const { setError, clearError } = useScannerStore();
  const [permissionError, setPermissionError] = useState<ScanError | null>(null);

  const checkPermission = useCallback(async (): Promise<PermissionState> => {
    if (!navigator.permissions || !navigator.permissions.query) {
      console.warn('Permissions API not supported in this browser.');
      setPermissionStatus('unknown');
      setHasPermission(false);
      return 'unknown';
    }

    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionStatus(result.state);
      setHasPermission(result.state === 'granted');
      clearError(); // Clear any previous camera errors
      setPermissionError(null);
      return result.state;
    } catch (err) {
      console.error('Error querying camera permission:', err);
      const error: ScanError = {
        code: 'CAMERA_PERMISSION_DENIED',
        message: 'Failed to query camera permission status.',
        timestamp: Date.now(),
        context: {
          scannerState: 'initializing',
          method: 'camera',
          retryCount: 0,
        },
        recoverable: true,
        suggestedActions: ['Check browser settings for camera access.'],
        userFriendlyMessage: 'We could not check your camera permission. Please ensure your browser allows camera access.',
      };
      setError(error);
      setPermissionError(error);
      setPermissionStatus('denied'); // Assume denied if query fails
      setHasPermission(false);
      return 'denied';
    }
  }, [setError, clearError]);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    clearError();
    setPermissionError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const error: ScanError = {
        code: 'CAMERA_NOT_AVAILABLE',
        message: 'getUserMedia is not supported in this browser.',
        timestamp: Date.now(),
        context: {
          scannerState: 'initializing',
          method: 'camera',
          retryCount: 0,
        },
        recoverable: false,
        suggestedActions: ['Try a different browser or device.'],
        userFriendlyMessage: 'Your device or browser does not support camera access.',
      };
      setError(error);
      setPermissionError(error);
      setPermissionStatus('denied');
      setHasPermission(false);
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop stream immediately after getting permission
      setPermissionStatus('granted');
      setHasPermission(true);
      clearError();
      setPermissionError(null);
      return true;
    } catch (err) {
      console.error('Error requesting camera permission:', err);
      const error: ScanError = {
        code: 'CAMERA_PERMISSION_DENIED',
        message: `Camera access denied: ${err instanceof Error ? err.message : String(err)}`,
        timestamp: Date.now(),
        context: {
          scannerState: 'initializing',
          method: 'camera',
          retryCount: 0,
        },
        recoverable: true,
        suggestedActions: ['Allow camera access in your browser settings.', 'Try manual code entry.'],
        userFriendlyMessage: 'Camera access was denied. Please allow camera access in your browser settings to use the scanner.',
      };
      setError(error);
      setPermissionError(error);
      setPermissionStatus('denied');
      setHasPermission(false);
      return false;
    }
  }, [setError, clearError]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return {
    hasPermission,
    permissionStatus,
    requestPermission,
    checkPermission,
    error: permissionError,
  };
};

export default useCameraPermission;