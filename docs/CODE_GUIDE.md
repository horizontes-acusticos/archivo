# 💻 Code Structure & Implementation Guide

## 🎯 Component Deep Dive

### AudioContext.tsx - Global State Management

```typescript
interface AudioContextType {
  // Core audio state
  currentTrack: AudioTrack | null
  setCurrentTrack: (track: AudioTrack | null) => void
  
  // Global playlist (all seasons combined)
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void
  
  // Playback status
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  
  // Navigation functions
  playNext: () => void
  playPrevious: () => void
}
```

**Key Implementation Details:**

1. **Simple State Structure**: No complex nested state or reducers
2. **Direct Track Management**: `currentTrack` holds the actual track object
3. **Navigation Logic**: Find current track in playlist, move to adjacent track
4. **No Index Dependencies**: Eliminates index-based selection bugs

### page.tsx - Main Application Logic

```typescript
export default function Home() {
  // Tab management
  const [activeTab, setActiveTab] = useState<keyof typeof CSV_URLS>('autumn')
  
  // Load ALL seasons on mount
  const { tracks: autumnTracks, loading: autumnLoading } = useCsvAudioData(CSV_URLS.autumn, 'autumn')
  const { tracks: winterTracks, loading: winterLoading } = useCsvAudioData(CSV_URLS.winter, 'winter')
  const { tracks: springTracks, loading: springLoading } = useCsvAudioData(CSV_URLS.spring, 'spring')
  const { tracks: summerTracks, loading: summerLoading } = useCsvAudioData(CSV_URLS.summer, 'summer')
  
  // Combine and set global playlist
  React.useEffect(() => {
    const allTracks = [...autumnTracks, ...winterTracks, ...springTracks, ...summerTracks]
    if (allTracks.length > 0 && playlist.length === 0) {
      setPlaylist(allTracks)
    }
  }, [autumnTracks, winterTracks, springTracks, summerTracks, playlist.length, setPlaylist])
}
```

**Why This Works:**

1. **Eager Loading**: All CSV data loaded immediately for smooth navigation
2. **Single Source of Truth**: Global playlist contains all tracks
3. **Season Tagging**: Each track knows which season it belongs to
4. **Conditional Updates**: Playlist only updates when empty (performance)

### AudioDataTable.tsx - Track Display & Selection

```typescript
export function AudioDataTable({ data }: AudioDataTableProps) {
  const { currentTrack, setCurrentTrack } = useAudio()
  
  // Simple selection logic
  const isPlaying = currentTrack?.id === track.id
  
  // Direct track selection on double-click
  const handleRowDoubleClick = () => {
    setCurrentTrack(track)
  }
}
```

**Critical Design Choices:**

1. **ID-Based Selection**: `currentTrack?.id === track.id` - bulletproof cross-tab logic
2. **No Index Logic**: Eliminated all index-based selection complexity
3. **Direct API**: Simple `setCurrentTrack(track)` call
4. **Visual Clarity**: Playing track highlighted regardless of tab

### HowlerAudioPlayer.tsx - Audio Playback

```typescript
export const HowlerAudioPlayer: React.FC = () => {
  const { currentTrack, playNext, playPrevious } = useAudio()
  
  // Navigation uses context functions
  const handleNext = () => playNext()
  const handlePrevious = () => playPrevious()
  
  // Auto-advance on track end
  onend: () => {
    setIsPlaying(false)
    playNext() // Seamless progression
  }
}
```

**Audio Management Features:**

1. **Context Integration**: Uses `playNext`/`playPrevious` from context
2. **Auto-progression**: Automatically plays next track when current ends
3. **Cross-season Navigation**: Can move between any tracks in global playlist
4. **State Synchronization**: Playback state synced with visual selection

## 🔧 Data Flow Implementation

### CSV Loading & Processing

```typescript
// useCsvAudioData.ts
export function useCsvAudioData(csvUrl: string, season?: string) {
  useEffect(() => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        const mapped = (results.data as CsvRow[])
          .filter(row => row.id && row.filename)
          .map(row => ({
            id: row.id,
            place: row.place,
            date: row.date,
            filename: row.filename,
            length: row.lenght,
            link: BASE_URL + row.link,
            isAvailable: row.isAvalable ?? row.isAvailable ?? "TRUE",
            season: season, // 🎯 Critical: Tag each track with its season
          }))
        setTracks(mapped)
      }
    })
  }, [csvUrl, season])
}
```

