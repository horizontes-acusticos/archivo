import React from 'react'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AudioTrack, useAudio } from '@/context/AudioContext'
import { Play, Pause } from 'lucide-react'

interface AudioTableProps {
  tracks: AudioTrack[]
}

export const AudioTable: React.FC<AudioTableProps> = ({ tracks }) => {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying } = useAudio()

  const handlePlayTrack = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      setIsPlaying(!isPlaying)
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const isCurrentTrack = (track: AudioTrack) => currentTrack?.id === track.id

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Play</TableHead>
            <TableHead>Track</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead className="text-right">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="p-0">
          {tracks.length > 0 ? (
            tracks.map((track, index) => (
              <TableRow 
                key={track.id}
                className={`${isCurrentTrack(track) ? 'bg-slate-50' : ''} transition-colors`}
              >
                <TableCell className="py-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePlayTrack(track)}
                    className="h-8 w-8"
                  >
                    {isCurrentTrack(track) && isPlaying ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium py-2">{index + 1}</TableCell>
                <TableCell className="py-2">{track.filename}</TableCell>
                <TableCell className="py-2">{track.place}</TableCell>
                <TableCell className="text-right py-2">3:24</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No tracks available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
