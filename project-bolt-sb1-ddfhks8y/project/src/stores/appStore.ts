/**
 * Main application store using Zustand
 * Coordinates global app state, user management, and cross-feature communication
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { 
  UserProfile, 
  UserPreferences, 
  AppConfig, 
  AppError,
  LoadingState,
  DeviceId,
  UserId 
} from '@/types';
import { 
  initializeStorage, 
  loadPreferences, 
  getDefaultPreferences,
  applySystemPreferences,
  getStorageHealthReport 
} from '@/services/storage';

export interface AppState {
  // App initialization and status
  isInitialized: boolean;
  isLoading: boolean;
  error: AppError | null;
  
  // User management
  currentUser: UserProfile | null;
  deviceId: DeviceId | null;
  preferences: UserPreferences | null;
  
  // App configuration
  config: AppConfig;
  
  // Storage and performance
  storageHealth: {
    quotaUsed: number;
    needsCleanup: boolean;
    lastChecked: number;
  };
  
  // UI state
  activeModal: string | null;
  notifications: Array<{
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: number;
    dismissed: boolean;
  }>;
  
  // Accessibility state
  accessibilityMode: {
    screenReaderActive: boolean;
    keyboardNavigationActive: boolean;
    highContrastMode: boolean;
    reducedMotionMode: boolean;
  };
}

export interface AppActions {
  // Initialization
  initializeApp: () => Promise<void>;
  setError: (error: AppError | null) => void;
  clearError: () => void;
  
  // User management
  setCurrentUser: (user: UserProfile | null) => void;
  updateUserPreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  generateDeviceId: () => DeviceId;
  
  // UI management
  setActiveModal: (modalId: string | null) => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'dismissed'>) => void;
  dismissNotification: (notificationId: string) => void;
  clearNotifications: () => void;
  
  // Accessibility
  updateAccessibilityMode: (updates: Partial<AppState['accessibilityMode']>) => void;
  detectAccessibilityFeatures: () => void;
  
  // Storage management
  checkStorageHealth: () => Promise<void>;
  performCleanup: () => Promise<void>;
  
  // App lifecycle
  handleAppFocus: () => void;
  handleAppBlur: () => void;
  handleBeforeUnload: () => void;
}

// Default app configuration
const DEFAULT_CONFIG: AppConfig = {
  version: '1.0.0',
  environment: 'development',
  features: {
    voiceAI: true,
    blockchain: true,
    analytics: false, // Disabled for privacy
    parentControls: true,
    offlineMode: true,
  },
  limits: {
    maxSessionDuration: 30, // 30 minutes
    maxStoriesPerDay: 10,
    maxRetryAttempts: 3,
    cacheSize: 500, // 500MB
  },
  urls: {
    api: import.meta.env.VITE_API_URL || '',
    ipfs: import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/',
    support: 'https://curmunchkins.com/support',
    privacy: 'https://curmunchkins.com/privacy',
    terms: 'https://curmunchkins.com/terms',
  },
};

export const useAppStore = create<AppState & AppActions>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    isInitialized: false,
    isLoading: false,
    error: null,
    currentUser: null,
    deviceId: null,
    preferences: null,
    config: DEFAULT_CONFIG,
    storageHealth: {
      quotaUsed: 0,
      needsCleanup: false,
      lastChecked: 0,
    },
    activeModal: null,
    notifications: [],
    accessibilityMode: {
      screenReaderActive: false,
      keyboardNavigationActive: false,
      highContrastMode: false,
      reducedMotionMode: false,
    },

    // Actions
    initializeApp: async () => {
      set({ isLoading: true, error: null });
      
      try {
        console.log('Initializing Curmunchkins Mystery Box Explorer...');
        
        // Generate or retrieve device ID
        const deviceId = get().generateDeviceId();
        set({ deviceId });
        
        // Initialize storage services
        await initializeStorage();
        
        // Load user preferences
        const preferences = await loadPreferences(deviceId) || getDefaultPreferences(deviceId);
        
        // Apply system accessibility preferences
        await applySystemPreferences(deviceId);
        
        // Create default user profile
        const userProfile: UserProfile = {
          id: deviceId,
          deviceId,
          role: 'child',
          createdAt: Date.now(),
          lastActiveAt: Date.now(),
          privacy: {
            dataCollection: 'minimal',
            parentalControls: true,
            shareWithTherapist: false,
            anonymousAnalytics: false,
          },
        };
        
        // Ensure visual contrast is set to normal by default
        if (preferences.accessibility.visualContrast !== 'normal') {
          preferences.accessibility.visualContrast = 'normal';
        }
        
        // Detect accessibility features
        get().detectAccessibilityFeatures();
        
        // Check storage health
        await get().checkStorageHealth();
        
        set({ 
          currentUser: userProfile,
          preferences,
          isInitialized: true,
          isLoading: false,
        });
        
        console.log('App initialization completed successfully');
        
        // Add welcome notification
        get().addNotification({
          type: 'success',
          message: 'Welcome to Curmunchkins Mystery Box Explorer!',
        });
        
      } catch (error) {
        console.error('App initialization failed:', error);
        
        const appError: AppError = {
          id: crypto.randomUUID(),
          code: 'INITIALIZATION_FAILED',
          message: 'Failed to initialize the application',
          severity: 'critical',
          timestamp: Date.now(),
          context: {
            component: 'AppStore',
            action: 'initializeApp',
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
          recoverable: true,
          reported: false,
        };
        
        set({ 
          error: appError,
          isLoading: false,
          isInitialized: false,
        });
      }
    },

    setError: (error) => {
      set({ error });
      
      if (error) {
        console.error('App error:', error);
        
        // Add error notification
        get().addNotification({
          type: 'error',
          message: error.message,
        });
      }
    },

    clearError: () => {
      set({ error: null });
    },

    setCurrentUser: (user) => {
      set({ currentUser: user });
    },

    updateUserPreferences: async (updates) => {
      const { preferences, deviceId } = get();
      if (!preferences || !deviceId) return;
      
      try {
        const updatedPreferences: UserPreferences = {
          ...preferences,
          ...updates,
          lastUpdated: Date.now(),
        };
        
        // Save to storage
        const { savePreferences } = await import('@/services/storage');
        await savePreferences(updatedPreferences);
        
        set({ preferences: updatedPreferences });
        
        console.log('User preferences updated');
      } catch (error) {
        console.error('Failed to update preferences:', error);
        get().setError({
          id: crypto.randomUUID(),
          code: 'PREFERENCES_UPDATE_FAILED',
          message: 'Failed to save preferences',
          severity: 'medium',
          timestamp: Date.now(),
          context: {
            component: 'AppStore',
            action: 'updateUserPreferences',
            userAgent: navigator.userAgent,
            url: window.location.href,
          },
          recoverable: true,
          reported: false,
        });
      }
    },

    generateDeviceId: () => {
      // Check if device ID already exists in localStorage
      const existingId = localStorage.getItem('curmunchkins-device-id');
      if (existingId) {
        return existingId as DeviceId;
      }
      
      // Generate new device ID
      const newId = `device_${crypto.randomUUID()}` as DeviceId;
      localStorage.setItem('curmunchkins-device-id', newId);
      return newId;
    },

    setActiveModal: (modalId) => {
      set({ activeModal: modalId });
    },

    addNotification: (notification) => {
      const newNotification = {
        ...notification,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        dismissed: false,
      };
      
      set(state => ({
        notifications: [...state.notifications, newNotification],
      }));
      
      // Auto-dismiss after 5 seconds for non-error notifications
      if (notification.type !== 'error') {
        setTimeout(() => {
          get().dismissNotification(newNotification.id);
        }, 5000);
      }
    },

    dismissNotification: (notificationId) => {
      set(state => ({
        notifications: state.notifications.map(notification =>
          notification.id === notificationId
            ? { ...notification, dismissed: true }
            : notification
        ),
      }));
      
      // Remove dismissed notifications after animation
      setTimeout(() => {
        set(state => ({
          notifications: state.notifications.filter(
            notification => notification.id !== notificationId
          ),
        }));
      }, 300);
    },

    clearNotifications: () => {
      set({ notifications: [] });
    },

    updateAccessibilityMode: (updates) => {
      set(state => ({
        accessibilityMode: {
          ...state.accessibilityMode,
          ...updates,
        },
      }));
    },

    detectAccessibilityFeatures: () => {
      const updates: Partial<AppState['accessibilityMode']> = {};
      
      // Detect screen reader
      if (navigator.userAgent.includes('NVDA') || 
          navigator.userAgent.includes('JAWS') || 
          navigator.userAgent.includes('VoiceOver')) {
        updates.screenReaderActive = true;
      }
      
      // Detect high contrast mode
      if (window.matchMedia('(prefers-contrast: high)').matches) {
        // Don't automatically set high contrast mode
        // updates.highContrastMode = true;
        console.log('High contrast mode detected in system preferences, but not automatically applied');
      }
      
      // Detect reduced motion preference
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        updates.reducedMotionMode = true;
      }
      
      // Listen for keyboard navigation
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab') {
          get().updateAccessibilityMode({ keyboardNavigationActive: true });
        }
      };
      
      const handleMouseDown = () => {
        get().updateAccessibilityMode({ keyboardNavigationActive: false });
      };
      
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleMouseDown);
      
      if (Object.keys(updates).length > 0) {
        get().updateAccessibilityMode(updates);
      }
    },

    checkStorageHealth: async () => {
      try {
        const healthReport = await getStorageHealthReport();
        
        set({
          storageHealth: {
            quotaUsed: healthReport.quota.percentUsed,
            needsCleanup: healthReport.quota.needsCleanup,
            lastChecked: Date.now(),
          },
        });
        
        // Warn if storage is getting full
        if (healthReport.quota.percentUsed > 80) {
          get().addNotification({
            type: 'warning',
            message: 'Storage is getting full. Some cleanup may be needed.',
          });
        }
        
      } catch (error) {
        console.error('Failed to check storage health:', error);
      }
    },

    performCleanup: async () => {
      try {
        const { performStorageCleanup } = await import('@/services/storage');
        const result = await performStorageCleanup();
        
        get().addNotification({
          type: 'success',
          message: `Cleanup completed: ${result.assetsCleanedUp} items removed`,
        });
        
        // Refresh storage health
        await get().checkStorageHealth();
        
      } catch (error) {
        console.error('Cleanup failed:', error);
        get().addNotification({
          type: 'error',
          message: 'Cleanup failed. Please try again.',
        });
      }
    },

    handleAppFocus: () => {
      // Update last active time
      const { currentUser } = get();
      if (currentUser) {
        set({
          currentUser: {
            ...currentUser,
            lastActiveAt: Date.now(),
          },
        });
      }
      
      // Check storage health periodically
      const { storageHealth } = get();
      const oneHour = 60 * 60 * 1000;
      if (Date.now() - storageHealth.lastChecked > oneHour) {
        get().checkStorageHealth();
      }
    },

    handleAppBlur: () => {
      // Save any pending data when app loses focus
      console.log('App lost focus - saving state');
    },

    handleBeforeUnload: () => {
      // Cleanup before page unload
      console.log('App unloading - performing cleanup');
      
      // Close database connections
      const { closeDB } = import('@/services/storage/db');
      closeDB();
    },
  }))
);

// Set up app lifecycle listeners
if (typeof window !== 'undefined') {
  window.addEventListener('focus', () => {
    useAppStore.getState().handleAppFocus();
  });
  
  window.addEventListener('blur', () => {
    useAppStore.getState().handleAppBlur();
  });
  
  window.addEventListener('beforeunload', () => {
    useAppStore.getState().handleBeforeUnload();
  });
}

// Subscribe to preference changes to update accessibility mode
useAppStore.subscribe(
  (state) => state.preferences?.accessibility,
  (accessibility) => {
    if (accessibility) {
      useAppStore.getState().updateAccessibilityMode({
        highContrastMode: accessibility.visualContrast === 'high',
        reducedMotionMode: accessibility.reduceMotion,
      });
    }
  }
);