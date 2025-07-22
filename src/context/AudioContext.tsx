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
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void
  selectedTrackIndex: number | null
  highlightedTrackIndex: number | null
  selectTrackByIndex: (index: number) => void
  highlightTrackByIndex: (index: number) => void
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
  const [playlist, setPlaylist] = useState<AudioTrack[]>([])
  const [selectedTrackIndex, setSelectedTrackIndex] = useState<number | null>(null)
  const [highlightedTrackIndex, setHighlightedTrackIndex] = useState<number | null>(null)

  const selectTrackByIndex = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      setSelectedTrackIndex(index)
      setHighlightedTrackIndex(null) // Clear highlight when playing
    }
  }

  const highlightTrackByIndex = (index: number) => {
    if (index >= 0 && index < playlist.length) {
      setHighlightedTrackIndex(index)
    }
  }

  return (
    <AudioContext.Provider value={{
      playlist,
      setPlaylist,
      selectedTrackIndex,
      highlightedTrackIndex,
      selectTrackByIndex,
      highlightTrackByIndex
    }}>
      {children}
    </AudioContext.Provider>
  )
}
