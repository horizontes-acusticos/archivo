'use client'

import React from 'react'
import { AudioDataTable } from '@/components/AudioDataTable' // <-- Use the new table
import { AudioPlayer } from '@/components/AudioPlayer'
import { AudioProvider } from '@/context/AudioContext'
import { useCsvAudioData } from "@/hooks/useCsvAudioData"

const CSV_URL = "https://archivo-prod.sfo3.cdn.digitaloceanspaces.com/audio/s01.csv"

export default function Home() {
  const { tracks, loading, error } = useCsvAudioData(CSV_URL)

  return (
    <AudioProvider>
      <div className="min-h-screen pb-64">
        <div className="container mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2">Archivo</h1>
            <p className="text-slate-600 text-center">
              Seasonal Audio Collection with Spectrogram Analysis
            </p>
          </header>
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>Error: {error}</div>
          ) : (
            <AudioDataTable data={tracks} />
          )}
        </div>
      </div>
      <AudioPlayer />
    </AudioProvider>
  )
}
