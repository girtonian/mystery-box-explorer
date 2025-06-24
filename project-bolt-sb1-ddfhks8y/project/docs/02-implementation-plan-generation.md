<brainstorming>
Looking at the technical specification, I need to create a step-by-step plan that builds the Curmunchkins Mystery Box Explorer from the ground up. Key considerations:

1. **Project Structure**: Start with Bolt.new React + TypeScript setup, add necessary dependencies
2. **Core Infrastructure**: 
   - Set up routing with react-router-dom
   - Configure Zustand stores for state management
   - Set up IndexedDB and localStorage services
   - Create TypeScript types and interfaces
3. **Design System**:
   - Configure Tailwind with accessibility utilities
   - Build base components (buttons, cards, modals)
   - Implement theme system with sensory-friendly options
4. **Feature Development** (in order of complexity):
   - Scanner component with QR detection
   - Story viewer with basic navigation
   - Voice integration with ElevenLabs
   - Blockchain integration (testnet only)
   - Parent controls and settings
5. **Testing & Deployment**:
   - Unit tests for critical components
   - Accessibility testing
   - Netlify deployment setup

The plan should ensure each step builds on the previous ones, with no circular dependencies. Each step should modify no more than 20 files and be completable in a single session.

Special considerations:
- Child safety and privacy are paramount
- Accessibility must be built-in from the start
- Performance on lower-end devices is critical
- Offline-first approach where possible
</brainstorming>

# Implementation Plan

## Project Setup & Configuration

- [x] Step 1: Initialize Bolt.new Project with Core Dependencies
  - **Task**: Create new React + TypeScript project on Bolt.new and install essential dependencies
  - **Files**:
    - `package.json`: Add all required dependencies from tech spec
    - `tsconfig.json`: Configure TypeScript for React 18
    - `vite.config.ts`: Configure Vite build settings
    - `.env.example`: Create template for environment variables
    - `index.html`: Update with accessibility meta tags
  - **Step Dependencies**: None
  - **User Instructions**: 
    1. Create new project on Bolt.new
    2. Copy dependencies from technical spec
    3. Run `npm install` to install packages

- [x] Step 2: Configure Tailwind CSS with Accessibility Utilities
  - **Task**: Set up Tailwind CSS with custom theme for sensory-friendly design
  - **Files**:
    - `tailwind.config.js`: Configure theme with dyslexia-friendly fonts and spacing
    - `src/styles/globals.css`: Import Tailwind and custom CSS variables
    - `src/styles/themes.ts`: Define theme constants and accessibility modes
    - `postcss.config.js`: Configure PostCSS for Tailwind
  - **Step Dependencies**: Step 1
  - **User Instructions**: None

## Core Infrastructure

- [x] Step 3: Create TypeScript Type Definitions
  - **Task**: Define all TypeScript interfaces and types for the application
  - **Files**:
    - `src/types/story.types.ts`: Story content and node interfaces
    - `src/types/user.types.ts`: User preferences and progress types
    - `src/types/voice.types.ts`: Voice settings and recognition types
    - `src/types/blockchain.types.ts`: NFT and wallet types
    - `src/types/scanner.types.ts`: Scanning state and result types
    - `src/types/index.ts`: Export all types
  - **Step Dependencies**: Step 2
  - **User Instructions**: None

- [x] Step 4: Implement Storage Services
  - **Task**: Create IndexedDB and localStorage service layers
  - **Files**:
    - `src/services/storage/db.ts`: IndexedDB initialization and schemas
    - `src/services/storage/storyStorage.ts`: Story content caching
    - `src/services/storage/progressStorage.ts`: Progress tracking
    - `src/services/storage/preferenceStorage.ts`: User preferences
    - `src/services/storage/assetStorage.ts`: Media asset caching
    - `src/services/storage/index.ts`: Export storage services
  - **Step Dependencies**: Step 3
  - **User Instructions**: None

- [x] Step 5: Set Up Zustand State Management
  - **Task**: Create Zustand stores for application state
  - **Files**:
    - `src/stores/appStore.ts`: Main application store
    - `src/stores/scannerStore.ts`: Scanner state management
    - `src/stores/storyStore.ts`: Story progress and content
    - `src/stores/voiceStore.ts`: Voice settings and state
    - `src/stores/blockchainStore.ts`: Wallet and NFT state
    - `src/stores/index.ts`: Export all stores
  - **Step Dependencies**: Step 4
  - **User Instructions**: None

- [x] Step 6: Configure React Router and Layout
  - **Task**: Set up routing structure and base layout components
  - **Files**:
    - `src/App.tsx`: Main app component with router
    - `src/routes/index.tsx`: Route definitions
    - `src/components/Layout/Layout.tsx`: Main layout wrapper
    - `src/components/Layout/Header.tsx`: Minimal header
    - `src/components/Layout/AccessibilityControls.tsx`: Floating accessibility panel
    - `src/pages/Home.tsx`: Home page placeholder
    - `src/pages/Scanner.tsx`: Scanner page placeholder
    - `src/pages/Story.tsx`: Story page placeholder
    - `src/pages/Collection.tsx`: Collection page placeholder
  - **Step Dependencies**: Step 5
  - **User Instructions**: None

