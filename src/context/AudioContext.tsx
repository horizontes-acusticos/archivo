'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

export interface AudioTrack {
  id: string
  place: string
  date: string
  filename: string
  length: string
  link: string
  isAvailable: string
  season?: string
}

/* --------- 1.  Extend the shape that components expect --------- */
interface AudioContextType {
  /* playlist */
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void

  /* currently playing track */
  currentTrack: AudioTrack | null
  setCurrentTrack: (track: AudioTrack | null) => void

  /* play / pause flag (for UI) */
  isPlaying: boolean
  setIsPlaying: (b: boolean) => void

  /* navigation functions */
  playNext: () => void
  playPrevious: () => void
}

const AudioContext = createContext<AudioContextType | undefined>(undefined)

export const useAudio = () => {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within an AudioProvider')
  return ctx
}

interface AudioProviderProps {
  children: ReactNode
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  /* playlist */
  const [playlist, setPlaylist] = useState<AudioTrack[]>([])

  /* playback */
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playNext = () => {
    if (!currentTrack || playlist.length === 0) return
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    if (currentIndex === -1) return
    
    const nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0
    setCurrentTrack(playlist[nextIndex])
  }

  const playPrevious = () => {
    if (!currentTrack || playlist.length === 0) return
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
    if (currentIndex === -1) return
    
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1
    setCurrentTrack(playlist[prevIndex])
  }

  /* --------- 2.  Provide the extended context --------- */
  return (
    <AudioContext.Provider value={{
      playlist,
      setPlaylist,

      currentTrack,
      setCurrentTrack,
      isPlaying,
      setIsPlaying,

      playNext,
      playPrevious
    }}>
      {children}
    </AudioContext.Provider>
  )
}
