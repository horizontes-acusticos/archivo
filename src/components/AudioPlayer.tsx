'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useAudio } from '@/context/AudioContext'

// Dynamically import the SpectrogramPlayer with no SSR
const SpectrogramPlayer = dynamic(
  () => import('react-audio-spectrogram-player'),
  { 
    ssr: false,
    loading: () => <div className="h-48 bg-slate-100 rounded flex items-center justify-center">Loading audio player...</div>
  }
)

export const AudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useAudio()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center text-slate-500">
            <p>Select a track to start playing</p>
          </div>
        </div>
      </div>
    )
  }

  // Mock annotations data - in a real app, this would be loaded from the spectrogramUrl
  const mockAnnotations = [
    {
      start: 0,
      end: 30,
      label: "Intro",
      color: "#ff6b6b"
    },
    {
      start: 30,
      end: 90,
      label: "Main Theme",
      color: "#4ecdc4"
    },
    {
      start: 90,
      end: 150,
      label: "Variation",
      color: "#45b7d1"
    },
    {
      start: 150,
      end: 204,
      label: "Outro",
      color: "#96ceb4"
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2">
          <h3 className="font-semibold text-lg">{currentTrack.title}</h3>
          <p className="text-slate-600">{currentTrack.artist}</p>
        </div>
        
        <div className="h-48">
          {isMounted ? (
            <SpectrogramPlayer
              audioUrl={currentTrack.url}
              annotations={mockAnnotations}
              autoPlay={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="h-48 bg-slate-100 rounded flex items-center justify-center">
              Loading audio player...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
