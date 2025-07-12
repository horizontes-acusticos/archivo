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
  setCurrentTrack: (track: AudioTrack) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void
  playNext: () => AudioTrack | null
  forcePlayTrack: (track: AudioTrack) => void
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

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return null
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    const nextIndex = currentIndex + 1
    
    if (nextIndex < playlist.length) {
      const nextTrack = playlist[nextIndex]
      setCurrentTrack(nextTrack)
      setIsPlaying(true) // Auto set playing to true
      return nextTrack
    }
    
    return null
  }
  
  const forcePlayTrack = (track: AudioTrack) => {
    setCurrentTrack(track)
    setIsPlaying(true)
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
      forcePlayTrack
    }}>
      {children}
    </AudioContext.Provider>
  )
}
