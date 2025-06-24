<specification_planning>

## Planning Analysis

### Project Overview
- **Type**: New web application built on Bolt.new
- **Core Functionality**: Physical toy scanning → personalized story unlock → voice narration → blockchain collectibles
- **Target Platform**: Web (responsive for mobile/tablet)
- **Key Integrations**: ElevenLabs API, Algorand blockchain, WebRTC camera
- **Critical Requirements**: Accessibility, sensory-friendly design, child safety

### Key Technical Challenges
1. **Camera Integration**: WebRTC implementation for QR scanning in browser
2. **Voice AI**: Real-time synthesis and recognition with ElevenLabs
3. **Blockchain**: Lightweight NFT minting without complex wallet management
4. **Performance**: Smooth experience on lower-end devices
5. **Offline Support**: Queue scanning for sync when online

### Architecture Approach
- Frontend: React with TypeScript for type safety
- State Management: Zustand for simplicity
- Styling: Tailwind CSS with custom accessibility utilities
- Storage: IndexedDB for media, localStorage for preferences
- Build Tool: Vite (via Bolt.new)

### Feature Prioritization (MVP)
1. QR code scanning and story unlock
2. Voice narration with basic controls
3. Simple progress tracking
4. Accessibility settings
5. Blockchain integration (testnet only)

</specification_planning>

# Curmunchkins Mystery Box Explorer Technical Specification (New Project)

## 1. System Overview

### Core Purpose & Goals
The Curmunchkins Mystery Box Explorer creates therapeutic storytelling experiences for neurodivergent children by connecting physical sensory toys with personalized digital narratives. The system uses QR code scanning to unlock character-specific stories narrated by AI voices, demonstrating evidence-based sensory regulation strategies while optionally creating blockchain collectibles.

### Primary Use Cases
1. **Story Discovery**: Child scans physical attachment → story unlocks → character narrates sensory tool usage
2. **Interactive Narration**: Voice AI guides child through story with prompts and responses
3. **Progress Tracking**: Parents monitor story engagement and sensory preferences
4. **Collectible Creation**: Optional blockchain minting for story ownership

### High-Level Architecture
```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Web Client    │────▶│  Bolt.new App    │────▶│ External APIs   │
│  (React + TS)   │     │   (Frontend)     │     │ - ElevenLabs    │
└─────────────────┘     └──────────────────┘     │ - Algorand      │
         │                       │                └─────────────────┘
         ▼                       ▼
┌─────────────────┐     ┌──────────────────┐
│  Local Storage  │     │    IndexedDB     │
│  (Preferences)  │     │ (Media Assets)   │
└─────────────────┘     └──────────────────┘
```

## 2. Technology & Tools

### Languages & Frameworks
- **Frontend**: TypeScript 5.0+, React 18.2+
- **Build Tool**: Vite (Bolt.new default)
- **Package Manager**: npm

### Libraries & Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "zustand": "^4.4.0",
    "qr-scanner": "^1.4.2",
    "@algorand/algosdk": "^2.7.0",
    "elevenlabs": "^0.2.0",
    "idb": "^8.0.0",
    "framer-motion": "^10.16.0",
    "react-use": "^17.4.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/node": "^20.0.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0"
  }
}
```

### Database & Storage
- **IndexedDB**: Media assets, story content cache
- **LocalStorage**: User preferences, progress tracking
- **SessionStorage**: Temporary scan results

### DevOps & Hosting
- **Development**: Bolt.new environment
- **Deployment**: Netlify (via Deploy Challenge)
- **CDN**: Cloudflare for media assets
- **Domain**: IONOS (via Custom Domain Challenge)

### CI/CD Pipeline
- GitHub Actions for automated testing
- Netlify auto-deploy on main branch
- Preview deployments for PRs

## 3. Project Structure

### Folder Organization
```
curmunchkins-mystery-box/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Scanner/
│   │   ├── StoryViewer/
│   │   ├── VoiceControls/
│   │   └── AccessibilityPanel/
│   ├── features/           # Feature-specific modules
│   │   ├── scanning/
│   │   ├── storytelling/
│   │   ├── voice/
│   │   └── blockchain/
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── services/           # API integrations
│   │   ├── elevenlabs/
│   │   ├── algorand/
│   │   └── storage/
│   ├── stores/             # Zustand state stores
│   ├── types/              # TypeScript definitions
│   ├── styles/             # Global styles & themes
│   └── assets/             # Static assets
├── public/
│   ├── stories/            # Story content JSON
│   └── audio/              # Pre-cached audio
├── tests/
└── config/
```

### Naming Conventions
- **Components**: PascalCase (e.g., `StoryViewer.tsx`)
- **Utilities**: camelCase (e.g., `scanQRCode.ts`)
- **Types**: PascalCase with `T` prefix (e.g., `TStoryContent`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_SCAN_ATTEMPTS`)

