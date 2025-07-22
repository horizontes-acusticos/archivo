# 🏗️ Archivo Horizontes Acústicos - Architecture Documentation

## Overview

This is a Next.js audio archive application that allows users to browse and play audio tracks organized by seasons (Autumn, Winter, Spring, Summer). The application features a clean, tab-based interface with a persistent audio player.

## 🎯 Core Features

- **Multi-season audio library** - Browse tracks organized by seasons
- **Seamless audio playback** - Audio continues when switching tabs
- **Visual track selection** - Selected track only highlights in its corresponding tab
- **Mobile-friendly** - Touch gestures and responsive design
- **Global navigation** - Next/Previous buttons work across all seasons

## 🏛️ Architecture Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Main Page     │───▶│  AudioContext    │◀───│ HowlerPlayer    │
│ Loads all CSVs  │    │ - currentTrack   │    │ Uses playNext/  │
│ Sets playlist   │    │ - playlist       │    │ playPrevious    │
└─────────────────┘    │ - playNext()     │    └─────────────────┘
                       │ - playPrevious() │              ▲
                       └──────────────────┘              │
                                 ▲                       │
                                 │                       │
                       ┌─────────────────┐               │
                       │ AudioDataTable  │───────────────┘
                       │ Simple ID check │
                       │ Double-click    │
                       └─────────────────┘
```

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Main page with tabs
│   ├── layout.tsx              # Root layout
│   └── globals.css             # Global styles
├── components/
│   ├── AudioDataTable.tsx      # Track listing table
│   ├── HowlerAudioPlayer.tsx   # Audio player component
│   ├── RealTimeDisplay.tsx     # Audio visualizer
│   └── ui/                     # Shadcn UI components
├── context/
│   └── AudioContext.tsx        # Global audio state
├── hooks/
│   └── useCsvAudioData.ts      # CSV data fetching
├── data/
│   └── audioData.ts           # Static data
└── lib/
    └── utils.ts               # Utility functions
```

## 🔧 Component Architecture

### 1. **Main Page (`page.tsx`)**
- **Purpose**: Entry point and tab management
- **Responsibilities**:
  - Load CSV data from all seasons
  - Manage active tab state
  - Populate global playlist
  - Render season-specific content

### 2. **AudioContext (`AudioContext.tsx`)**
- **Purpose**: Global audio state management
- **State**:
  - `currentTrack` - Currently playing track
  - `playlist` - All tracks from all seasons
  - `isPlaying` - Playback status
- **Functions**:
  - `setCurrentTrack()` - Set track to play
  - `playNext()` - Navigate to next track
  - `playPrevious()` - Navigate to previous track

### 3. **AudioDataTable (`AudioDataTable.tsx`)**
- **Purpose**: Display tracks in a table format
- **Features**:
  - Filtering and sorting
  - Pagination (48 tracks per page)
  - Visual selection based on `currentTrack.id`
  - Double-click/double-tap to play

### 4. **HowlerAudioPlayer (`HowlerAudioPlayer.tsx`)**
- **Purpose**: Audio playback interface
- **Features**:
  - Play/pause controls
  - Next/previous navigation
  - Volume control
  - Progress bar
  - Mobile-optimized layout

### 5. **useCsvAudioData Hook (`useCsvAudioData.ts`)**
- **Purpose**: Fetch and parse CSV data
- **Features**:
  - Async CSV loading
  - Data transformation
  - Season tagging
  - Loading and error states

## 🎵 Audio Playback Flow

### Track Selection Process:
1. User double-clicks a track in any tab
2. `AudioDataTable` calls `setCurrentTrack(track)`
3. `HowlerAudioPlayer` detects change and loads new audio
4. Visual selection updates only in the tab containing that track

### Navigation Process:
1. User clicks next/previous in audio player
2. `playNext()` or `playPrevious()` finds current track in global playlist
3. Sets the adjacent track as `currentTrack`
4. Audio player loads and plays new track
5. Visual selection updates across all tabs

## 🎨 Visual Selection Logic

The key innovation is the **simple ID-based selection**:

```typescript
// In AudioDataTable.tsx
const isPlaying = currentTrack?.id === track.id
```

This ensures:
- ✅ Only one track shows as "playing" across all tabs
- ✅ Selection appears in the correct tab
- ✅ No complex cross-tab state management needed

## 📊 Data Flow

### CSV Data Loading:
```
CSV URLs → useCsvAudioData → Parse with Papa Parse → Add season tags → Combine into global playlist
```

### Track Playback:
```
User interaction → setCurrentTrack → HowlerAudioPlayer → Audio playback → Visual feedback
```

### Cross-tab Navigation:
```
Next/Previous → Find in global playlist → Update currentTrack → All tabs re-render → Show selection in correct tab
```

## 🎯 Key Design Decisions

### 1. **Global Playlist Strategy**
- All tracks from all seasons loaded into one array
- Enables seamless navigation across seasons
- `season` property maintains tab association

### 2. **ID-based Selection**
- Simple track identification by unique ID
- Eliminates complex index-based logic
- Prevents cross-tab selection issues

### 3. **Minimal State Management**
- Only essential state in AudioContext
- Direct track object manipulation
- No redundant index tracking

### 4. **Component Separation**
- Each component has single responsibility
- Clear data flow boundaries
- Easy to test and maintain

## 🚀 Performance Optimizations

1. **Conditional Playlist Updates**: Only update when playlist is empty
2. **Memoized Filtering**: Table filtering uses React.useMemo
3. **Efficient Re-renders**: Minimal state changes trigger updates
4. **Lazy Loading**: CSV data loaded asynchronously
5. **Touch Optimization**: Proper touch event handling

## 🔄 State Management Philosophy

The application uses a **minimal, pragmatic** approach:

- **Global State**: Only what needs to be shared (current track, playlist)
- **Local State**: Component-specific UI state (active tab, filters)
- **Derived State**: Computed values (isPlaying status, visual selection)

## 🎪 User Experience Features

### Multi-device Support:
- **Desktop**: Mouse interactions, keyboard shortcuts
- **Mobile**: Touch gestures, optimized layouts
- **Tablet**: Hybrid interaction patterns

### Audio Experience:
- **Continuous Playback**: Audio never stops when switching tabs
- **Visual Feedback**: Clear indication of playing track
- **Intuitive Controls**: Standard audio player interface

### Data Presentation:
- **Filterable Tables**: Search across track metadata
- **Sortable Columns**: Organize by different criteria
- **Pagination**: Handle large datasets efficiently

This architecture provides a robust, maintainable foundation for the audio archive application while delivering an excellent user experience across all devices.
