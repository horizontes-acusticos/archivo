import { useEffect, useState } from "react"
import Papa from "papaparse"
import { AudioTrack } from "@/stores/audioStore"

const BASE_URL = "https://archivo-prod.sfo3.digitaloceanspaces.com/audio"

export function useCsvAudioData(csvUrl: string, season?: string) {
  const [tracks, setTracks] = useState<AudioTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log(`📊 Loading CSV for ${season}:`, csvUrl)
    setLoading(true)
    setError(null)
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      complete: (results) => {
        console.log(`📊 CSV loaded for ${season}:`, results.data.length, 'rows')
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
        console.log(`📊 Mapped ${mapped.length} tracks for ${season}`)
        setTracks(mapped)
        setLoading(false)
      },
      error: (err) => {
        console.error(`❌ CSV error for ${season}:`, err.message)
        setError(err.message)
        setLoading(false)
      }
    })
  }, [csvUrl, season])

  return { tracks, loading, error }
}