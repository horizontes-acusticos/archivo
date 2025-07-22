# Archivo - Seasonal Audio Collection

A minimal but functional single-page application built with Next.js, shadcn/ui, react-audio-spectrogram-player, and Firebase App Hosting.

## Features

- **4 Seasonal Tabs**: Autumn, Winter, Spring, and Summer collections
- **Audio Tables**: Each tab displays 24 audio tracks in a clean table format
- **Persistent Audio Player**: Footer-based spectrogram player that persists across tab navigation
- **Responsive Design**: Built with Tailwind CSS and shadcn/ui components

## Tech Stack

- **Next.js** (with App Router)
- **Tailwind CSS** (via shadcn/ui)
- **react-audio-spectrogram-player** for audio visualization
- **Firebase Hosting** for deployment
- **TypeScript** for type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Firebase CLI (for deployment)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
```

This will create an optimized production build in the `out` directory.

### Firebase Deployment

1. Login to Firebase:
```bash
firebase login
```

2. Initialize Firebase project:
```bash
firebase init hosting
```

3. Deploy to Firebase:
```bash
npm run deploy
```

## Project Structure

```
src/
├── app/
│   ├── globals.css       # Global styles with CSS variables
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page with tabs
├── components/
│   ├── ui/               # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── tabs.tsx
│   │   └── table.tsx
│   ├── AudioTable.tsx    # Table component for audio tracks
│   └── AudioPlayer.tsx   # Footer spectrogram player
├── context/
│   └── AudioContext.tsx  # Global audio state management
├── data/
│   └── audioData.ts      # Mock audio track data
├── lib/
│   └── utils.ts          # Utility functions
└── types/
    └── react-audio-spectrogram-player.d.ts  # Type definitions
```

## Audio Data

The application uses dummy audio URLs as placeholders. In a production environment, you would replace these with actual audio files hosted on DigitalOcean Spaces or another CDN.

## Features in Detail

### Tab Navigation
- Four seasonal collections (Autumn, Winter, Spring, Summer)
- Smooth tab switching without losing audio player state
- Each collection contains 24 unique tracks

### Audio Player
- Fixed footer position for persistent playback
- Spectrogram visualization with color-coded annotations
- Play/pause functionality integrated with table controls
- Mock annotation data for demonstration

### Table Interface
- Clean, responsive table design
- Play/pause buttons for each track
- Visual indication of currently playing track
- Track metadata display (title, artist, duration)

## Customization

### Adding Real Audio Files

Replace the URLs in `src/data/audioData.ts` with your actual audio file URLs:

```typescript
const tracks = [{
  id: 'autumn-1',
  title: 'Your Track Title',
  artist: 'Artist Name',
  season: 'Autumn',
  url: 'https://your-cdn.com/audio/track.mp3',
  spectrogramUrl: 'https://your-cdn.com/spectrograms/track.json'
}]
```

### Styling

The application uses Tailwind CSS with custom CSS variables. Modify `src/app/globals.css` to change the color scheme.

## License

This project is open source and available under the [MIT License](LICENSE).
