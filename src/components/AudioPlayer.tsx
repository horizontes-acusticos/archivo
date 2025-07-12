'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useAudio } from '@/context/AudioContext'
import { useWavesurfer } from '@wavesurfer/react'
import { toast } from 'sonner'
import { Loader2, Play, Pause, Volume2, Minimize2, Maximize2 } from 'lucide-react'

export const AudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying: contextIsPlaying, setIsPlaying, playNext } = useAudio()
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setPlaying] = useState(false)
  const [isWaveformLoading, setIsWaveformLoading] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [volume, setVolume] = useState(0.77) // Set default volume to 77%
  const [isMinimized, setIsMinimized] = useState(false)
  
  // Flag to track when we should auto-play the next track
  const autoPlayNextRef = useRef(false)
  
  // Always define the audio URL before using it in hooks
  const audioUrl = currentTrack?.link || "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3"
  
  // Keep track of the last URL to prevent unnecessary reloading
  const lastUrlRef = useRef(audioUrl)

  // Initialize the wavesurfer instance with the audioUrl
  const { wavesurfer } = useWavesurfer({
    container: waveformRef,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrl,
    dragToSeek: true,
    autoplay: false, // Disable autoplay as we'll handle it manually for better control
    height: 80, // Set fixed height to prevent layout shifts
  })

  // Check if audio URL has changed and we need to load a new file
  useEffect(() => {
    if (wavesurfer && lastUrlRef.current !== audioUrl) {
      console.log('Audio URL changed, loading new track:', audioUrl)
      lastUrlRef.current = audioUrl
      
      // Make sure we reset states properly when loading a new track
      setIsAudioReady(false)
      setIsWaveformLoading(true)
      
      // The wavesurfer.load() call will trigger the 'loading' event
      // which our other useEffect will handle
    }
  }, [wavesurfer, audioUrl])

  // Sync local playing state with context playing state
  useEffect(() => {
    setPlaying(contextIsPlaying)
  }, [contextIsPlaying])
  
  // Update playing state when currentTrack changes
  useEffect(() => {
    // If auto-play flag is set, we need to play as soon as the track loads
    if (currentTrack) {
      if (autoPlayNextRef.current) {
        setPlaying(true)
        setIsPlaying(true)
        autoPlayNextRef.current = false // Reset the flag
      }
    }
  }, [currentTrack, setIsPlaying])

  // Listen for loading and ready events
  useEffect(() => {
    if (wavesurfer) {
      const handleLoading = () => {
        // Only set loading state if it's not already loading
        if (!isWaveformLoading) {
          setIsWaveformLoading(true)
          setIsAudioReady(false)
        }
      }
      
      const handleReady = () => {
        console.log('Wavesurfer ready event fired')
        setIsAudioReady(true)
        
        // Set volume when audio is ready
        if (wavesurfer) {
          wavesurfer.setVolume(volume)
          
          // Auto-play if needed - this handles the case when a new track is loaded
          if (autoPlayNextRef.current || contextIsPlaying) {
            console.log('Audio ready - preparing to auto-play track')
            
            // Use a small delay to ensure everything is properly initialized
            setTimeout(() => {
              if (wavesurfer.isDestroyed) {
                console.log('Wavesurfer was destroyed before play could start')
                return
              }
              
              try {
                wavesurfer.play()
                setPlaying(true)
                setIsPlaying(true)
                console.log('Auto-playing track - triggered by', 
                  autoPlayNextRef.current ? 'autoPlayNextRef' : 'contextIsPlaying')
              } catch (error) {
                console.error('Error during auto-play:', error)
                toast.error('Failed to auto-play track')
              }
              
              autoPlayNextRef.current = false
            }, 150) // Slightly longer delay for better reliability
          }
        }
      }

      const handleDecode = () => {
        // Waveform is fully rendered and ready
        setIsWaveformLoading(false)
      }

      const handleError = (error: Error) => {
        setIsWaveformLoading(false)
        setIsAudioReady(false)
        toast.error('Failed to load audio')
        console.error('Audio loading error:', error)
      }

      const handlePlay = () => {
        setPlaying(true)
        setIsPlaying(true)
      }

      const handlePause = () => {
        setPlaying(false)
        setIsPlaying(false)
      }

      wavesurfer.on('loading', handleLoading)
      wavesurfer.on('ready', handleReady)
      wavesurfer.on('decode', handleDecode)
      wavesurfer.on('error', handleError)
      wavesurfer.on('play', handlePlay)
      wavesurfer.on('pause', handlePause)

      return () => {
        if (wavesurfer.un) {
          wavesurfer.un('loading', handleLoading)
          wavesurfer.un('ready', handleReady)
          wavesurfer.un('decode', handleDecode)
          wavesurfer.un('error', handleError)
          wavesurfer.un('play', handlePlay)
          wavesurfer.un('pause', handlePause)
        }
      }
    }
  }, [wavesurfer, volume, contextIsPlaying, setIsPlaying, setPlaying])

  // Listen for audio finish event to play next track
  useEffect(() => {
    if (wavesurfer) {
      const handleFinish = () => {
        console.log('Track finished, playing next...')
        
        // Set flag to indicate we should auto-play the next track
        autoPlayNextRef.current = true
        setIsPlaying(true) // Keep isPlaying true in the context
        
        // Get and set the next track
        const nextTrack = playNext()
        if (nextTrack) {
          toast.success(`Playing next: ${nextTrack.filename}`)
        } else {
          toast.info('Playlist finished')
          setPlaying(false)
          setIsPlaying(false)
        }
      }

      wavesurfer.on('finish', handleFinish)

      return () => {
        if (wavesurfer.un) {
          wavesurfer.un('finish', handleFinish)
        }
      }
    }
  }, [wavesurfer, playNext, setIsPlaying, setPlaying])

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

  const handlePlayPause = () => {
    try {
      if (wavesurfer && isAudioReady) {
        // Check if wavesurfer is still valid and not destroyed
        if (wavesurfer.isDestroyed) {
          console.error('WaveSurfer instance is destroyed')
          toast.error('Audio player needs to be reinitialized')
          return
        }
        
        // Use the standard playPause() method as documented
        console.log('Toggling play/pause at current position')
        wavesurfer.playPause()
        
        // We'll let the event listeners handle state updates
        // This ensures our state is always in sync with the actual player state
      } else if (!isAudioReady) {
        toast.info('Audio is still loading...')
      } else {
        toast.error('Audio player not ready')
      }
    } catch (error) {
      console.error('Play/pause error:', error)
      toast.error('Failed to play/pause audio')
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (wavesurfer) {
      wavesurfer.setVolume(newVolume)
    }
  }

  const toggleMinimized = () => {
    // Just toggle the minimized state without affecting playback
    setIsMinimized(!isMinimized)
    // We're keeping the audio playing when minimized - only the UI changes
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2 sm:p-4 shadow-lg transition-all duration-300">
      <div className="max-w-6xl mx-auto min-w-[340px]">
        {/* Header with title and minimize button */}
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <div className={`overflow-hidden ${isMinimized ? 'w-24 sm:w-32 truncate' : ''}`}>
            {!isMinimized && (
              <h3 className="font-semibold text-sm sm:text-lg truncate">{currentTrack.filename}</h3>
            )}
            <p className="text-slate-600 text-xs sm:text-sm truncate">{currentTrack.place}</p>
          </div>
          <button 
            onClick={toggleMinimized} 
            className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-100"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Waveform section - keep it in DOM with fixed height when minimized to prevent reloading */}
        <div className={`bg-slate-50 rounded-lg transition-all duration-300 ${
          isMinimized 
            ? 'h-0 overflow-hidden opacity-0 m-0 p-0 absolute pointer-events-none' 
            : 'p-4 mb-4 relative'
        }`}>
          {/* Waveform container - always present in DOM even when minimized */}
          <div className="relative mb-4">
            <div 
              ref={waveformRef} 
              className={isWaveformLoading ? 'opacity-30' : ''}
              data-playing={isPlaying}
              data-loading={isWaveformLoading}
              // Maintain a stable height to prevent layout shifts
              style={{ minHeight: '80px' }}
            />
            {isWaveformLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80">
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading waveform...</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Controls - always at the bottom */}
        <div className="flex items-center justify-between">
          {/* Empty div for spacing */}
          <div className="w-16 sm:w-24"></div>
          
          {/* Centered play button */}
          <div className="flex justify-center">
            <button
              onClick={handlePlayPause}
              className={`border-2 bg-transparent p-2 sm:p-3 rounded-lg flex items-center justify-center ${
                isAudioReady 
                  ? "border-blue-500 text-blue-500 hover:bg-blue-50" 
                  : "border-blue-300 text-blue-300 cursor-wait"
              }`}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
          
          {/* Volume control on the right */}
          <div className="flex items-center gap-2 w-16 sm:w-24 justify-end">
            <Volume2 className="w-4 h-4 text-slate-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 sm:w-16 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
