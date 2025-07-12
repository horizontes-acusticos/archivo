'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useAudio } from '@/context/AudioContext'
import { useWavesurfer } from '@wavesurfer/react'
import { toast } from 'sonner'
import { Loader2, Play, Pause, Volume2 } from 'lucide-react'

export const AudioPlayer: React.FC = () => {
  const { currentTrack, setIsPlaying, playNext } = useAudio()
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setPlaying] = useState(false)
  const [isWaveformLoading, setIsWaveformLoading] = useState(false)
  const [isAudioReady, setIsAudioReady] = useState(false)
  const [volume, setVolume] = useState(0.5)

  // Always call hooks in the same order
  const audioUrl = currentTrack?.link || "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3"

  const { wavesurfer } = useWavesurfer({
    container: waveformRef,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrl,
    dragToSeek: true,
  })

  // Listen for loading and ready events
  useEffect(() => {
    if (wavesurfer) {
      const handleLoading = () => {
        setIsWaveformLoading(true)
        setIsAudioReady(false)
      }
      
      const handleReady = () => {
        setIsAudioReady(true)
        // Waveform might still be rendering even when audio is ready
      }

      const handleDecode = () => {
        // Waveform is fully rendered and ready
        setIsWaveformLoading(false)
      }

      const handleError = (error: any) => {
        setIsWaveformLoading(false)
        setIsAudioReady(false)
        toast.error('Failed to load audio')
        console.error('Audio loading error:', error)
      }

      wavesurfer.on('loading', handleLoading)
      wavesurfer.on('ready', handleReady)
      wavesurfer.on('decode', handleDecode)
      wavesurfer.on('error', handleError)

      return () => {
        if (wavesurfer.un) {
          wavesurfer.un('loading', handleLoading)
          wavesurfer.un('ready', handleReady)
          wavesurfer.un('decode', handleDecode)
          wavesurfer.un('error', handleError)
        }
      }
    }
  }, [wavesurfer])

  // Listen for audio finish event to play next track
  useEffect(() => {
    if (wavesurfer) {
      const handleFinish = () => {
        setPlaying(false)
        setIsPlaying(false)
        
        const nextTrack = playNext()
        if (nextTrack) {
          toast.success(`Playing next: ${nextTrack.filename}`)
          setIsWaveformLoading(true)
          setIsAudioReady(false)
          
          // Wait for the new track to be ready before auto-playing
          const handleNextReady = () => {
            setIsAudioReady(true)
            wavesurfer.play()
            setPlaying(true)
            setIsPlaying(true)
            // Remove this specific listener after use
            if (wavesurfer.un) {
              wavesurfer.un('ready', handleNextReady)
            }
          }
          
          wavesurfer.on('ready', handleNextReady)
        } else {
          toast.info('Playlist finished')
        }
      }

      wavesurfer.on('finish', handleFinish)

      return () => {
        if (wavesurfer.un) {
          wavesurfer.un('finish', handleFinish)
        }
      }
    }
  }, [wavesurfer, playNext, setIsPlaying])

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

  const handlePlayPause = () => {
    try {
      if (wavesurfer) {
        wavesurfer.playPause()
        setPlaying(!isPlaying)
        setIsPlaying(!isPlaying)
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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-3">
          <h3 className="font-semibold text-lg">{currentTrack.filename}</h3>
          <p className="text-slate-600">{currentTrack.place}</p>
        </div>

        <div className="bg-slate-50 rounded-lg p-4">
          {/* Waveform with loading overlay */}
          <div className="relative mb-4">
            <div ref={waveformRef} className={isWaveformLoading ? 'opacity-30' : ''} />
            {isWaveformLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80">
                <div className="flex items-center gap-2 text-slate-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Loading waveform...</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePlayPause}
              className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg flex items-center justify-center"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </button>
            
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-600" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, #e2e8f0 ${volume * 100}%, #e2e8f0 100%)`
                }}
              />
              <span className="text-xs text-slate-500 w-8 text-center">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