**Processing Pipeline:**
1. **Fetch CSV** from remote URL
2. **Parse** with Papa Parse library
3. **Filter** valid rows (has id and filename)
4. **Transform** data structure
5. **Tag with season** for tab association
6. **Return** with loading/error states

### Selection State Management

```typescript
// Context implementation
const playNext = () => {
  if (!currentTrack || playlist.length === 0) return
  
  // Find current track in global playlist
  const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
  if (currentIndex === -1) return
  
  // Calculate next index (wrap around)
  const nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0
  setCurrentTrack(playlist[nextIndex])
}
```

**Navigation Logic:**
1. **Find Current**: Locate `currentTrack` in global `playlist`
2. **Calculate Next**: Move to adjacent track (with wraparound)
3. **Update State**: Set new `currentTrack`
4. **Trigger Re-render**: All components update automatically

## 🎨 Visual Selection Algorithm

### The Core Logic

```typescript
// In AudioDataTable component
{table.getRowModel().rows.map(row => {
  const track = row.original
  
  // 🎯 This is the magic line
  const isPlaying = currentTrack?.id === track.id
  
  // Apply visual styling
  const rowClassName = isPlaying
    ? "bg-slate-900 text-white hover:bg-slate-800"  // Playing style
    : "hover:bg-slate-50"                           // Normal style
})}
```

**Why This Works Perfectly:**

1. **Global Check**: `currentTrack` is global, so comparison works across all tabs
2. **Unique IDs**: Each track has unique ID, so only one match possible
3. **Automatic Updates**: When `currentTrack` changes, all tables re-render
4. **Tab Independence**: Each tab shows its own tracks, but selection is global

### Cross-Tab Behavior

```
┌─── Tab A (Autumn) ───┐    ┌─── Tab B (Winter) ───┐
│ Track 1              │    │ Track 50             │
│ Track 2 🎵 PLAYING   │    │ Track 51             │  
│ Track 3              │    │ Track 52             │
└──────────────────────┘    └──────────────────────┘

When user switches to Tab B:
┌─── Tab A (Autumn) ───┐    ┌─── Tab B (Winter) ───┐
│ Track 1              │    │ Track 50             │
│ Track 2              │    │ Track 51             │  
│ Track 3              │    │ Track 52             │
└──────────────────────┘    └──────────────────────┘
                            ☝️ No selection shown here
                            because currentTrack.id 
                            doesn't match any Winter tracks
```

## 🚀 Performance Optimizations

### Conditional Re-renders

```typescript
// Only update playlist when it's empty
React.useEffect(() => {
  const allTracks = [...autumnTracks, ...winterTracks, ...springTracks, ...summerTracks]
  if (allTracks.length > 0 && playlist.length === 0) { // 🎯 Key condition
    setPlaylist(allTracks)
  }
}, [autumnTracks, winterTracks, springTracks, summerTracks, playlist.length, setPlaylist])
```

### Memoized Filtering

```typescript
// Expensive filtering operations are memoized
const filteredData = React.useMemo(
  () =>
    availableData.filter(
      (track) =>
        (track.place?.toLowerCase() ?? "").includes(filter.toLowerCase()) ||
        (track.date?.toLowerCase() ?? "").includes(filter.toLowerCase()) ||
        (track.filename?.toLowerCase() ?? "").includes(filter.toLowerCase()) ||
        (track.length?.toLowerCase() ?? "").includes(filter.toLowerCase())
    ),
  [availableData, filter]
)
```

### Touch Event Optimization

```typescript
// Optimized touch handling for mobile
const handleTouchStart = (e: React.TouchEvent) => {
  e.preventDefault() // Prevent zoom
  touchCount++
  
  if (touchCount === 1) {
    touchTimeout = setTimeout(() => {
      touchCount = 0
    }, 300)
  } else if (touchCount === 2) {
    clearTimeout(touchTimeout)
    setCurrentTrack(track) // Double-tap to play
    touchCount = 0
  }
}
```

## 🛠️ Development Patterns

### Error Boundaries
- Each component handles its own loading/error states
- Graceful degradation when CSV loading fails
- User-friendly error messages

### Type Safety
- Strong TypeScript typing throughout
- Interface definitions for all data structures
- Compile-time error checking

### Component Composition
- Single responsibility principle
- Clear prop interfaces
- Minimal coupling between components

### State Management
- Context for truly global state
- Local state for component-specific needs
- No unnecessary state lifting

This implementation provides a solid foundation that's both performant and maintainable, while delivering the exact user experience requirements.
