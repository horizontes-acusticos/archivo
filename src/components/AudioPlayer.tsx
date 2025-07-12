'use client'

import React, { useRef, useState } from 'react'
import { useAudio } from '@/context/AudioContext'
import WaveSurfer from '@wavesurfer/react'

export const AudioPlayer: React.FC = () => {
  const { currentTrack, setIsPlaying } = useAudio()
  const waveformRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setPlaying] = useState(false)

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

  const audioUrl = currentTrack.link || "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3"

  const handlePlayPause = () => {
    if (waveformRef.current) {
      const wavesurfer = waveformRef.current as any
      wavesurfer.playPause()
      setPlaying(!isPlaying)
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
          <WaveSurfer
            container={waveformRef}
            waveColor="rgb(200, 0, 200)"
            progressColor="rgb(100, 0, 100)"
            url={audioUrl}
            mediaControls={true}
          />

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