## Design System Components

- [x] Step 7: Build Core UI Components
  - **Task**: Create reusable UI components with accessibility built-in
  - **Files**:
    - `src/components/Button/Button.tsx`: Accessible button component
    - `src/components/Button/Button.styles.ts`: Button styling variants
    - `src/components/Card/Card.tsx`: Content card component
    - `src/components/Modal/Modal.tsx`: Accessible modal dialog
    - `src/components/Loading/Loading.tsx`: Loading states
    - `src/components/ErrorBoundary/ErrorBoundary.tsx`: Error handling
    - `src/components/index.ts`: Export all components
  - **Step Dependencies**: Step 6
  - **User Instructions**: None

- [x] Step 8: Implement Accessibility Provider
  - **Task**: Create context provider for accessibility settings
  - **Files**:
    - `src/providers/AccessibilityProvider.tsx`: Accessibility context
    - `src/hooks/useAccessibility.ts`: Accessibility hook
    - `src/utils/accessibility.ts`: Helper functions
    - `src/components/AccessibilityPanel/AccessibilityPanel.tsx`: Settings UI
    - `src/components/AccessibilityPanel/FontSizeControl.tsx`: Font size selector
    - `src/components/AccessibilityPanel/ContrastControl.tsx`: Contrast toggle
    - `src/components/AccessibilityPanel/MotionControl.tsx`: Motion preferences
  - **Step Dependencies**: Step 7
  - **User Instructions**: None

## Scanner Feature

- [x] Step 9: Implement QR Scanner Component
  - **Task**: Create camera-based QR code scanner with fallback
  - **Files**:
    - `src/features/scanning/Scanner.tsx`: Main scanner component
    - `src/features/scanning/CameraView.tsx`: Camera viewport
    - `src/features/scanning/ManualEntry.tsx`: Manual code entry
    - `src/features/scanning/ScanFeedback.tsx`: Visual/audio feedback
    - `src/features/scanning/useCameraPermission.ts`: Permission hook
    - `src/features/scanning/scannerUtils.ts`: QR processing utilities
  - **Step Dependencies**: Step 7
  - **User Instructions**: None

- [x] Step 10: Add Scanner State Management
  - **Task**: Connect scanner to state management and storage
  - **Files**:
    - `src/features/scanning/useScannerState.ts`: Scanner state hook
    - `src/features/scanning/scannerService.ts`: Scanning logic service
    - `src/features/scanning/attachmentWhitelist.ts`: Valid attachment codes
    - `src/stores/scannerStore.ts`: Update with scan processing
    - `src/pages/Scanner.tsx`: Integrate scanner component
  - **Step Dependencies**: Step 9
  - **User Instructions**: None

## Story Engine

- [x] Step 11: Create Story Content Structure
  - **Task**: Set up story content system and sample data
  - **Files**:
    - `public/stories/silo-fidget-feet.json`: Sample story content
    - `public/stories/blip-weighted-arms.json`: Sample story content
    - `src/features/storytelling/storyLoader.ts`: Story loading service
    - `src/features/storytelling/storyValidator.ts`: Content validation
    - `src/features/storytelling/storyTypes.ts`: Story-specific types
  - **Step Dependencies**: Step 10
  - **User Instructions**: Create story content JSON files based on PRD examples

- [x] Step 12: Build Story Viewer Component
  - **Task**: Create story display and navigation components
  - **Files**:
    - `src/features/storytelling/StoryViewer.tsx`: Main story component
    - `src/features/storytelling/StoryText.tsx`: Text display with animations
    - `src/features/storytelling/StoryProgress.tsx`: Progress indicator
    - `src/features/storytelling/StoryNavigation.tsx`: Next/previous controls
    - `src/features/storytelling/InteractionPrompt.tsx`: Voice prompts UI
    - `src/features/storytelling/useStoryProgress.ts`: Progress tracking hook
  - **Step Dependencies**: Step 11
  - **User Instructions**: None

## Voice AI Integration

- [x] Step 13: Set Up ElevenLabs Service
  - **Task**: Create voice synthesis and recognition service layer
  - **Files**:
    - `src/services/elevenlabs/client.ts`: ElevenLabs API client
    - `src/services/elevenlabs/voiceSynthesis.ts`: Text-to-speech service
    - `src/services/elevenlabs/voiceRecognition.ts`: Speech recognition
    - `src/services/elevenlabs/voiceModels.ts`: Character voice configurations
    - `src/services/elevenlabs/audioQueue.ts`: Audio buffering system
    - `.env`: Add VITE_ELEVENLABS_API_KEY
  - **Step Dependencies**: Step 12
  - **User Instructions**: 
    1. Sign up for ElevenLabs account
    2. Get API key and add to .env file

