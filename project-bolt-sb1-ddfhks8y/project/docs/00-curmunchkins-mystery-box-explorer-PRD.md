# Curmunchkins Mystery Box Explorer - Product Requirements Document

## 1. Title and Overview

### 1.1 Document Title & Version
Curmunchkins Mystery Box Explorer v1.0 - Hackathon Prototype

### 1.2 Product Summary
The Curmunchkins Mystery Box Explorer is an innovative phygital (physical + digital) storytelling application that bridges tangible sensory toys with personalized narrative experiences for neurodivergent children aged 4-12. Children scan physical Curmunchkin attachments or QR codes to unlock tailored story segments where their chosen Munchie character discovers and learns to use sensory tools in meaningful contexts. The app combines Voice AI narration, interactive prompts, and optional blockchain collectible mechanics to create an engaging, therapeutic, and collectible storytelling ecosystem.

## 2. User Personas

### 2.1 Key User Types
**Primary Users:**
- Neurodivergent children (ages 4-12) seeking sensory regulation and emotional learning tools
- Parents/caregivers managing sensory needs and seeking engaging therapeutic content

**Secondary Users:**
- Collectors interested in digital asset ownership of story content
- Educators and therapists incorporating sensory stories into interventions

### 2.2 Basic Persona Details

**Primary Persona: Alex**
- Age: 7, autism spectrum, enjoys patterns and collecting
- Needs: Predictable story structure, sensory regulation tools, positive representation
- Goals: Learn coping strategies, feel understood, enjoy interactive storytelling
- Challenges: Sensory overwhelm, difficulty with transitions, need for routine

**Parent Persona: Jamie**
- Age: 35, parent of neurodivergent child
- Needs: Evidence-based sensory tools, progress tracking, affordable solutions
- Goals: Support child's regulation, find engaging therapeutic content
- Challenges: Limited time, budget constraints, finding quality resources

### 2.3 Role-based Access
- **Child User**: Scan toys, interact with stories, voice commands, progress saving
- **Parent User**: Story history, settings customization, purchase management
- **Collector User**: NFT viewing, rarity tracking, trade functionality (future)

## 3. User Stories

### Core Functionality Stories

**US-001: Mystery Box Discovery**
- ID: US-001
- Title: Physical Toy Scanning and Story Unlock
- Description: As a child user, I want to scan my new Curmunchkin attachment so that I can unlock a personalized story about my Munchie using that tool.
- Acceptance Criteria:
  - Camera successfully detects QR codes or attachment images
  - Scanning triggers immediate visual/audio feedback
  - Story unlocks within 3 seconds of successful scan
  - Works with all planned physical attachments (fidget feet, weighted arms, bouncy braids)
  - Provides clear visual confirmation of successful unlock

**US-002: Voice-Guided Story Experience**
- ID: US-002  
- Title: Interactive Voice AI Narration
- Description: As a child user, I want my Munchie character to talk to me and guide me through the story so that I feel personally connected to the experience.
- Acceptance Criteria:
  - Voice AI narrates story with character-appropriate personality
  - Interactive prompts ask child to speak magic words or responses
  - Voice recognition responds appropriately to simple commands
  - Option to repeat story segments upon request
  - Adjustable speech speed and volume for sensory needs

**US-003: Sensory-Informed Story Adaptation**
- ID: US-003
- Title: Attachment-Based Story Branching  
- Description: As a child user, I want the story to change based on which attachment I scan so that each tool feels meaningful and special.
- Acceptance Criteria:
  - Each attachment triggers unique story content
  - Stories demonstrate practical use of the sensory tool
  - Munchie character models appropriate regulation strategies
  - Content aligns with evidence-based sensory integration principles
  - Story maintains coherent character development across branches

**US-004: Digital Collectible Creation**
- ID: US-004
- Title: Blockchain Asset Generation
- Description: As a collector user, I want to receive a digital collectible when I unlock new story content so that I can track my collection and prove ownership.
- Acceptance Criteria:
  - Successful story unlock mints corresponding NFT/token
  - Digital asset includes story metadata and rarity information
  - Ownership is verifiably linked to wallet address
  - Collection progress visible in user interface
  - Assets are transferable between compatible wallets

### Parent/Caregiver Stories

**US-005: Progress Monitoring**
- ID: US-005
- Title: Story History and Development Tracking
- Description: As a parent, I want to see which stories my child has experienced so that I can understand their sensory preferences and therapeutic progress.
- Acceptance Criteria:
  - Dashboard shows unlocked stories and completion rates
  - Tracks which attachments/tools child engages with most
  - Provides insights on emotional regulation themes
  - Exportable summary for sharing with therapists
  - Privacy controls for data sharing

**US-006: Accessibility Customization**
- ID: US-006
- Title: Sensory-Friendly Settings Configuration
- Description: As a parent, I want to customize the app's sensory elements so that it accommodates my child's specific sensitivities and preferences.
- Acceptance Criteria:
  - Adjustable audio volume, pitch, and speech rate
  - Visual contrast and brightness controls
  - Option to disable animations or reduce motion
  - Simplified interface mode for cognitive accessibility
  - Settings persist across sessions

## 4. Technical Requirements

### 4.1 Core Technology Stack
- **Platform**: Bolt.new web application
- **Voice AI**: ElevenLabs integration for character voices and speech recognition
- **Blockchain**: Algorand for lightweight NFT minting and ownership
- **Camera/Scanning**: WebRTC camera API with QR code detection library
- **Storage**: Browser localStorage for story progress, IndexedDB for media assets

