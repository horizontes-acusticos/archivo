'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useAudio } from '@/context/AudioContext'
import { toast } from 'sonner'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'
import { RealTimeDisplay } from './RealTimeDisplay'

export const SimpleAudioPlayer: React.FC = () => {
  const { playlist, selectedTrackIndex, selectTrackByIndex } = useAudio()
  const playerRef = useRef<AudioPlayer>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Initialize first track if none selected and playlist is available
  useEffect(() => {
    if (playlist.length > 0 && selectedTrackIndex === null) {
      selectTrackByIndex(0)
    }
  }, [playlist.length, selectedTrackIndex, selectTrackByIndex])
  
  // Use selectedTrackIndex directly from context - no local state
  const currentTrack = playlist.length > 0 && selectedTrackIndex !== null ? playlist[selectedTrackIndex] : null
  const audioUrl = currentTrack?.link || ""

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 720)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Track current playback time and playing state
  useEffect(() => {
    const updateTime = () => {
      if (playerRef.current?.audio.current) {
        const audio = playerRef.current.audio.current
        setCurrentTime(audio.currentTime || 0)
        setIsPlaying(!audio.paused && !audio.ended)
      }
    }

    const interval = setInterval(updateTime, 100)
    return () => clearInterval(interval)
  }, [])

  // Auto-play when track changes (but not on initial load)
  useEffect(() => {
    if (playerRef.current?.audio.current && currentTrack && selectedTrackIndex !== null) {
      // Small delay to ensure the audio element is ready
      const timer = setTimeout(() => {
        playerRef.current?.audio.current?.play().catch(error => {
          console.log('Auto-play blocked by browser:', error)
        })
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [selectedTrackIndex, currentTrack])

  // Minimal event handlers - NO state management
  const handleEnded = () => {
    console.log('Track finished, playing next...')
    
    // Use selectedTrackIndex from context for circular navigation
    const nextIndex = selectedTrackIndex !== null && selectedTrackIndex < playlist.length - 1 
      ? selectedTrackIndex + 1 
      : 0
    selectTrackByIndex(nextIndex)
  }

  const handleError = (e: Event | Error) => {    
    console.error('Audio error:', e)
    toast.error('Failed to load audio')
  }

  if (!currentTrack || playlist.length === 0) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto min-w-[340px]">
          <div className="text-center text-slate-500">
            <p>Select a track to start playing</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 sm:p-4 shadow-lg">
      <div className="max-w-6xl mx-auto min-w-[300px]">
        
        {/* Real-time display - Always at the top */}
        <div className="mb-2 flex justify-center">
          <RealTimeDisplay
            filename={currentTrack.filename}
            currentTime={currentTime}
            isPlaying={isPlaying}
            date={currentTrack.date}
          />
        </div>

        {/* Track info header for mobile */}
        {isMobile && (
          <div className="mb-3 text-center">
            <h3 className="font-semibold text-sm truncate text-slate-800">
              {currentTrack.filename}
            </h3>
            <div className="text-xs text-slate-600 truncate">
              <span className="truncate">{currentTrack.place}</span>
            </div>
          </div>
        )}

        {/* Audio Player */}
        <div className="w-full">
          <AudioPlayer
            ref={playerRef}
            src={audioUrl}
            showSkipControls={false}
            onEnded={handleEnded}
            onError={handleError}
            showJumpControls={false}
            showFilledVolume={true}
            showDownloadProgress={true}
            showFilledProgress={true}
            volumeJumpStep={0.01}
            customAdditionalControls={!isMobile ? [
              <div key="track-info" className="absolute left-4 top-0 bottom-8 flex flex-col justify-center text-left max-w-[300px] pr-4">
                <h3 className="font-semibold text-sm truncate text-slate-800">
                  {currentTrack.filename}
                </h3>
                <div className="text-xs text-slate-600 truncate">
                  <span className="truncate">{currentTrack.place}</span>
                </div>
              </div>
            ] : []}
            layout="stacked-reverse"
            style={{
              '--rhap_theme-color': '#1e293b',
              '--rhap_background-color': 'transparent',
              position: 'relative'
            } as React.CSSProperties}
          />
        </div>
      </div>
    </div>
  )
}

export { SimpleAudioPlayer as AudioPlayer }