- [x] Step 14: Create Voice Control Components
  - **Task**: Build UI for voice playback and controls
  - **Files**:
    - `src/features/voice/VoiceControls.tsx`: Playback control panel
    - `src/features/voice/VoiceVisualizer.tsx`: Audio visualization
    - `src/features/voice/SpeedControl.tsx`: Playback speed slider
    - `src/features/voice/VoiceSettings.tsx`: Voice preferences
    - `src/features/voice/useVoicePlayer.ts`: Voice playback hook
    - `src/features/voice/useVoiceRecognition.ts`: Recognition hook
  - **Step Dependencies**: Step 13
  - **User Instructions**: None

- [x] Step 15: Integrate Voice with Story Engine
  - **Task**: Connect voice narration to story progression
  - **Files**:
    - `src/features/storytelling/StoryViewer.tsx`: Add voice integration
    - `src/features/storytelling/useStoryNarration.ts`: Narration coordination
    - `src/features/voice/voiceProvider.tsx`: Voice context provider
    - `src/stores/voiceStore.ts`: Update with narration state
    - `src/pages/Story.tsx`: Integrate voice controls
  - **Step Dependencies**: Step 14
  - **User Instructions**: None

## Blockchain Integration

- [x] Step 16: Set Up Algorand Service
  - **Task**: Create blockchain service layer for NFT operations
  - **Files**:
    - `src/services/algorand/client.ts`: Algorand SDK setup
    - `src/services/algorand/wallet.ts`: Wallet management
    - `src/services/algorand/nftService.ts`: NFT minting logic
    - `src/services/algorand/metadata.ts`: NFT metadata generation
    - `src/services/algorand/ipfs.ts`: IPFS upload service
    - `.env`: Add VITE_ALGORAND_NETWORK
  - **Step Dependencies**: Step 15
  - **User Instructions**: None

- [x] Step 17: Build NFT Collection UI
  - **Task**: Create components for displaying NFT collection
  - **Files**:
    - `src/features/blockchain/NFTGallery.tsx`: Collection display
    - `src/features/blockchain/NFTCard.tsx`: Individual NFT display
    - `src/features/blockchain/WalletConnect.tsx`: Wallet connection UI
    - `src/features/blockchain/MintingProgress.tsx`: Minting feedback
    - `src/features/blockchain/useWallet.ts`: Wallet hook
    - `src/pages/Collection.tsx`: Integrate collection components
  - **Step Dependencies**: Step 16
  - **User Instructions**: None

## Parent Controls & Settings

- [x] Step 18: Implement Parent Portal
  - **Task**: Create parent access controls and settings management
  - **Files**:
    - `src/features/parent/ParentGate.tsx`: PIN entry component
    - `src/features/parent/ParentDashboard.tsx`: Settings dashboard
    - `src/features/parent/ProgressReport.tsx`: Child progress view
    - `src/features/parent/PrivacySettings.tsx`: Data controls
    - `src/features/parent/useParentAuth.ts`: Parent authentication
    - `src/utils/pinValidation.ts`: PIN security utilities
  - **Step Dependencies**: Step 17
  - **User Instructions**: None

## Testing & Error Handling

- [ ] Step 19: Add Error Handling and Testing
  - **Task**: Implement comprehensive error handling and basic tests
  - **Files**:
    - `src/components/ErrorBoundary/ErrorFallback.tsx`: Error UI
    - `src/utils/errorReporting.ts`: Error logging service
    - `src/__tests__/Scanner.test.tsx`: Scanner component tests
    - `src/__tests__/accessibility.test.tsx`: Accessibility tests
    - `src/__tests__/storyEngine.test.ts`: Story logic tests
    - `vitest.config.ts`: Test configuration
    - `package.json`: Add test scripts
  - **Step Dependencies**: Step 18
  - **User Instructions**: Run `npm test` to verify

## Deployment

- [ ] Step 20: Configure Deployment
  - **Task**: Set up Netlify deployment and production build
  - **Files**:
    - `netlify.toml`: Netlify configuration
    - `public/_redirects`: SPA routing support
    - `public/robots.txt`: Search engine directives
    - `public/manifest.json`: PWA manifest
    - `src/index.html`: Add PWA meta tags
    - `.env.production`: Production environment variables
    - `README.md`: Documentation and setup instructions
  - **Step Dependencies**: Step 19
  - **User Instructions**: 
    1. Connect GitHub repo to Netlify
    2. Configure environment variables in Netlify dashboard
    3. Deploy to production

---

## Summary

This implementation plan builds the Curmunchkins Mystery Box Explorer through 20 logical steps, each focusing on a specific aspect of the application. The approach prioritizes:

1. **Foundation First**: Establishing proper TypeScript types, storage services, and state management before building features
2. **Accessibility Throughout**: Building accessibility into every component from the start
3. **Progressive Feature Development**: Starting with core scanning functionality, then adding voice and blockchain features
4. **Safety and Privacy**: Implementing parent controls and local-first data storage
5. **Testing and Deployment**: Ensuring quality through testing before final deployment

Key considerations:
- Each step builds on previous work with clear dependencies
- Files are grouped logically to minimize cross-cutting concerns
- User instructions are provided where external setup is required
- The plan accommodates the hackathon timeline while maintaining quality

The modular structure allows for parallel development of some features (e.g., blockchain integration can proceed while voice features are being built) and provides fallback options if certain integrations prove challenging within the hackathon timeframe.