### 4.2 Scanning Technology Requirements
- QR code detection using modern web APIs
- Image recognition for attachment visual identification
- Fallback manual code entry for accessibility
- Offline scanning capability with queue sync
- Multiple attachment scanning in single session

### 4.3 Voice AI Integration Requirements
- Character-specific voice synthesis with ElevenLabs
- Real-time speech recognition for interactive prompts
- Multilingual support preparation (English primary)
- Emotion-aware voice modulation for story context
- Accessibility features for hearing differences

### 4.4 Blockchain Implementation Requirements
- Simple NFT minting on Algorand testnet
- Wallet connection (optional, defaults to app-managed wallet)
- Metadata storage linking physical toys to digital assets
- Gas-efficient smart contract for collectible logic
- Future-ready for marketplace integration

## 5. Development Documentation for AI Agent

### 5.1 Architecture Overview

```
[Physical Toy/QR Code] → [Camera Scan] → [Story Unlock Logic] → [Voice AI Narration] → [Blockchain Mint] → [Progress Save]
```

### 5.2 Core Implementation Modules

#### Module 1: Scanner Component
```javascript
// QR/Camera scanning with real-time detection
// Libraries: qr-scanner, html5-qrcode
// Features: Auto-focus, multiple format support, error handling
// Integration: Trigger story unlock on successful scan
```

#### Module 2: Story Engine
```javascript
// Dynamic story content based on scanned attachment
// Data structure: JSON story trees with branching logic
// Character integration: Munchie personality consistency
// Sensory considerations: Pacing, language complexity
```

#### Module 3: Voice AI Controller
```javascript
// ElevenLabs API integration for character voices
// Speech synthesis: Character-specific voice models
// Speech recognition: Simple command detection
// Accessibility: Speed controls, repeat functionality
```

#### Module 4: Blockchain Manager
```javascript
// Algorand SDK integration for NFT operations
// Wallet management: Connect/create wallet functions
// Metadata handling: Link physical toys to digital assets
// Transaction management: Error handling, retry logic
```

### 5.3 Neurodivergent-Centered Design Implementation

#### Sensory Processing Considerations
- **Visual**: High contrast options, reduced motion settings
- **Auditory**: Volume controls, frequency filtering for sensitivity
- **Tactile**: Haptic feedback options for supported devices
- **Cognitive**: Simplified UI modes, clear navigation

#### Evidence-Based Story Content
- Stories must model effective sensory regulation strategies
- Character responses validate emotional experiences
- Tools demonstrated in realistic, helpful contexts
- Positive neurodivergent representation throughout

### 5.4 Data Models

#### Story Content Schema
```json
{
  "attachmentId": "fidget_feet_001",
  "munchieCharacter": "silo",
  "storySegments": [
    {
      "id": "segment_001",
      "text": "Silo discovers the fidget feet...",
      "voicePrompts": ["Say 'magic feet' to continue!"],
      "sensoryFocus": "proprioceptive_input",
      "regulationStrategy": "movement_for_calm"
    }
  ],
  "nftMetadata": {
    "name": "Silo's Fidget Feet Adventure",
    "rarity": "common",
    "traits": ["sensory_tool", "autism_friendly"]
  }
}
```

#### User Progress Schema
```json
{
  "userId": "user_123",
  "unlockedStories": ["fidget_feet_001", "weighted_arms_002"],
  "preferences": {
    "voiceSpeed": 0.8,
    "visualContrast": "high",
    "preferredMunchie": "silo"
  },
  "collectibles": ["nft_token_123", "nft_token_456"]
}
```

### 5.5 API Integration Requirements

#### ElevenLabs Voice AI
```javascript
// Character voice generation
POST /v1/text-to-speech
// Real-time speech recognition  
WS /v1/speech-recognition
// Voice cloning for Munchie personalities
POST /v1/voice-cloning
```

#### Algorand Blockchain
```javascript
// NFT minting for story collectibles
algosdk.makeAssetCreateTxn()
// Wallet connection management
WalletConnect.createSession()
// Metadata storage on IPFS
ipfs.add(metadataJSON)
```

### 5.6 Accessibility Implementation Guide

#### Screen Reader Support
- Semantic HTML structure with proper ARIA labels
- Alt text for all visual story elements
- Keyboard navigation for all interactive elements

#### Motor Accessibility
- Large touch targets (minimum 44px)
- Alternative input methods for scanning
- Voice commands as primary interaction method

#### Cognitive Accessibility
- Consistent navigation patterns
- Clear visual hierarchy
- Predictable interaction flows
- Option to save and resume stories

### 5.7 Safety and Privacy Considerations

#### Child Safety
- No personal data collection beyond story progress
- Local storage preferred over cloud services
- Clear parent controls for all features
- COPPA-compliant data handling

#### Content Safety
- All story content reviewed for therapeutic appropriateness
- Positive neurodivergent representation guidelines
- No challenging or distressing sensory descriptions
- Crisis support resources available

### 5.8 Testing Requirements

#### Neurodivergent User Testing
- Test with children across autism, ADHD, and sensory processing differences
- Validate story content with occupational therapists
- Ensure accessibility features meet real user needs
- Gather parent feedback on therapeutic value

#### Technical Testing
- Cross-browser compatibility for camera scanning
- Voice AI accuracy across different speech patterns
- Blockchain transaction reliability
- Performance optimization for lower-end devices

This comprehensive framework ensures the Curmunchkins Mystery Box Explorer serves its primary mission: providing meaningful, therapeutic, and joyful storytelling experiences that celebrate and support neurodivergent children's unique needs and strengths.