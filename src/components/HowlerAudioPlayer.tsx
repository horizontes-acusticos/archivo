'use client'

import React, { useRef, useEffect, useState } from 'react'
import { Howl } from 'howler'
import { useAudio } from '@/context/AudioContext'
import { toast } from 'sonner'
import { RealTimeDisplay } from './RealTimeDisplay'
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  RotateCcw,
  RotateCw,
  ChevronUp,
  ChevronDown
} from 'lucide-react'

export const HowlerAudioPlayer: React.FC = () => {
  const { currentTrack, playNext, playPrevious } = useAudio()
  const howlRef = useRef<Howl | null>(null)
  const volumePopupRef = useRef<HTMLDivElement>(null)  // Add this ref
  const [isMobile, setIsMobile] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.77)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showMobileVolume, setShowMobileVolume] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 720)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Define handlers before useEffect
  const handleNext = () => {
    playNext()
  }

  // Initialize Howl when track changes
  useEffect(() => {
    if (!currentTrack?.link) return

    // Stop and unload previous track
    if (howlRef.current) {
      howlRef.current.stop()
      howlRef.current.unload()
    }

    setIsLoading(true)
    setCurrentTime(0)
    setDuration(0)

    // Create new Howl instance
    const howl = new Howl({
      src: [currentTrack.link],
      html5: true, // Use HTML5 Audio for streaming
      volume: isMuted ? 0 : volume, // Set initial volume
      onload: () => {
        setIsLoading(false)
        setDuration(howl.duration())
        // Auto-play when track loads
        howl.play()
        setIsPlaying(true)
      },
      onplay: () => {
        setIsPlaying(true)
      },
      onpause: () => {
        setIsPlaying(false)
      },
      onstop: () => {
        setIsPlaying(false)
        setCurrentTime(0)
      },
      onend: () => {
        setIsPlaying(false)
        handleNext() // Use handleNext instead of direct playNext()
      },
      onloaderror: (id, error) => {
        console.error('Audio load error:', error)
        toast.error('Failed to load audio')
        setIsLoading(false)
      },
      onplayerror: (id, error) => {
        console.error('Audio play error:', error)
        toast.error('Failed to play audio')
        setIsLoading(false)
      }
    })

    howlRef.current = howl

    return () => {
      howl.stop()
      howl.unload()
    }
  }, [currentTrack?.link]) // Removed isMuted and volume from dependencies

  // Update current time
  useEffect(() => {
    if (!isPlaying || !howlRef.current) return

    const interval = setInterval(() => {
      if (howlRef.current) {
        setCurrentTime(howlRef.current.seek() as number || 0)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying])

  // Update volume when changed
  useEffect(() => {
    if (howlRef.current) {
      howlRef.current.volume(isMuted ? 0 : volume)
    }
  }, [volume, isMuted])

  // Close volume popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (volumePopupRef.current && !volumePopupRef.current.contains(event.target as Node)) {
        setShowMobileVolume(false)
      }
    }

    const handleMouseDown = (event: MouseEvent) => handleClickOutside(event)
    const handleTouchStart = (event: TouchEvent) => handleClickOutside(event)

    if (showMobileVolume) {
      document.addEventListener('mousedown', handleMouseDown)
      document.addEventListener('touchstart', handleTouchStart)
    }

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('touchstart', handleTouchStart)
    }
  }, [showMobileVolume])

  const handlePlayPause = () => {
    if (!howlRef.current) return

    if (isPlaying) {
      howlRef.current.pause()
    } else {
      howlRef.current.play()
    }
  }

  const handlePrevious = () => {
    playPrevious()
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!howlRef.current || !duration) return

    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const seekTime = percentage * duration

    howlRef.current.seek(seekTime)
    setCurrentTime(seekTime)
  }

  const handleRewind = () => {
    if (!howlRef.current) return
    const newTime = Math.max(0, currentTime - 5)
    howlRef.current.seek(newTime)
    setCurrentTime(newTime)
  }

  const handleFastForward = () => {
    if (!howlRef.current || !duration) return
    const newTime = Math.min(duration, currentTime + 5)
    howlRef.current.seek(newTime)
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (newVolume > 0) setIsMuted(false)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleMobileVolume = () => {
    setShowMobileVolume(!showMobileVolume)
  }

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
  }

  const formatTime = (seconds: number): string => {
    if (!seconds || isNaN(seconds)) return '--:--'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
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
        
        {/* Minimize/Maximize button - top right */}
        <div className="flex justify-end mb-2">
          <button
            onClick={toggleMinimized}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            title={isMinimized ? 'Expand player' : 'Minimize player'}
          >
            {isMinimized ? (
              <ChevronUp className="w-4 h-4 text-slate-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-600" />
            )}
          </button>
        </div>

        {isMinimized ? (
          /* MINIMIZED STATE */
          <div className="flex items-center justify-between">
            {/* Left: RealTime display + Track info */}
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center gap-3">
                <RealTimeDisplay
                  filename={currentTrack.filename}
                  currentTime={currentTime}
                  isPlaying={isPlaying}
                  date={currentTrack.date}
                />
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm truncate text-slate-800">
                    {currentTrack.filename}
                  </h3>
                  <div className="text-xs text-slate-600 truncate">
                    <span className="truncate">{currentTrack.place}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Play/Pause + Next controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePlayPause}
                disabled={isLoading}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors disabled:opacity-50"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <button
                onClick={handleNext}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                title="Next track"
              >
                <SkipForward className="w-5 h-5 text-slate-700" />
              </button>
            </div>
          </div>
        ) : (
          /* FULL STATE */
          <>
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
            <div className="w-full relative">
              {/* Controls row */}
              <div className="flex items-center justify-between mb-2">
                {/* Track info - Left side (desktop only) */}
                {!isMobile && (
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-semibold text-sm truncate text-slate-800">
                      {currentTrack.filename}
                    </h3>
                    <div className="text-xs text-slate-600 truncate">
                      <span className="truncate">{currentTrack.place}</span>
                    </div>
                  </div>
                )}

                {/* Left spacer for mobile to keep transport centered */}
                {isMobile && <div className="flex-1" />}

                {/* Transport controls - Always centered */}
                <div className="flex items-center gap-4">
                  {/* Jump controls */}
                  <button
                    onClick={handleRewind}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    title="Rewind 5 seconds"
                  >
                    <RotateCcw className="w-5 h-5 text-slate-600" />
                  </button>

                  {/* Previous button */}
                  <button
                    onClick={handlePrevious}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    title="Previous track"
                  >
                    <SkipBack className="w-6 h-6 text-slate-700" />
                  </button>

                  {/* Play/Pause button */}
                  <button
                    onClick={handlePlayPause}
                    disabled={isLoading}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors disabled:opacity-50"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6 ml-0.5" />
                    )}
                  </button>

                  {/* Next button */}
                  <button
                    onClick={handleNext}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    title="Next track"
                  >
                    <SkipForward className="w-6 h-6 text-slate-700" />
                  </button>

                  {/* Fast forward */}
                  <button
                    onClick={handleFastForward}
                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    title="Fast forward 5 seconds"
                  >
                    <RotateCw className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                {/* Volume controls - Right side */}
                <div className="flex items-center gap-2 flex-1 justify-end pl-4 relative">
                  {!isMobile ? (
                    /* Desktop volume - horizontal slider */
                    <>
                      <button
                        onClick={toggleMute}
                        className="p-1 hover:bg-slate-100 rounded transition-colors"
                        title={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-slate-600" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-slate-600" />
                        )}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, #1e293b 0%, #1e293b ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 100%)`
                        }}
                      />
                    </>
                  ) : (
                    /* Mobile volume - popup button */
                    <>
                      <button
                        onClick={toggleMobileVolume}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        title={isMuted ? 'Unmute' : 'Volume'}
                      >
                        {isMuted ? (
                          <VolumeX className="w-5 h-5 text-slate-600" />
                        ) : (
                          <Volume2 className="w-5 h-5 text-slate-600" />
                        )}
                      </button>

                      {/* Vertical volume slider popup */}
                      {showMobileVolume && (
                        <div 
                          ref={volumePopupRef}
                          className="absolute bottom-full mb-2 right-0 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-10"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={toggleMute}
                              className="p-1 hover:bg-slate-100 rounded transition-colors"
                              title={isMuted ? 'Unmute' : 'Mute'}
                            >
                              {isMuted ? (
                                <VolumeX className="w-4 h-4 text-slate-600" />
                              ) : (
                                <Volume2 className="w-4 h-4 text-slate-600" />
                              )}
                            </button>
                            
                            {/* Vertical slider */}
                            <div className="relative h-20 w-6 flex items-center justify-center">
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.01"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                                className="vertical-slider h-20 w-1 bg-slate-200 rounded-full appearance-none cursor-pointer"
                                style={{
                                  background: `linear-gradient(to top, #1e293b 0%, #1e293b ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 ${(isMuted ? 0 : volume) * 100}%, #e2e8f0 100%)`
                                }}
                              />
                            </div>
                            
                            {/* Volume percentage */}
                            <span className="text-xs text-slate-500">
                              {Math.round((isMuted ? 0 : volume) * 100)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Progress bar - Now at the bottom */}
              <div>
                <div 
                  className="w-full h-1 bg-slate-200 rounded-full cursor-pointer"
                  onClick={handleSeek}
                >
                  <div 
                    className="h-full bg-slate-800 rounded-full transition-all duration-100"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-slate-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export { HowlerAudioPlayer as AudioPlayer }
