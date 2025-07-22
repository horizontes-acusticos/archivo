# 📋 API Reference

## AudioContext API

### State Properties

#### `currentTrack: AudioTrack | null`
The currently selected/playing track across all tabs.

```typescript
interface AudioTrack {
  id: string           // Unique identifier
  place: string        // Recording location
  date: string         // Recording date  
  filename: string     // Display name
  length: string       // Track duration
  link: string         // Audio file URL
  isAvailable: string  // Availability flag
  season?: string      // Season/tab association
}
```

#### `playlist: AudioTrack[]`
Global array containing all tracks from all seasons.

#### `isPlaying: boolean`
Current playback status of the audio player.

### Actions

#### `setCurrentTrack(track: AudioTrack | null): void`
Set the currently playing track. Triggers audio loading and visual updates.

```typescript
// Example usage
const handleTrackSelect = (track: AudioTrack) => {
  setCurrentTrack(track)
}
```

#### `setPlaylist(tracks: AudioTrack[]): void`
Update the global playlist with new tracks.

```typescript
// Example usage
const allTracks = [...autumnTracks, ...winterTracks, ...springTracks, ...summerTracks]
setPlaylist(allTracks)
```

#### `playNext(): void`
Navigate to the next track in the global playlist. Wraps around to the first track after the last one.

#### `playPrevious(): void`
Navigate to the previous track in the global playlist. Wraps around to the last track before the first one.

#### `setIsPlaying(playing: boolean): void`
Update the playback status flag.

## useCsvAudioData Hook

### Function Signature
```typescript
function useCsvAudioData(csvUrl: string, season?: string): {
  tracks: AudioTrack[]
  loading: boolean
  error: string | null
}
```

### Parameters
- `csvUrl: string` - URL of the CSV file to fetch
- `season?: string` - Optional season identifier to tag tracks

### Return Value
- `tracks: AudioTrack[]` - Parsed track data
- `loading: boolean` - Loading state
- `error: string | null` - Error message if loading failed

### Example Usage
```typescript
const { tracks, loading, error } = useCsvAudioData(
  'https://example.com/tracks.csv', 
  'autumn'
)

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
return <TrackList tracks={tracks} />
```

## AudioDataTable Component

### Props Interface
```typescript
interface AudioDataTableProps {
  data: AudioTrack[]  // Array of tracks to display
}
```

### Features
- **Filtering**: Search across place, date, filename, and length
- **Sorting**: Click column headers to sort
- **Pagination**: 48 tracks per page
- **Selection**: Double-click or double-tap to play track
- **Visual Feedback**: Playing track highlighted in dark theme

### Event Handlers
- `onDoubleClick`: Select track for playback
- `onTouchStart`: Handle mobile double-tap gestures

## HowlerAudioPlayer Component

### Audio Controls
- **Play/Pause**: Toggle playback
- **Next/Previous**: Navigate between tracks
- **Seek**: Click progress bar to jump to position
- **Volume**: Adjust playback volume
- **Rewind/Fast Forward**: Jump ±5 seconds

### Player States
- **Loading**: Shows spinner while audio loads
- **Playing**: Dark play button, progress updating
- **Paused**: Light play button, progress static
- **Minimized**: Compact view with essential controls

### Mobile Optimizations
- Touch-friendly button sizes
- Vertical volume slider popup
- Minimized view for small screens
- Gesture prevention for double-tap

## CSV Data Format

### Required Columns
```csv
id,place,date,filename,lenght,link,isAvalable
```

### Column Specifications

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | string | Unique track identifier | "001", "track_123" |
| `place` | string | Recording location | "Central Park", "Studio A" |
| `date` | string | Recording date | "2024-01-15", "March 2024" |
| `filename` | string | Display name | "morning_birds.mp3" |
| `lenght` | string | Track duration | "00:03:45", "2:30" |
| `link` | string | Relative audio path | "/audio/file.mp3" |
| `isAvalable` | string | Availability flag | "TRUE", "FALSE" |

### Data Processing
1. **Fetch**: CSV downloaded from remote URL
2. **Parse**: Processed with Papa Parse library
3. **Filter**: Rows with missing `id` or `filename` removed
4. **Transform**: Columns mapped to `AudioTrack` interface
5. **Tag**: Season identifier added to each track

## Error Handling

### Loading States
```typescript
// Hook provides loading state
const { tracks, loading, error } = useCsvAudioData(csvUrl)

// Component handles all states
if (loading) return <LoadingIndicator />
if (error) return <ErrorMessage />
return <DataTable data={tracks} />
```

### Audio Errors
```typescript
// Howler.js error handlers
const howl = new Howl({
  src: [track.link],
  onloaderror: (id, error) => {
    console.error('Audio load error:', error)
    toast.error('Failed to load audio')
  },
  onplayerror: (id, error) => {
    console.error('Audio play error:', error) 
    toast.error('Failed to play audio')
  }
})
```

### Network Errors
- CSV fetch failures show error message
- Audio loading failures trigger toast notifications
- Graceful degradation for missing data

## Performance Considerations

### Optimization Strategies
1. **Memoization**: Expensive filtering operations cached
2. **Conditional Updates**: Playlist only updates when necessary
3. **Pagination**: Large datasets split into manageable pages
4. **Lazy Loading**: Audio files loaded on demand

### Memory Management
1. **Cleanup**: Howl instances properly disposed
2. **Event Listeners**: Removed on component unmount
3. **State Management**: Minimal global state footprint

### Network Optimization
1. **CSV Caching**: Consider implementing client-side cache
2. **CDN Usage**: Audio files served from CDN
3. **Preloading**: Next track could be preloaded (future enhancement)

## Browser Compatibility

### Required APIs
- **Fetch API**: For CSV downloads
- **Web Audio API**: Via Howler.js for audio playback
- **Touch Events**: For mobile gesture support
- **CSS Grid/Flexbox**: For responsive layouts

### Polyfills
No polyfills currently required for target browser versions (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+).