### Key Modules
- **Scanner Module**: Camera access, QR detection, fallback input
- **Story Engine**: Content loading, branching logic, progress tracking
- **Voice Module**: ElevenLabs integration, speech synthesis/recognition
- **Blockchain Module**: Wallet management, NFT minting, metadata
- **Accessibility Module**: Settings management, UI adaptations

## 4. Feature Specification

### 4.1 QR Code Scanning & Story Unlock
**User Story & Requirements**: 
- Child scans physical attachment to unlock personalized story content
- Immediate visual/audio feedback on successful scan
- Fallback manual code entry for accessibility

**Implementation Details**:
```typescript
// Scanner component structure
interface ScannerState {
  isScanning: boolean;
  lastScannedCode: string | null;
  error: ScanError | null;
}

// Scan flow
1. Request camera permission
2. Initialize QR Scanner with constraints
3. Process detected codes against whitelist
4. Trigger story unlock on valid code
5. Provide haptic/audio feedback
```

**Edge Cases & Error Handling**:
- Camera permission denied → Show manual entry
- Invalid QR code → Gentle error message
- Duplicate scan → Show "already unlocked" state
- Poor lighting → Brightness adjustment tips

**UI/UX Considerations**:
- Large viewfinder with corner guides
- High contrast scanning overlay
- Progress indicator during processing
- Success animation with sensory-appropriate effects

### 4.2 Voice-Guided Story Experience
**User Story & Requirements**:
- AI voice narrates story with character personality
- Interactive prompts for child engagement
- Adjustable voice parameters for sensory needs

**Implementation Details**:
```typescript
interface VoiceSettings {
  speed: number; // 0.5 - 2.0
  pitch: number; // 0.5 - 2.0
  volume: number; // 0 - 1
  character: MunchieVoice;
}

// Voice synthesis flow
1. Load character voice model
2. Chunk text for natural pacing
3. Generate audio with emotion markers
4. Handle interactive prompts
5. Process speech recognition
```

**Edge Cases & Error Handling**:
- API rate limits → Queue and retry
- Network interruption → Cache audio segments
- Speech recognition failure → Multiple attempts with visual fallback
- Background noise → Noise cancellation tips

### 4.3 Sensory-Informed Story Adaptation
**User Story & Requirements**:
- Stories adapt based on scanned attachment type
- Content demonstrates therapeutic use of tools
- Maintains character consistency across branches

**Implementation Details**:
```typescript
interface StoryNode {
  id: string;
  attachmentType: AttachmentType;
  content: {
    text: string;
    voiceEmotion: EmotionType;
    visualCues: VisualCue[];
  };
  branches: StoryBranch[];
  sensoryStrategy: SensoryStrategy;
}

// Story adaptation logic
1. Identify attachment type from scan
2. Load corresponding story tree
3. Apply child's preferences
4. Track decision points
5. Maintain narrative coherence
```

### 4.4 Digital Collectible Creation
**User Story & Requirements**:
- Automatic NFT minting on story completion
- Simple wallet management for children
- Visible collection progress

