import { AudioTrack } from '@/context/AudioContext'

// Dummy audio data with placeholder URLs
// In a real app, these would be actual audio files from DigitalOcean Spaces or another CDN
const createDummyTracks = (season: string): AudioTrack[] => {
  const tracks: AudioTrack[] = []
  
  for (let i = 1; i <= 24; i++) {
    tracks.push({
      id: `${season.toLowerCase()}-${i}`,
      filename: `${season} Symphony No. ${i}`,
      place: `Nature Orchestra`,
      date: `2023-03-15`,
      length: `1:00:00`,
      link: `https://example-spaces.nyc3.digitaloceanspaces.com/audio/${season.toLowerCase()}/track-${i}.mp3`,
      isAvailable: "TRUE"
    })
  }
  
  return tracks
}

export const audioData = {
  autumn: createDummyTracks('Autumn'),
  winter: createDummyTracks('Winter'),
  spring: createDummyTracks('Spring'),
  summer: createDummyTracks('Summer'),
}

export const getAllTracks = (): AudioTrack[] => {
  return [
    ...audioData.autumn,
    ...audioData.winter,
    ...audioData.spring,
    ...audioData.summer,
  ]
}
