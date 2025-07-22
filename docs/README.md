# 📚 Documentation Index

Welcome to the Archivo Horizontes Acústicos documentation. This project is a Next.js-based audio archive application with tab-based navigation and seamless audio playback.

## 📖 Documentation Files

### 🏗️ [Architecture Overview](./ARCHITECTURE.md)
Comprehensive overview of the application architecture, component relationships, and design decisions.

**Topics Covered:**
- System architecture diagram
- Component responsibilities  
- Data flow patterns
- Visual selection logic
- Performance optimizations
- User experience features

### 💻 [Code Structure Guide](./CODE_GUIDE.md)
Deep dive into the implementation details, code patterns, and development approaches.

**Topics Covered:**
- Component implementations
- State management patterns
- Data processing logic
- Performance optimizations
- Development best practices

### 🚀 [Getting Started](./GETTING_STARTED.md)
Step-by-step guide to set up, develop, and deploy the application.

**Topics Covered:**
- Installation instructions
- Development workflow
- Project structure
- Deployment options
- Troubleshooting guide

### 📋 [API Reference](./API_REFERENCE.md)
Complete reference for all components, hooks, and interfaces in the application.

**Topics Covered:**
- AudioContext API
- Component props and methods
- Hook interfaces
- Data formats
- Error handling

## 🎯 Quick Navigation

### For Developers
- **New to the project?** Start with [Getting Started](./GETTING_STARTED.md)
- **Understanding the codebase?** Read [Architecture Overview](./ARCHITECTURE.md)
- **Looking up APIs?** Check [API Reference](./API_REFERENCE.md)
- **Implementation details?** See [Code Structure Guide](./CODE_GUIDE.md)

### For Maintainers
- **Deployment issues?** See [Getting Started - Deployment](./GETTING_STARTED.md#deployment)
- **Performance problems?** Check [Architecture - Performance](./ARCHITECTURE.md#-performance-optimizations)
- **Adding features?** Review [Code Guide - Development Patterns](./CODE_GUIDE.md#-development-patterns)

### For Contributors
- **Code style?** See [Getting Started - Contributing](./GETTING_STARTED.md#contributing)
- **Understanding state flow?** Read [Code Guide - Data Flow](./CODE_GUIDE.md#-data-flow-implementation)
- **Component structure?** Check [Architecture - Component Architecture](./ARCHITECTURE.md#-component-architecture)

## 🔑 Key Concepts

### Audio Selection System
The application uses a unique **ID-based selection system** that ensures:
- Only one track appears selected across all tabs
- Audio continues playing when switching tabs
- Simple, bulletproof cross-tab logic

### Global Playlist Strategy
All tracks from all seasons are loaded into a single global playlist, enabling:
- Seamless navigation between seasons
- Efficient next/previous functionality
- Unified state management

### Component Architecture
Clean separation of concerns with:
- **AudioContext**: Global state management
- **AudioDataTable**: Track display and selection
- **HowlerAudioPlayer**: Audio playback controls
- **useCsvAudioData**: Data fetching and processing

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn/ui
- **Audio**: Howler.js
- **Data Processing**: Papa Parse (CSV)
- **State Management**: React Context
- **Deployment**: Vercel (recommended)

## 📊 Project Statistics

- **Components**: 5 main components
- **Hooks**: 1 custom hook
- **Context Providers**: 1 audio context
- **CSV Data Sources**: 4 seasonal files
- **Supported Devices**: Desktop, tablet, mobile
- **Browser Support**: Modern browsers (90%+ support)

## 🎵 Audio Features

- **Continuous Playback**: Audio never stops when switching tabs
- **Global Navigation**: Next/Previous works across all seasons
- **Visual Feedback**: Clear indication of currently playing track
- **Mobile Support**: Touch gestures and responsive controls
- **Format Support**: MP3, WAV, and other Howler.js supported formats

## 📱 Responsive Design

The application is fully responsive with:
- **Desktop**: Full-featured interface with mouse interactions
- **Tablet**: Optimized layouts for touch interactions  
- **Mobile**: Compact layouts with gesture support

## 🔧 Development Notes

### Code Quality
- Full TypeScript coverage
- ESLint configuration
- Component-based architecture
- Clear separation of concerns

### Performance
- Memoized filtering operations
- Conditional state updates
- Efficient re-rendering patterns
- Optimized touch event handling

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Touch target sizing

---

For specific questions or issues, please refer to the appropriate documentation section above or check the project's GitHub repository.
