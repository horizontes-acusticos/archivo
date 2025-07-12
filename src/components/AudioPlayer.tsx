'use client'

import React from 'react'
import { useAudio } from '@/context/AudioContext'

export const AudioPlayer: React.FC = () => {
  const { currentTrack, isPlaying, setIsPlaying } = useAudio()

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

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-2">
          <h3 className="font-semibold text-lg">{currentTrack.filename}</h3>
          <p className="text-slate-600">{currentTrack.place}</p>
        </div>
        
        <div className="h-48">
          <div className="h-48 bg-slate-100 rounded flex items-center justify-center">
            <div className="text-center">
              <h3 className="font-semibold text-lg mb-2">{currentTrack.filename}</h3>
              <p className="text-slate-600 mb-4">{currentTrack.place}</p>
              <audio 
                controls 
                autoPlay={isPlaying}
                src={currentTrack.link || "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3"}
                className="w-full max-w-md"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