**Implementation Details**:
```typescript
// Algorand integration
interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS hash
  properties: {
    munchieCharacter: string;
    attachmentType: string;
    rarity: RarityTier;
    unlockedDate: number;
  };
}

// Minting flow
1. Generate metadata on story completion
2. Upload assets to IPFS
3. Create Algorand transaction
4. Handle wallet connection/creation
5. Confirm and display NFT
```

## 5. Database Schema

### 5.1 IndexedDB Collections

**Stories Collection**
```typescript
interface StoryRecord {
  id: string; // attachment_character combination
  attachmentId: string;
  characterId: string;
  content: StoryContent;
  audioCache: AudioSegment[];
  lastModified: number;
}
```

**Progress Collection**
```typescript
interface ProgressRecord {
  userId: string;
  storyId: string;
  currentNodeId: string;
  completedNodes: string[];
  startedAt: number;
  completedAt?: number;
  decisions: DecisionRecord[];
}
```

**Assets Collection**
```typescript
interface AssetRecord {
  id: string;
  type: 'audio' | 'image' | 'animation';
  url: string;
  blob: Blob;
  metadata: AssetMetadata;
  cachedAt: number;
}
```

### 5.2 LocalStorage Schema
```typescript
interface UserPreferences {
  userId: string;
  accessibility: {
    voiceSpeed: number;
    visualContrast: 'normal' | 'high';
    reduceMotion: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
  selectedCharacter: string;
  unlockedStories: string[];
  nftWallet?: string;
}
```

## 6. Server Actions

### 6.1 External API Interactions

**ElevenLabs Voice API**
```typescript
class VoiceService {
  async synthesizeSpeech(params: {
    text: string;
    voiceId: string;
    emotion?: EmotionType;
    speed?: number;
  }): Promise<AudioBuffer>;

  async startSpeechRecognition(params: {
    expectedPhrases?: string[];
    timeout?: number;
  }): Promise<RecognitionResult>;
}
```

**Algorand Blockchain**
```typescript
class BlockchainService {
  async connectWallet(): Promise<WalletConnection>;
  
  async mintNFT(params: {
    metadata: NFTMetadata;
    recipientAddress: string;
  }): Promise<TransactionResult>;
  
  async checkBalance(address: string): Promise<Balance>;
}
```

### 6.2 Local Data Management
```typescript
class StorageService {
  // IndexedDB operations
  async cacheStory(story: StoryContent): Promise<void>;
  async getCachedStory(storyId: string): Promise<StoryContent | null>;
  
  // Progress tracking
  async saveProgress(progress: ProgressRecord): Promise<void>;
  async loadProgress(userId: string, storyId: string): Promise<ProgressRecord | null>;
  
  // Asset management
  async cacheAsset(asset: AssetRecord): Promise<void>;
  async pruneOldAssets(maxAge: number): Promise<void>;
}
```

## 7. Design System

### 7.1 Visual Style

**Branding & Theme**
```css
:root {
  /* Primary Colors - Soft, calming palette */
  --color-primary: #7C3AED; /* Gentle purple */
  --color-secondary: #F59E0B; /* Warm amber */
  --color-tertiary: #10B981; /* Soft green */
  
  /* Sensory-Friendly Backgrounds */
  --bg-default: #FAFAF9;
  --bg-muted: #F3F4F6;
  
  /* Typography - Dyslexia-friendly */
  --font-primary: 'OpenDyslexic', 'Comic Sans MS', sans-serif;
  --font-reading: 'Lexend', 'Arial', sans-serif;
  
  /* Spacing - Generous for motor differences */
  --space-touch-target: 44px;
  --space-content: 24px;
}
```

**Accessibility Modes**
```typescript
interface ThemeMode {
  contrast: 'normal' | 'high' | 'ultra-high';
  motion: 'full' | 'reduced' | 'none';
  colorScheme: 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia';
}
```

