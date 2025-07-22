'use client'

import React, { useRef, useEffect, useState } from 'react'
import { useAudio } from '@/context/AudioContext'
import { toast } from 'sonner'
import AudioPlayer from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css'

export const SimpleAudioPlayer: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying: contextIsPlaying, 
    setIsPlaying, 
    playNext, 
    playPrevious,
    shouldAutoPlay,
    setShouldAutoPlay
  } = useAudio()
  const playerRef = useRef<AudioPlayer>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  // Flag to track when we should auto-play the next track
  const autoPlayNextRef = useRef(false)
  // Track the current track ID to detect changes
  const currentTrackIdRef = useRef<string | null>(null)
  
  // Always define the audio URL before using it
  const audioUrl = currentTrack?.link || "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3"

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 720)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Sync context playing state with player
  useEffect(() => {
    if (playerRef.current?.audio.current) {
      if (contextIsPlaying && playerRef.current.audio.current.paused) {
        playerRef.current.audio.current.play().catch(console.error)
      } else if (!contextIsPlaying && !playerRef.current.audio.current.paused) {
        playerRef.current.audio.current.pause()
      }
    }
  }, [contextIsPlaying])

  // Handle auto-play for track changes
  useEffect(() => {
    if (currentTrack && playerRef.current?.audio.current) {
      // Check if this is a new track or if shouldAutoPlay is true
      const isNewTrack = currentTrackIdRef.current !== currentTrack.id
      currentTrackIdRef.current = currentTrack.id
      
      if (shouldAutoPlay || autoPlayNextRef.current || isNewTrack) {
        // Small delay to ensure the audio src has loaded
        setTimeout(() => {
          if (playerRef.current?.audio.current) {
            playerRef.current.audio.current.play().then(() => {
              setIsPlaying(true)
              autoPlayNextRef.current = false
              setShouldAutoPlay(false)
            }).catch(console.error)
          }
        }, 100)
      }
    }
  }, [currentTrack, shouldAutoPlay, setIsPlaying, setShouldAutoPlay])

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleEnded = () => {
    console.log('Track finished, playing next...')
    autoPlayNextRef.current = true
    setIsPlaying(true)
    
    const nextTrack = playNext()
    if (nextTrack) {
      toast.success(`Playing next: ${nextTrack.filename}`)
    } else {
      toast.info('Playlist finished')
      setIsPlaying(false)
    }
  }

const handleError = (e: Event | Error) => {    
  console.error('Audio error:', e)
    toast.error('Failed to load audio')
    setIsPlaying(false)
  }

  const handleClickNext = () => {
    console.log('Next button clicked')
    autoPlayNextRef.current = true
    setIsPlaying(true)
    
    const nextTrack = playNext()
    if (nextTrack) {
      toast.success(`Playing next: ${nextTrack.filename}`)
    } else {
      toast.info('End of playlist')
      setIsPlaying(false)
    }
  }

  const handleClickPrevious = () => {
    console.log('Previous button clicked')
    autoPlayNextRef.current = true
    setIsPlaying(true)
    
    const previousTrack = playPrevious()
    if (previousTrack) {
      toast.success(`Playing previous: ${previousTrack.filename}`)
    } else {
      toast.info('Start of playlist')
      setIsPlaying(false)
    }
  }

  if (!currentTrack) {
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
        
        {/* Track info header for mobile */}
        {isMobile && (
          <div className="mb-3 text-center">
            <h3 className="font-semibold text-sm truncate text-slate-800">
              {currentTrack.filename}
            </h3>
            <div className="text-xs text-slate-600 truncate">
              <span className="truncate">{currentTrack.place}</span>
              {currentTrack.date && (
                <>
                  <span className="text-slate-400 mx-1">•</span>
                  <span className="text-slate-500">{currentTrack.date}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Audio Player */}
        <div className="w-full">
          <AudioPlayer
            ref={playerRef}
            src={audioUrl}
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnded}
            onError={handleError}
            onClickNext={handleClickNext}
            onClickPrevious={handleClickPrevious}
            showJumpControls={true}
            showSkipControls={true}
            showFilledVolume={true}
            showDownloadProgress={true}
            showFilledProgress={true}
            volumeJumpStep={0.01}
            progressJumpSteps={{ backward: 5000, forward: 5000 }}
            customAdditionalControls={!isMobile ? [
              <div key="track-info" className="absolute left-4 top-0 bottom-8 flex flex-col justify-center text-left max-w-[300px] pr-4">
                <h3 className="font-semibold text-sm truncate text-slate-800">
                  {currentTrack.filename}
                </h3>
                <div className="text-xs text-slate-600 truncate">
                  <span className="truncate">{currentTrack.place}</span>
                  {currentTrack.date && (
                    <>
                      <span className="text-slate-400 mx-1">•</span>
                      <span className="text-slate-500">{currentTrack.date}</span>
                    </>
                  )}
                </div>
              </div>
            ] : []}
            layout="stacked-reverse"
            defaultVolume={0.77}
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
