# 🚀 Getting Started Guide

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

## Installation

```bash
# Clone the repository
git clone https://github.com/horizontes-acusticos/archivo.git
cd archivo

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Project Setup

### Environment Configuration

The application uses remote CSV files hosted on DigitalOcean Spaces. URLs are configured in:

```typescript
// src/app/page.tsx
const CSV_URLS = {
  autumn: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01.csv",
  winter: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s02.csv", 
  spring: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s03.csv",
  summer: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s04.csv"
}
```

### CSV Data Format

Each CSV file should have the following columns:

```csv
id,place,date,filename,lenght,link,isAvalable
001,Location Name,2024-01-15,audio_file.mp3,00:03:45,/path/to/file.mp3,TRUE
```

**Column Descriptions:**
- `id`: Unique identifier for the track
- `place`: Recording location
- `date`: Recording date
- `filename`: Display name for the track
- `lenght`: Duration of the track (note: typo in CSV header is preserved)
- `link`: Relative path to audio file
- `isAvalable`: Availability flag (TRUE/FALSE)

## Development Workflow

### Adding New Features

1. **Component Changes**: Modify existing components in `src/components/`
2. **State Management**: Update `AudioContext.tsx` for global state changes
3. **Styling**: Use Tailwind CSS classes for styling
4. **Testing**: Test across different devices and screen sizes

### Code Structure Guidelines

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main page component
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── AudioDataTable.tsx # Track table
│   ├── HowlerAudioPlayer.tsx # Audio player
│   └── ui/               # UI component library
├── context/              # React context providers
│   └── AudioContext.tsx  # Global audio state
├── hooks/               # Custom React hooks
│   └── useCsvAudioData.ts # CSV data fetching
└── lib/                # Utility functions
    └── utils.ts        # Helper functions
```

### Styling System

The project uses:
- **Tailwind CSS** for utility-first styling
- **Shadcn/ui** for pre-built components
- **Responsive design** with mobile-first approach

### State Management Pattern

```typescript
// Global state (AudioContext)
const { currentTrack, setCurrentTrack, playNext, playPrevious } = useAudio()

// Local component state
const [activeTab, setActiveTab] = useState('autumn')

// Derived state
const isPlaying = currentTrack?.id === track.id
```

## Deployment

### Build Process

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Static Export (Optional)

```bash
# Generate static files
npm run build
npm run export
```

The app can be deployed to:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Static hosting** (with export)
- **Docker containers**

### Environment Variables

For production deployment, set:

```bash
# .env.local
NEXT_PUBLIC_BASE_AUDIO_URL=https://your-cdn-domain.com/audio
```

## Troubleshooting

### Common Issues

**1. CSV Loading Errors**
- Check network connectivity
- Verify CSV URLs are accessible
- Ensure CORS headers are properly configured

**2. Audio Playback Issues**
- Verify audio file formats (MP3 recommended)
- Check browser audio permissions
- Test with different browsers

**3. Mobile Touch Issues**
- Ensure touch events are properly prevented
- Test on actual mobile devices
- Check viewport meta tag

### Performance Optimization

**1. Large Datasets**
- Implement virtual scrolling for large track lists
- Add pagination controls
- Consider lazy loading for audio files

**2. Network Optimization**
- Implement CSV caching
- Use CDN for audio files
- Add loading skeletons

**3. Memory Management**
- Properly cleanup Howl instances
- Remove event listeners on unmount
- Monitor memory usage in DevTools

## Browser Support

**Supported Browsers:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Features Used:**
- ES2020 features
- Web Audio API (via Howler.js)
- CSS Grid and Flexbox
- Touch events

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Create Pull Request

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for code formatting
- Write meaningful commit messages

### Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run both quality checks
npm run lint && npm run type-check
```
