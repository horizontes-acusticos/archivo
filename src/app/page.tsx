'use client'

import React, { useState } from 'react'
import { AudioDataTable } from '@/components/AudioDataTable'
import { useAudio } from '@/context/AudioContext'
import { useCsvAudioData } from "@/hooks/useCsvAudioData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const CSV_URLS = {
  autumn: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01.csv",
  winter: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s02.csv",
  spring: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s03.csv",
  summer: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s04.csv"
} 

export default function Home() {
  const [activeTab, setActiveTab] = useState<keyof typeof CSV_URLS>('autumn')
  const { playlist, setPlaylist } = useAudio()
  
  // Load all tracks from all seasons into the global playlist
  const { tracks: autumnTracks } = useCsvAudioData(CSV_URLS.autumn, 'autumn')
  const { tracks: winterTracks } = useCsvAudioData(CSV_URLS.winter, 'winter')
  const { tracks: springTracks } = useCsvAudioData(CSV_URLS.spring, 'spring')
  const { tracks: summerTracks } = useCsvAudioData(CSV_URLS.summer, 'summer')
  
  // Combine all tracks and set global playlist
  React.useEffect(() => {
    const allTracks = [...autumnTracks, ...winterTracks, ...springTracks, ...summerTracks]
    if (allTracks.length > 0 && playlist.length === 0) {
      setPlaylist(allTracks)
      console.log(`✅ Loaded ${allTracks.length} total tracks across all seasons`)
    }
  }, [autumnTracks, winterTracks, springTracks, summerTracks, playlist.length, setPlaylist])
  
  return (
    <div className="min-h-screen pb-64">
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2">Archivo Horizontes Acústicos</h1>
          <p className="text-slate-600 text-center text-xs sm:text-sm">
            
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof typeof CSV_URLS)}>
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-y-6 sm:gap-y-0 p-2">
              <TabsTrigger value="autumn" className="text-xs sm:text-sm truncate">Otoño (S01)</TabsTrigger>
              <TabsTrigger value="winter" className="text-xs sm:text-sm truncate">Invierno (S02)</TabsTrigger>
              <TabsTrigger value="spring" className="text-xs sm:text-sm truncate">Primavera (S03)</TabsTrigger>
              <TabsTrigger value="summer" className="text-xs sm:text-sm truncate">Verano (S04)</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="autumn">
            <SeasonContent csvUrl={CSV_URLS.autumn} season="autumn" />
          </TabsContent>
          
          <TabsContent value="winter">
            <SeasonContent csvUrl={CSV_URLS.winter} season="winter" />
          </TabsContent>
          
          <TabsContent value="spring">
            <SeasonContent csvUrl={CSV_URLS.spring} season="spring" />
          </TabsContent>
          
          <TabsContent value="summer">
            <SeasonContent csvUrl={CSV_URLS.summer} season="summer" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SeasonContent({ csvUrl, season }: { csvUrl: string; season: string }) {
  const { tracks, loading, error } = useCsvAudioData(csvUrl, season)
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
          <p>Loading {season} tracks...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-red-600">
          <p>Error loading {season} tracks:</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return <AudioDataTable data={tracks} />
}