### 7.2 UI Components

**Scanner Component**
```typescript
interface ScannerProps {
  onScan: (code: string) => void;
  allowManualEntry?: boolean;
  visualFeedback?: 'minimal' | 'enhanced';
}
```

**Story Viewer Component**
```typescript
interface StoryViewerProps {
  story: StoryContent;
  voiceSettings: VoiceSettings;
  onInteraction: (action: InteractionType) => void;
  accessibilityMode: AccessibilityMode;
}
```

**Voice Control Panel**
```typescript
interface VoiceControlProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSpeedChange: (speed: number) => void;
  onRepeat: () => void;
  showVisualizer?: boolean;
}
```

## 8. Component Architecture

### 8.1 State Management (Zustand)

**App Store**
```typescript
interface AppStore {
  // User state
  user: UserState;
  preferences: UserPreferences;
  
  // Scanning state
  scanningState: ScanningState;
  startScanning: () => void;
  processScan: (code: string) => Promise<void>;
  
  // Story state
  currentStory: StoryState | null;
  storyProgress: Map<string, ProgressRecord>;
  loadStory: (storyId: string) => Promise<void>;
  
  // Voice state
  voiceState: VoiceState;
  updateVoiceSettings: (settings: Partial<VoiceSettings>) => void;
  
  // Blockchain state
  wallet: WalletState | null;
  nftCollection: NFTRecord[];
  mintNFT: (storyId: string) => Promise<void>;
}
```

### 8.2 Component Hierarchy
```
App
├── Layout
│   ├── Header (minimal, child-friendly)
│   ├── MainContent
│   └── AccessibilityControls (floating)
├── Routes
│   ├── Home
│   │   ├── CharacterSelector
│   │   └── StartButton
│   ├── Scanner
│   │   ├── CameraView
│   │   ├── ManualEntry
│   │   └── ScanFeedback
│   ├── Story
│   │   ├── StoryViewer
│   │   ├── VoiceControls
│   │   └── InteractionPrompts
│   └── Collection
│       ├── NFTGallery
│       └── ProgressTracker
└── Providers
    ├── AccessibilityProvider
    ├── VoiceProvider
    └── BlockchainProvider
```

## 9. Authentication & Authorization

### Method
- **Local-First**: No traditional auth required for MVP
- **Device ID**: Generated UUID stored in localStorage
- **Parent Access**: Optional PIN for settings access

### Implementation
```typescript
interface AuthState {
  deviceId: string;
  parentPIN?: string;
  isParentMode: boolean;
  
  generateDeviceId(): string;
  setParentPIN(pin: string): void;
  verifyParentPIN(pin: string): boolean;
}
```

## 10. Data Flow

### Scanning to Story Flow
```
1. Child opens scanner
2. Camera detects QR code
3. Code validated against whitelist
4. Story content loaded from cache/CDN
5. Voice model initialized
6. Story begins with character greeting
7. Progress saved to IndexedDB
8. NFT minted on completion (optional)
```

### State Synchronization
```typescript
// Optimistic updates with error recovery
const updateProgress = async (nodeId: string) => {
  // Update UI immediately
  setCurrentNode(nodeId);
  
  try {
    // Persist to storage
    await storageService.saveProgress({
      storyId: currentStory.id,
      nodeId,
      timestamp: Date.now()
    });
  } catch (error) {
    // Rollback on failure
    setCurrentNode(previousNode);
    showError('Progress save failed');
  }
};
```

## 11. Payment Integration

*Note: Initial MVP uses testnet only - no real payments*

### Future Considerations
- **RevenueCat Integration**: For premium story packs
- **Parent-controlled purchases**: PIN-protected
- **Subscription model**: Monthly unlimited stories

## 12. Analytics Integration

### Privacy-First Analytics
```typescript
interface AnalyticsEvent {
  event: 'story_started' | 'story_completed' | 'attachment_scanned';
  properties: {
    characterId?: string;
    attachmentType?: string;
    duration?: number;
  };
  // No personally identifiable information
}
```

