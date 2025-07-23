import { useEffect, useState } from "react"
import Papa from "papaparse"
import { AudioTrack } from "@/stores/audioStore"

const BASE_URL = "https://archivo-prod.sfo3.digitaloceanspaces.com/audio"

type CsvRow = {
  id: string;
  place: string;
  date: string;
  filename: string;
  lenght: string;
  link: string;
  isAvalable?: string;
  isAvailable?: string;
};

type SeasonData = {
  season: string;
  tracks: AudioTrack[];
  error?: string;
}

const CSV_URLS = {
  autumn: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s01.csv",
  winter: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s02.csv",
  spring: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s03.csv",
  summer: "https://archivo-prod.sfo3.digitaloceanspaces.com/audio/s04.csv"
}

// Helper function to load a single CSV file
async function loadSeasonCsv(csvUrl: string, season: string, retries = 3): Promise<SeasonData> {
  return new Promise((resolve) => {
    console.log(`📊 Loading CSV for ${season} (attempt ${4 - retries}):`, csvUrl)
    
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      downloadRequestHeaders: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      complete: (results) => {
        console.log(`📊 CSV loaded for ${season}:`, results.data.length, 'rows')
        
        if (results.errors.length > 0) {
          console.error(`❌ CSV parse errors for ${season}:`, results.errors)
          if (retries > 0) {
            console.log(`🔄 Retrying ${season} CSV load...`)
            setTimeout(() => {
              loadSeasonCsv(csvUrl, season, retries - 1).then(resolve)
            }, 1000)
            return
          } else {
            resolve({
              season,
              tracks: [],
              error: `Parse errors: ${results.errors.map(e => e.message).join(', ')}`
            })
            return
          }
        }
        
        const mapped = (results.data as CsvRow[])
          .filter(row => row.id && row.filename) // Filter out empty rows
          .map(row => ({
            id: row.id,
            place: row.place,
            date: row.date,
            filename: row.filename,
            length: row.lenght, // CSV uses 'lenght'
            link: BASE_URL + row.link,
            isAvailable: row.isAvalable ?? row.isAvailable ?? "TRUE",
            season: season,
          }))
        
        console.log(`✅ Mapped ${mapped.length} tracks for ${season}`)
        resolve({
          season,
          tracks: mapped
        })
      },
      error: (error) => {
        console.error(`❌ CSV download error for ${season}:`, error)
        if (retries > 0) {
          console.log(`🔄 Retrying ${season} CSV load...`)
          setTimeout(() => {
            loadSeasonCsv(csvUrl, season, retries - 1).then(resolve)
          }, 1000)
        } else {
          resolve({
            season,
            tracks: [],
            error: `Download error: ${error.message}`
          })
        }
      }
    })
  })
}

export function useAllCsvData() {
  const [allTracks, setAllTracks] = useState<AudioTrack[]>([])
  const [seasonData, setSeasonData] = useState<Record<string, AudioTrack[]>>({
    autumn: [],
    winter: [],
    spring: [],
    summer: []
  })
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const loadAllCsvData = async () => {
      console.log('🚀 Starting to load all CSV files...')
      setLoading(true)
      setErrors({})
      
      try {
        // Load all CSV files in parallel with Promise.all
        const promises = Object.entries(CSV_URLS).map(([season, url]) =>
          loadSeasonCsv(url, season)
        )
        
        console.log('⏳ Waiting for all CSV files to load...')
        const results = await Promise.all(promises)
        
        // Process results
        const newSeasonData: Record<string, AudioTrack[]> = {}
        const newErrors: Record<string, string> = {}
        let totalTracks: AudioTrack[] = []
        
        results.forEach(result => {
          newSeasonData[result.season] = result.tracks
          if (result.error) {
            newErrors[result.season] = result.error
          }
          totalTracks = [...totalTracks, ...result.tracks]
        })
        
        console.log('🎯 All CSV files processed:')
        console.log('📊 Track counts by season:', {
          autumn: newSeasonData.autumn.length,
          winter: newSeasonData.winter.length,
          spring: newSeasonData.spring.length,
          summer: newSeasonData.summer.length,
          total: totalTracks.length
        })
        
        setSeasonData(newSeasonData)
        setAllTracks(totalTracks)
        setErrors(newErrors)
        setLoading(false)
        
        console.log('✅ All CSV data loaded successfully!')
        
      } catch (error) {
        console.error('💥 Failed to load CSV data:', error)
        setLoading(false)
      }
    }

    loadAllCsvData()
  }, [])

  return {
    allTracks,
    seasonData,
    loading,
    errors,
    // Individual season accessors for backward compatibility
    autumnTracks: seasonData.autumn,
    winterTracks: seasonData.winter,
    springTracks: seasonData.spring,
    summerTracks: seasonData.summer
  }
}
