'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AudioTable } from '@/components/AudioTable'
import { AudioPlayer } from '@/components/AudioPlayer'
import { AudioProvider } from '@/context/AudioContext'
import { audioData } from '@/data/audioData'

export default function Home() {
  return (
    <AudioProvider>
      <div className="min-h-screen pb-64"> {/* Add padding bottom for fixed player */}
        <div className="container mx-auto py-8 px-4">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-center mb-2">Archivo</h1>
            <p className="text-slate-600 text-center">
              Seasonal Audio Collection with Spectrogram Analysis
            </p>
          </header>

          <Tabs defaultValue="autumn" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="autumn">Autumn</TabsTrigger>
              <TabsTrigger value="winter">Winter</TabsTrigger>
              <TabsTrigger value="spring">Spring</TabsTrigger>
              <TabsTrigger value="summer">Summer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="autumn" className="mt-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Autumn Collection</h2>
                <p className="text-slate-600">Warm and melancholic sounds of the falling season</p>
              </div>
              <AudioTable tracks={audioData.autumn} />
            </TabsContent>
            
            <TabsContent value="winter" className="mt-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Winter Collection</h2>
                <p className="text-slate-600">Crisp and serene sounds of the cold season</p>
              </div>
              <AudioTable tracks={audioData.winter} />
            </TabsContent>
            
            <TabsContent value="spring" className="mt-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Spring Collection</h2>
                <p className="text-slate-600">Fresh and vibrant sounds of renewal</p>
              </div>
              <AudioTable tracks={audioData.spring} />
            </TabsContent>
            
            <TabsContent value="summer" className="mt-6">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Summer Collection</h2>
                <p className="text-slate-600">Bright and energetic sounds of the warm season</p>
              </div>
              <AudioTable tracks={audioData.summer} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AudioPlayer />
    </AudioProvider>
  )
}
