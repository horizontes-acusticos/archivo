'use client'

import React, { useState } from 'react'
import { AudioDataTable } from '@/components/AudioDataTable'
import { useAudioStore, AudioTrack } from '@/stores/audioStore'
import { useAllCsvData } from "@/hooks/useAllCsvData"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type SeasonKey = 'autumn' | 'winter' | 'spring' | 'summer' 

export default function Home() {
  const [activeTab, setActiveTab] = useState<SeasonKey>('autumn')
  const { playlist, setPlaylist } = useAudioStore()
  
  // Use the new reliable CSV loader
  const { 
    allTracks, 
    loading: allLoading, 
    errors,
    autumnTracks,
    winterTracks,
    springTracks,
    summerTracks
  } = useAllCsvData()
  
  // Set global playlist when all data is loaded
  React.useEffect(() => {
    console.log('🏠 Page effect triggered')
    console.log('🏠 All CSV loading state:', allLoading)
    console.log('🏠 Errors:', errors)
    console.log('🏠 Total tracks loaded:', allTracks.length)
    console.log('🏠 Track counts by season:', {
      autumn: autumnTracks.length,
      winter: winterTracks.length,
      spring: springTracks.length,
      summer: summerTracks.length
    })
    
    // Only set playlist when loading is complete and we have tracks
    if (!allLoading && allTracks.length > 0 && playlist.length === 0) {
      console.log('🏠 Setting playlist with', allTracks.length, 'tracks from all seasons')
      console.log('🏠 First track from each season:')
      console.log('  - Autumn:', autumnTracks[0]?.filename, autumnTracks[0]?.id)
      console.log('  - Winter:', winterTracks[0]?.filename, winterTracks[0]?.id)
      console.log('  - Spring:', springTracks[0]?.filename, springTracks[0]?.id)
      console.log('  - Summer:', summerTracks[0]?.filename, summerTracks[0]?.id)
      
      setPlaylist(allTracks)
      console.log('✅ Playlist set successfully with all seasons')
    } else if (!allLoading && allTracks.length === 0) {
      console.log('⚠️ No tracks loaded after CSV processing completed')
    } else if (allLoading) {
      console.log('⏳ Still loading CSV data...')
    } else if (playlist.length > 0) {
      console.log('� Playlist already exists with', playlist.length, 'tracks')
    }
  }, [allTracks, allLoading, playlist.length, setPlaylist, autumnTracks, winterTracks, springTracks, summerTracks, errors])
  
  return (
    <div className="min-h-screen pb-64">
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-4">
        <header className="mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold text-center mb-2">Dispositivo Aural de Escucha Compartida</h1>
          <p className="text-slate-600 text-center text-xs sm:text-sm">
            Una travesía por el bosque templado lluvioso de la cordillera de la costa de Valdivia, 350 horas de audio grabados a lo largo de las cuatro estaciones del 2023.
          </p>
        </header>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SeasonKey)}>
          <div className="mb-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-y-6 sm:gap-y-0 p-2">
              <TabsTrigger value="autumn" className="text-xs sm:text-sm truncate">
                Otoño
              </TabsTrigger>
              <TabsTrigger value="winter" className="text-xs sm:text-sm truncate">
                Invierno
              </TabsTrigger>
              <TabsTrigger value="spring" className="text-xs sm:text-sm truncate">
                Primavera
              </TabsTrigger>
              <TabsTrigger value="summer" className="text-xs sm:text-sm truncate">
                Verano
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="autumn">
            <SeasonContent 
              tracks={autumnTracks} 
              season="autumn" 
              loading={allLoading} 
              error={errors.autumn} 
            />
          </TabsContent>
          
          <TabsContent value="winter">
            <SeasonContent 
              tracks={winterTracks} 
              season="winter" 
              loading={allLoading} 
              error={errors.winter} 
            />
          </TabsContent>
          
          <TabsContent value="spring">
            <SeasonContent 
              tracks={springTracks} 
              season="spring" 
              loading={allLoading} 
              error={errors.spring} 
            />
          </TabsContent>
          
          <TabsContent value="summer">
            <SeasonContent 
              tracks={summerTracks} 
              season="summer" 
              loading={allLoading} 
              error={errors.summer} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function SeasonContent({ tracks, season, loading, error }: { 
  tracks: AudioTrack[]; 
  season: string; 
  loading: boolean; 
  error?: string; 
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-600 mx-auto mb-2"></div>
          <p>Loading all seasons...</p>
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

  if (tracks.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center text-amber-600">
          <p>No tracks found for {season}</p>
        </div>
      </div>
    )
  }

  return <AudioDataTable data={tracks} />
}
