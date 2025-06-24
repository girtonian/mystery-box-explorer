/**
 * Scanner state management using Zustand
 * Handles QR code scanning, camera permissions, and attachment recognition
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { parseAttachmentCode } from '@/features/scanning/scannerUtils';
import type { 
  ScannerState,
  ScannerConfig,
  ScanResult,
  ScanError,
  ScanSession,
  CameraDevice,
  AttachmentCode,
  QRCodeData,
  ScanMethod 
} from '@/types';
import { DEFAULT_SCANNER_CONFIG } from '@/types';

export interface ScannerStoreState {
  // Scanner status
  state: ScannerState;
  isActive: boolean;
  error: ScanError | null;
  
  // Configuration
  config: ScannerConfig;
  
  // Camera management
  availableCameras: CameraDevice[];
  selectedCamera: string | null;
  cameraStream: MediaStream | null;
  hasPermission: boolean;
  permissionRequested: boolean;
  
  // Scanning results
  lastScanResult: ScanResult | null;
  scanHistory: ScanResult[];
  currentSession: ScanSession | null;
  
  // Manual entry
  manualEntryMode: boolean;
  manualCode: string;
  
  // Performance metrics
  scanMetrics: {
    totalScans: number;
    successfulScans: number;
    averageScanTime: number;
    lastScanDuration: number;
  };
}

export interface ScannerStoreActions {
  // Scanner lifecycle
  initializeScanner: () => Promise<void>;
  startScanning: () => Promise<void>;
  stopScanning: () => void;
  resetScanner: () => void;
  
  // Camera management
  requestCameraPermission: () => Promise<boolean>;
  selectCamera: (deviceId: string) => Promise<void>;
  switchCamera: () => Promise<void>;
  
  // Configuration
  updateConfig: (updates: Partial<ScannerConfig>) => void;
  
  // Scanning operations
  processScanResult: (qrData: QRCodeData) => Promise<void>;
  validateAttachmentCode: (code: string) => Promise<AttachmentCode | null>;
  
  // Manual entry
  setManualEntryMode: (enabled: boolean) => void;
  setManualCode: (code: string) => void;
  submitManualCode: () => Promise<void>;
  
  // Session management
  startScanSession: () => void;
  endScanSession: () => void;
  
  // Error handling
  setError: (error: ScanError | null) => void;
  clearError: () => void;
  
  // Utilities
  getScanHistory: () => ScanResult[];
  clearScanHistory: () => void;
  exportScanData: () => any;
}

export const useScannerStore = create<ScannerStoreState & ScannerStoreActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    state: 'idle',
    isActive: false,
    error: null,
    config: DEFAULT_SCANNER_CONFIG,
    availableCameras: [],
    selectedCamera: null,
    cameraStream: null,
    hasPermission: false,
    permissionRequested: false,
    lastScanResult: null,
    scanHistory: [],
    currentSession: null,
    manualEntryMode: false,
    manualCode: '',
    scanMetrics: {
      totalScans: 0,
      successfulScans: 0,
      averageScanTime: 0,
      lastScanDuration: 0,
    },

    // Actions
    initializeScanner: async () => {
      set({ state: 'initializing' });
      
      try {
        // Check if camera API is available
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          throw new Error('Camera API not available');
        }
        
        // Get available cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices
          .filter(device => device.kind === 'videoinput')
          .map(device => ({
            deviceId: device.deviceId,
            label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
            kind: 'videoinput' as const,
            groupId: device.groupId,
            facing: device.label.toLowerCase().includes('front') ? 'user' as const : 'environment' as const,
          }));
        
        set({ 
          availableCameras: cameras,
          state: 'idle',
        });
        
        console.log(`Scanner initialized with ${cameras.length} cameras`);
        
      } catch (error) {
        console.error('Scanner initialization failed:', error);
        get().setError({
          code: 'CAMERA_INITIALIZATION_FAILED',
          message: 'Failed to initialize camera system',
          timestamp: Date.now(),
          context: {
            scannerState: 'initializing',
            method: 'camera',
            retryCount: 0,
          },
          recoverable: true,
          suggestedActions: ['Check camera permissions', 'Try manual entry'],
          userFriendlyMessage: 'Camera setup failed. You can still enter codes manually!',
        });
        set({ state: 'error' });
      }
    },

    requestCameraPermission: async () => {
      if (get().permissionRequested && get().hasPermission) {
        return true;
      }
      
      set({ permissionRequested: true });
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        // Stop the stream immediately - we just needed permission
        stream.getTracks().forEach(track => track.stop());
        
        set({ hasPermission: true });
        return true;
        
      } catch (error) {
        console.error('Camera permission denied:', error);
        get().setError({
          code: 'CAMERA_PERMISSION_DENIED',
          message: 'Camera permission was denied',
          timestamp: Date.now(),
          context: {
            scannerState: get().state,
            method: 'camera',
            retryCount: 0,
          },
          recoverable: true,
          suggestedActions: ['Enable camera in browser settings', 'Use manual entry'],
          userFriendlyMessage: 'Camera access needed to scan codes. You can enter codes manually instead!',
        });
        
        set({ hasPermission: false });
        return false;
      }
    },

    startScanning: async () => {
      const { hasPermission, selectedCamera, availableCameras, config } = get();
      
      // Request permission if not already granted
      if (!hasPermission) {
        const granted = await get().requestCameraPermission();
        if (!granted) {
          return;
        }
      }
      
      set({ state: 'scanning', isActive: true });
      
      try {
        // Select camera if none selected
        let cameraId = selectedCamera;
        if (!cameraId && availableCameras.length > 0) {
          // Prefer back camera for QR scanning
          const backCamera = availableCameras.find(cam => cam.facing === 'environment');
          cameraId = backCamera?.deviceId || availableCameras[0].deviceId;
        }
        
        // Start camera stream
        const constraints = {
          ...config.camera.constraints,
          video: {
            ...config.camera.constraints.video,
            deviceId: cameraId ? { exact: cameraId } : undefined,
          },
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        set({ 
          cameraStream: stream,
          selectedCamera: cameraId,
        });
        
        // Start scan session
        get().startScanSession();
        
        console.log('Scanner started successfully');
        
      } catch (error) {
        console.error('Failed to start scanner:', error);
        get().setError({
          code: 'CAMERA_NOT_AVAILABLE',
          message: 'Camera is not available',
          timestamp: Date.now(),
          context: {
            scannerState: 'scanning',
            method: 'camera',
            retryCount: 0,
            cameraDevice: selectedCamera || 'auto',
          },
          recoverable: true,
          suggestedActions: ['Try different camera', 'Use manual entry'],
          userFriendlyMessage: 'Camera not working. Try manual code entry!',
        });
        
        set({ state: 'error', isActive: false });
      }
    },

    stopScanning: () => {
      const { cameraStream, currentSession } = get();
      
      // Stop camera stream
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
      
      // End scan session
      if (currentSession) {
        get().endScanSession();
      }
      
      set({
        state: 'idle',
        isActive: false,
        cameraStream: null,
      });
      
      console.log('Scanner stopped');
    },

    resetScanner: () => {
      get().stopScanning();
      set({
        error: null,
        lastScanResult: null,
        manualEntryMode: false,
        manualCode: '',
      });
    },

    selectCamera: async (deviceId) => {
      const { isActive } = get();
      
      set({ selectedCamera: deviceId });
      
      // Restart scanning with new camera if currently active
      if (isActive) {
        get().stopScanning();
        await get().startScanning();
      }
    },

    switchCamera: async () => {
      const { availableCameras, selectedCamera } = get();
      
      if (availableCameras.length < 2) return;
      
      const currentIndex = availableCameras.findIndex(cam => cam.deviceId === selectedCamera);
      const nextIndex = (currentIndex + 1) % availableCameras.length;
      const nextCamera = availableCameras[nextIndex];
      
      await get().selectCamera(nextCamera.deviceId);
    },

    updateConfig: (updates) => {
      set(state => ({
        config: {
          ...state.config,
          ...updates,
        },
      }));
    },

    processScanResult: async (qrData) => {
      set({ state: 'processing' });
      
      try {
        // Use scanner service to process the scan
        const { scannerService } = await import('@/features/scanning/scannerService');
        const scanResult = await scannerService.processScan(qrData);
        
        // Update metrics for successful scans
        if (scanResult.success) {
          const { scanMetrics } = get();
          const newMetrics = {
            totalScans: scanMetrics.totalScans + 1,
            successfulScans: scanMetrics.successfulScans + 1,
            lastScanDuration: scanResult.metrics.scanDuration,
            averageScanTime: (scanMetrics.averageScanTime * scanMetrics.totalScans + scanResult.metrics.scanDuration) / (scanMetrics.totalScans + 1),
          };
          
          set({
            state: 'success',
            lastScanResult: scanResult,
            scanHistory: [...get().scanHistory, scanResult],
            scanMetrics: newMetrics,
          });
          
          console.log('Scan successful:', scanResult.data?.attachment);
          
          // Auto-stop scanning after successful scan
          setTimeout(() => {
            get().stopScanning();
          }, 2000);
        } else {
          // Handle failed scan
          set({
            state: 'error',
            lastScanResult: scanResult,
            scanHistory: [...get().scanHistory, scanResult],
          });
          
          get().setError(scanResult.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Unknown scanning error occurred',
            timestamp: Date.now(),
            context: {
              scannerState: 'processing',
              method: 'camera',
              retryCount: 0,
            },
            recoverable: true,
            suggestedActions: ['Try scanning again'],
            userFriendlyMessage: 'Something went wrong. Please try again!',
          });
        }
        
      } catch (error) {
        console.error('Scan processing failed:', error);
        
        const failedScanResult: ScanResult = {
          success: false,
          method: 'camera',
          timestamp: Date.now(),
          error: {
            code: 'UNKNOWN_ERROR',
            message: 'Scan processing failed',
            details: error,
            recoverable: true,
            suggestedAction: 'Try scanning again or enter code manually',
          },
          metrics: {
            scanDuration: 0,
            processingTime: 0,
            retryCount: 0,
            cameraInitTime: 0,
            qrDetectionTime: 0,
          },
        };
        
        set({
          state: 'error',
          lastScanResult: failedScanResult,
          scanHistory: [...get().scanHistory, failedScanResult],
        });
        
        get().setError({
          code: 'UNKNOWN_ERROR',
          message: 'Scan processing failed',
          timestamp: Date.now(),
          context: {
            scannerState: 'processing',
            method: 'camera',
            retryCount: 0,
          },
          recoverable: true,
          suggestedActions: ['Try scanning again', 'Use manual entry'],
          userFriendlyMessage: 'Something went wrong. Please try again!',
        });
      }
    },

    validateAttachmentCode: async (code) => {
      try {
        // Use the whitelist validation for attachment codes
        const { validateAttachmentCode } = await import('@/features/scanning/attachmentWhitelist');
        const parsedCode = validateAttachmentCode(code);
        return parsedCode;
      } catch (error) {
        console.error('Failed to validate attachment code:', error);
        return null;
      }
    },

    setManualEntryMode: (enabled) => {
      set({ manualEntryMode: enabled });
      
      if (enabled) {
        get().stopScanning();
      }
    },

    setManualCode: (code) => {
      set({ manualCode: code.toUpperCase() });
    },

    submitManualCode: async () => {
      const { manualCode } = get();
      
      if (!manualCode.trim()) {
        get().setError({
          code: 'INVALID_QR_FORMAT',
          message: 'Please enter a valid code',
          timestamp: Date.now(),
          context: {
            scannerState: get().state,
            method: 'manual',
            retryCount: 0,
          },
          recoverable: true,
          suggestedActions: ['Enter a valid attachment code'],
          userFriendlyMessage: 'Please enter a valid code!',
        });
        return;
      }
      
      try {
        // Use scanner service to process manual entry
        const { scannerService } = await import('@/features/scanning/scannerService');
        const scanResult = await scannerService.processManualEntry(manualCode);
        
        // Update state based on result
        if (scanResult.success) {
          const { scanMetrics } = get();
          const newMetrics = {
            totalScans: scanMetrics.totalScans + 1,
            successfulScans: scanMetrics.successfulScans + 1,
            lastScanDuration: 0,
            averageScanTime: scanMetrics.averageScanTime, // Don't include manual entry in scan time average
          };
          
          set({
            state: 'success',
            lastScanResult: scanResult,
            scanHistory: [...get().scanHistory, scanResult],
            scanMetrics: newMetrics,
            manualCode: '', // Clear the manual code on success
          });
          
          console.log('Manual entry successful:', scanResult.data?.attachment);
        } else {
          set({
            state: 'error',
            lastScanResult: scanResult,
            scanHistory: [...get().scanHistory, scanResult],
          });
          
          get().setError(scanResult.error || {
            code: 'UNKNOWN_ERROR',
            message: 'Manual entry processing failed',
            timestamp: Date.now(),
            context: {
              scannerState: get().state,
              method: 'manual',
              retryCount: 0,
            },
            recoverable: true,
            suggestedActions: ['Check the code and try again'],
            userFriendlyMessage: 'Code not recognized. Please check and try again!',
          });
        }
        
      } catch (error) {
        console.error('Manual entry processing failed:', error);
        
        get().setError({
          code: 'UNKNOWN_ERROR',
          message: 'Manual entry processing failed',
          timestamp: Date.now(),
          context: {
            scannerState: get().state,
            method: 'manual',
            retryCount: 0,
          },
          recoverable: true,
          suggestedActions: ['Check the code and try again'],
          userFriendlyMessage: 'Something went wrong. Please try again!',
        });
      }
    },

    startScanSession: () => {
      const sessionId = crypto.randomUUID();
      const session: ScanSession = {
        id: sessionId,
        userId: 'current-user', // Would get from app store
        startTime: Date.now(),
        config: get().config,
        attempts: [],
        outcomes: {
          successfulScans: 0,
          failedScans: 0,
          storiesUnlocked: [],
          attachmentsScanned: [],
          errorsEncountered: [],
        },
        experience: {
          frustrationLevel: 0,
          helpRequestsCount: 0,
          settingsChangedCount: 0,
        },
        accessibility: {
          manualEntryUsed: false,
          fileUploadUsed: false,
          audioFeedbackUsed: false,
          hapticFeedbackUsed: false,
          visualAidsUsed: false,
        },
      };
      
      set({ currentSession: session });
    },

    endScanSession: () => {
      const { currentSession } = get();
      if (!currentSession) return;
      
      const endedSession = {
        ...currentSession,
        endTime: Date.now(),
      };
      
      // Save session to storage (would implement this)
      console.log('Scan session ended:', endedSession);
      
      set({ currentSession: null });
    },

    setError: (error) => {
      set({ error });
    },

    clearError: () => {
      set({ error: null });
    },

    getScanHistory: () => {
      return get().scanHistory;
    },

    clearScanHistory: () => {
      set({ scanHistory: [] });
    },

    exportScanData: () => {
      const { scanHistory, scanMetrics, currentSession } = get();
      
      return {
        history: scanHistory,
        metrics: scanMetrics,
        session: currentSession,
        exportedAt: Date.now(),
      };
    },
  }))
);

// Auto-initialize scanner when store is created
if (typeof window !== 'undefined') {
  useScannerStore.getState().initializeScanner();
}