import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface AudioTrack {
  id: string
  place: string
  date: string
  filename: string
  length: string
  link: string
  isAvailable: string
}

interface AudioContextType {
  currentTrack: AudioTrack | null
  setCurrentTrack: (track: AudioTrack | null) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void
  playNext: () => AudioTrack | null
  playPrevious: () => AudioTrack | null
  forcePlayTrack: (track: AudioTrack) => void
  shouldAutoPlay: boolean // Add this
  setShouldAutoPlay: (should: boolean) => void // Add this
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider')
  }
  return context
}

interface AudioProviderProps {
  children: ReactNode
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playlist, setPlaylist] = useState<AudioTrack[]>([])
  // Add a flag to indicate when a track should auto-play
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false)

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return null
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const nextIndex = currentIndex + 1
    
    if (nextIndex < playlist.length) {
      const nextTrack = playlist[nextIndex]
      setCurrentTrack(nextTrack)
      setIsPlaying(true)
      setShouldAutoPlay(true) // Trigger auto-play
      return nextTrack
    }
    
    return null
  }
  
  const playPrevious = () => {
    if (!currentTrack || playlist.length === 0) return null
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const previousIndex = currentIndex - 1
    
    if (previousIndex >= 0) {
      const previousTrack = playlist[previousIndex]
      setCurrentTrack(previousTrack)
      setIsPlaying(true)
      setShouldAutoPlay(true) // Trigger auto-play
      return previousTrack
    }
    
    return null
  }

  const forcePlayTrack = (track: AudioTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
    setShouldAutoPlay(true) // Trigger auto-play when user clicks play
  }

  return (
    <AudioContext.Provider value={{
      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying,
      playlist,
      setPlaylist,
      playNext,
      playPrevious,
      forcePlayTrack,
      shouldAutoPlay, // Add this to the context
      setShouldAutoPlay // Add this to allow the player to reset the flag
    }}>
      {children}
    </AudioContext.Provider>
  )
}
