'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

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

interface AudioStore {
  // Playlist state
  playlist: AudioTrack[]
  setPlaylist: (tracks: AudioTrack[]) => void
  
  // Current track state
  currentTrack: AudioTrack | null
  setCurrentTrack: (track: AudioTrack | null) => void
  
  // Playback state
  isPlaying: boolean
  setIsPlaying: (playing: boolean) => void
  
  // Navigation actions
  playNext: () => void
  playPrevious: () => void
}

interface TableStore {
  // Column visibility state (persists across tabs)
  columnVisibility: Record<string, boolean>
  setColumnVisibility: (visibility: Record<string, boolean>) => void
  toggleColumn: (columnId: string) => void
  resetColumns: () => void
}

// Audio Store with enhanced debugging
export const useAudioStore = create<AudioStore>()(
  devtools(
    (set, get) => ({
      playlist: [],
      setPlaylist: (tracks) => {
        console.log('🎵 Setting playlist with', tracks.length, 'tracks')
        console.log('🎵 First few tracks:', tracks.slice(0, 3).map(t => `${t.season}: ${t.filename}`))
        set({ playlist: tracks }, false, 'setPlaylist')
      },
      
      currentTrack: null,
      setCurrentTrack: (track) => {
        console.log('🎵 Setting current track:', track?.filename, 'Season:', track?.season)
        set({ currentTrack: track }, false, 'setCurrentTrack')
      },
      
      isPlaying: false,
      setIsPlaying: (playing) => set({ isPlaying: playing }, false, 'setIsPlaying'),
      
      playNext: () => {
        const { currentTrack, playlist } = get()
        
        console.log('🎵 playNext called')
        console.log('🎵 Current track:', currentTrack?.filename, 'Season:', currentTrack?.season, 'ID:', currentTrack?.id)
        console.log('🎵 Playlist length:', playlist.length)
        console.log('🎵 First 3 playlist items:', playlist.slice(0, 3).map(t => `${t.season}-${t.id}-${t.filename}`))
        
        if (!currentTrack || playlist.length === 0) {
          console.error('❌ Cannot play next: missing track or empty playlist')
          console.log('❌ currentTrack:', currentTrack)
          console.log('❌ playlist.length:', playlist.length)
          return
        }
        
        const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
        console.log('🎵 Current track found at index:', currentIndex)
        
        if (currentIndex === -1) {
          console.error('❌ Current track not found in playlist!')
          console.log('❌ Looking for ID:', currentTrack.id)
          console.log('❌ Available IDs:', playlist.map(t => t.id))
          console.log('❌ Current track object:', currentTrack)
          return
        }
        
        const nextIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0
        const nextTrack = playlist[nextIndex]
        console.log('🎵 Next index:', nextIndex, 'Next track:', nextTrack?.filename, 'Season:', nextTrack?.season)
        
        if (nextTrack) {
          set({ currentTrack: nextTrack }, false, 'playNext')
          console.log('✅ Successfully set next track')
        } else {
          console.error('❌ Next track is undefined')
        }
      },
      
      playPrevious: () => {
        const { currentTrack, playlist } = get()
        
        console.log('🎵 playPrevious called')
        console.log('🎵 Current track:', currentTrack?.filename, 'Season:', currentTrack?.season, 'ID:', currentTrack?.id)
        console.log('🎵 Playlist length:', playlist.length)
        
        if (!currentTrack || playlist.length === 0) {
          console.error('❌ Cannot play previous: missing track or empty playlist')
          return
        }
        
        const currentIndex = playlist.findIndex(track => track.id === currentTrack.id)
        console.log('🎵 Current track found at index:', currentIndex)
        
        if (currentIndex === -1) {
          console.error('❌ Current track not found in playlist!')
          console.log('❌ Looking for ID:', currentTrack.id)
          console.log('❌ Available IDs:', playlist.map(t => t.id))
          return
        }
        
        const previousIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1
        const previousTrack = playlist[previousIndex]
        console.log('🎵 Previous index:', previousIndex, 'Previous track:', previousTrack?.filename, 'Season:', previousTrack?.season)
        
        if (previousTrack) {
          set({ currentTrack: previousTrack }, false, 'playPrevious')
          console.log('✅ Successfully set previous track')
        } else {
          console.error('❌ Previous track is undefined')
        }
      },
    }),
    {
      name: 'audio-store',
    }
  )
)

// Table Store with persistent column visibility
export const useTableStore = create<TableStore>()(
  devtools(
    (set, get) => ({
      columnVisibility: {},
      
      setColumnVisibility: (visibility) => {
        console.log('📋 Setting column visibility:', visibility)
        set({ columnVisibility: visibility }, false, 'setColumnVisibility')
      },
      
      toggleColumn: (columnId) => {
        const { columnVisibility } = get()
        const newVisibility = {
          ...columnVisibility,
          [columnId]: !columnVisibility[columnId]
        }
        console.log('📋 Toggling column', columnId, 'to', !columnVisibility[columnId])
        set({ columnVisibility: newVisibility }, false, 'toggleColumn')
      },
      
      resetColumns: () => {
        console.log('📋 Resetting column visibility')
        set({ columnVisibility: {} }, false, 'resetColumns')
      },
    }),
    {
      name: 'table-store',
    }
  )
)