### Implementation
- Local analytics only for MVP
- Aggregated, anonymized data for improvement
- Parent-controlled data sharing settings

## 13. Security & Compliance

### Data Protection
- **No personal data collection**: Only device ID and preferences
- **Local storage encryption**: Not required for non-sensitive data
- **COPPA Compliance**: No data collection from children

### API Security
```typescript
// API key management
const secureAPICall = async (endpoint: string, data: any) => {
  const encryptedKey = await getEncryptedAPIKey();
  
  return fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${encryptedKey}`,
      'X-Child-Safe': 'true'
    },
    body: JSON.stringify(data)
  });
};
```

## 14. Environment Configuration & Deployment

### Environment Variables
```env
# Development
VITE_ELEVENLABS_API_KEY=dev_key_here
VITE_ALGORAND_NETWORK=testnet
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/

# Production  
VITE_ELEVENLABS_API_KEY=prod_key_here
VITE_ALGORAND_NETWORK=testnet # Still testnet for hackathon
VITE_IPFS_GATEWAY=https://cloudflare-ipfs.com/ipfs/
```

### Build Configuration
```javascript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'voice': ['elevenlabs'],
          'blockchain': ['@algorand/algosdk'],
          'scanner': ['qr-scanner']
        }
      }
    }
  }
});
```

### Deployment Script
```yaml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

## 15. Testing

### Unit Testing Strategy
```typescript
// Component testing example
describe('Scanner Component', () => {
  it('should request camera permissions on mount', async () => {
    const { getByText } = render(<Scanner />);
    await waitFor(() => {
      expect(navigator.mediaDevices.getUserMedia).toHaveBeenCalled();
    });
  });
  
  it('should show manual entry on permission denial', async () => {
    mockGetUserMedia.mockRejectedValue(new Error('Permission denied'));
    const { getByPlaceholderText } = render(<Scanner />);
    await waitFor(() => {
      expect(getByPlaceholderText('Enter code')).toBeInTheDocument();
    });
  });
});
```

### Accessibility Testing
```typescript
// Automated accessibility checks
describe('Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should support keyboard navigation', async () => {
    const { getByRole } = render(<StoryViewer />);
    userEvent.tab();
    expect(getByRole('button', { name: 'Play' })).toHaveFocus();
  });
});
```

### Neurodivergent User Testing Plan
1. **Recruitment**: Partner with local autism/ADHD support groups
2. **Testing Sessions**: 
   - 15-minute sessions with breaks
   - Parent/therapist present
   - Multiple sensory environment options
3. **Metrics**:
   - Task completion rate
   - Sensory comfort feedback
   - Engagement duration
   - Parent satisfaction

---

## Summary & Next Steps

### Key Design Decisions
1. **Local-first architecture** for privacy and performance
2. **Progressive enhancement** - core features work offline
3. **Accessibility as default** - not an afterthought
4. **Modular voice/blockchain** - can disable if needed

### Open Questions
1. Story content creation - need writer/therapist collaboration
2. Character voice training - requires voice actor recordings
3. Physical toy QR codes - coordinate with manufacturing
4. Beta testing logistics - IRB approval for child participants?

### Future Enhancements
1. **Multiplayer stories** - collaborative narrative experiences
2. **Therapist portal** - progress tracking and customization
3. **Story builder** - let parents create custom narratives
4. **Wearable integration** - heart rate for emotion detection

### Implementation Priority
1. ✅ Basic scanner and story viewer
2. ✅ Voice narration with controls  
3. ✅ Accessibility settings
4. ⏱️ Blockchain integration (testnet)
5. ⏱️ Parent controls
6. 🔮 Analytics and optimization

This specification provides a comprehensive blueprint for building the Curmunchkins Mystery Box Explorer on Bolt.new, with a strong focus on accessibility, neurodivergent-friendly design, and technical feasibility within hackathon constraints.