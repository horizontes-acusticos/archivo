declare module 'react-audio-spectrogram-player' {
  interface SpectrogramPlayerProps {
    audioUrl: string
    annotations?: Array<{
      start: number
      end: number
      label: string
      color: string
    }>
    autoPlay?: boolean
    onPlay?: () => void
    onPause?: () => void
  }

  const SpectrogramPlayer: React.ComponentType<SpectrogramPlayerProps>
  export default SpectrogramPlayer
}
