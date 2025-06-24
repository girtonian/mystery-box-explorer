# Curmunchkins Mystery Box Explorer

A revolutionary phygital storytelling application designed specifically for neurodivergent children aged 4-12. This application bridges tangible sensory toys with personalized digital narratives, combining Voice AI narration, interactive prompts, and blockchain collectibles to create therapeutic and joyful storytelling experiences.

## 🌟 Mission

To provide meaningful, therapeutic, and joyful storytelling experiences that celebrate and support neurodivergent children's unique needs and strengths.

## ✨ Features

- **Physical Toy Scanning**: QR code detection to unlock personalized stories
- **Voice AI Narration**: Character-specific voices with ElevenLabs integration
- **Sensory-Friendly Design**: Customizable accessibility settings for different needs
- **Interactive Storytelling**: Voice prompts and child engagement
- **Digital Collectibles**: Algorand blockchain NFTs for story completion
- **Parent Controls**: Progress tracking and safety settings
- **Offline-First**: Local storage for privacy and performance

## 🎯 Target Users

### Primary Users
- Neurodivergent children (ages 4-12) seeking sensory regulation tools
- Parents/caregivers managing sensory needs

### Secondary Users
- Collectors interested in digital asset ownership
- Educators and therapists incorporating sensory stories

## 🏗️ Technical Stack

- **Platform**: Bolt.new web application
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Zustand
- **Voice AI**: ElevenLabs API
- **Blockchain**: Algorand SDK
- **Camera/Scanning**: WebRTC + qr-scanner
- **Storage**: IndexedDB + localStorage
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with camera support

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

4. Add your API keys to `.env`:
   - ElevenLabs API key for voice features
   - Configure Algorand network settings

5. Start development server:
   ```bash
   npm run dev
   ```

## 🎨 Design Principles

### Neurodivergent-First Design
- Sensory processing differences considered first
- Design for the edges - solutions that work for autistic, ADHD, dyslexic children
- Validate emotional experiences, never frame traits as problems

### Accessibility Non-Negotiable
- Minimum 44px touch targets
- High contrast options and reduced motion settings
- Voice-first interactions with keyboard fallbacks
- Semantic HTML with proper ARIA labels
- Clear, literal language avoiding idioms

### Sensory-Friendly Implementation
- Adjustable audio: volume, pitch, speed controls
- Visual customization: contrast, brightness, animation toggles
- Predictable interactions with consistent patterns
- Gentle transitions and non-jarring interface changes

## 🔒 Privacy & Safety

- **COPPA Compliant**: No personal data collection beyond story progress
- **Local-First**: Data stored locally with optional cloud sync
- **Child Safety**: Parent controls for all features
- **Content Safety**: Therapeutic appropriateness review for all stories

## 🧪 Testing

Run tests with:
```bash
npm test
```

Includes:
- Unit tests for components
- Accessibility testing with axe-core
- Cross-browser compatibility tests
- Performance optimization tests

## 📱 Deployment

Built for deployment on:
- Netlify (primary)
- Vercel
- Any static hosting service

Build for production:
```bash
npm run build
```

## 🤝 Contributing

This project prioritizes neurodivergent-friendly development practices:

1. Clear, descriptive commit messages
2. Comprehensive documentation
3. Accessibility-first development
4. Child safety considerations in all features

## 📄 License

This project is developed for the Bolt.new hackathon and follows all platform requirements.

## 🏆 Hackathon Compliance

- **Built on Bolt.new**: Primary development platform
- **Voice AI Challenge**: ElevenLabs integration
- **Blockchain Challenge**: Algorand NFT system
- **Meaningful Innovation**: Therapeutic technology for neurodivergent children

---

**Built with ❤️ for neurodivergent children and their families**