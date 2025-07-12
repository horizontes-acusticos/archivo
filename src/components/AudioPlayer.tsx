'use client'

import React, { useRef, useState, useEffect } from 'react'
import { useAudio } from '@/context/AudioContext'
import { useWavesurfer } from '@wavesurfer/react'
import { toast } from 'sonner'

export const AudioPlayer: React.FC = () => {
  const { currentTrack, setIsPlaying, playNext } = useAudio()
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setPlaying] = useState(false)

  // Always call hooks in the same order
  const audioUrl = currentTrack?.link || "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3"

  const { wavesurfer } = useWavesurfer({
    container: waveformRef,
    waveColor: 'rgb(200, 0, 200)',
    progressColor: 'rgb(100, 0, 100)',
    url: audioUrl,
    dragToSeek: true,
  })

  // Listen for audio finish event to play next track
  useEffect(() => {
    if (wavesurfer) {
      const handleFinish = () => {
        setPlaying(false)
        setIsPlaying(false)
        
        const nextTrack = playNext()
        if (nextTrack) {
          toast.success(`Playing next: ${nextTrack.filename}`)
          // Small delay to ensure the new track loads before auto-playing
          setTimeout(() => {
            if (wavesurfer) {
              wavesurfer.play()
              setPlaying(true)
              setIsPlaying(true)
            }
          }, 500)
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
        toast.success(isPlaying ? 'Audio paused' : 'Audio playing')
      } else {
        toast.error('Audio player not ready')
      }
    } catch (error) {
      console.error('Play/pause error:', error)
      toast.error('Failed to play/pause audio')
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
          {/* Waveform */}
          <div ref={waveformRef} className="mb-4" />

          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={handlePlayPause}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
