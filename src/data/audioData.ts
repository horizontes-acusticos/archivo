import { AudioTrack } from '@/context/AudioContext'

// Dummy audio data with placeholder URLs
// In a real app, these would be actual audio files from DigitalOcean Spaces or another CDN
const createDummyTracks = (season: string): AudioTrack[] => {
  const tracks: AudioTrack[] = []
  
  for (let i = 1; i <= 24; i++) {
    tracks.push({
      id: `${season.toLowerCase()}-${i}`,
      title: `${season} Symphony No. ${i}`,
      artist: `Nature Orchestra`,
      season,
      url: `https://example-spaces.nyc3.digitaloceanspaces.com/audio/${season.toLowerCase()}/track-${i}.mp3`,
      spectrogramUrl: `https://example-spaces.nyc3.digitaloceanspaces.com/spectrograms/${season.toLowerCase()}/track-${i}.json`
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
