import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface AudioTrack {
  id: string
  title: string
  artist: string
  season: string
  url: string
  spectrogramUrl?: string
}

interface AudioContextType {
  currentTrack: AudioTrack | null
  setCurrentTrack: (track: AudioTrack) => void
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
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

  return (
    <AudioContext.Provider value={{
      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying
    }}>
      {children}
    </AudioContext.Provider>
  )
}
