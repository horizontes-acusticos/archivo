'use client'

import React, { useState, useEffect } from 'react'

interface RealTimeDisplayProps {
  filename?: string // Made optional to handle undefined cases
  currentTime: number // Current playback time in seconds
  isPlaying: boolean
  date?: string // Optional date to display
}

export const RealTimeDisplay: React.FC<RealTimeDisplayProps> = ({
  filename,
  currentTime,
  isPlaying,
  date
}) => {
  const [realWorldTime, setRealWorldTime] = useState<string>('')

  // Extract timestamp from filename (last 6 digits before extension)
  const extractTimestamp = (filename: string): string | null => {
    // Check if filename is valid
    if (!filename || typeof filename !== 'string') {
      return null
    }
    
    // Remove file extension and extract last 6 digits
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '')
    const timestampMatch = nameWithoutExt.match(/(\d{6})$/)
    return timestampMatch ? timestampMatch[1] : null
  }

  // Parse HHMMSS timestamp to total seconds from midnight
  const parseTimestamp = (timestamp: string): number => {
    const hours = parseInt(timestamp.substring(0, 2), 10)
    const minutes = parseInt(timestamp.substring(2, 4), 10)
    const seconds = parseInt(timestamp.substring(4, 6), 10)
    return hours * 3600 + minutes * 60 + seconds
  }

  // Convert seconds to HH:MM:SS format
  const formatTime = (totalSeconds: number): string => {
    // Handle day overflow (24+ hours)
    const normalizedSeconds = totalSeconds % (24 * 3600)
    const hours = Math.floor(normalizedSeconds / 3600)
    const minutes = Math.floor((normalizedSeconds % 3600) / 60)
    const seconds = Math.floor(normalizedSeconds % 60)
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  // Calculate real-world time
  useEffect(() => {
    // Early return if no filename
    if (!filename) {
      setRealWorldTime('--:--:--')
      return
    }
    
    const timestamp = extractTimestamp(filename)
    if (!timestamp) {
      setRealWorldTime('--:--:--')
      return
    }

    const recordingStartSeconds = parseTimestamp(timestamp)
    const currentRealWorldSeconds = recordingStartSeconds + Math.floor(currentTime)
    const formattedTime = formatTime(currentRealWorldSeconds)
    
    setRealWorldTime(formattedTime)
  }, [filename, currentTime])

  return (
    <div className="flex items-center space-x-2 text-sm">
      <div className="flex items-center space-x-1">
        <span className="text-slate-500">Hora:</span>
        <span className="font-mono text-slate-800 bg-slate-100 px-2 py-1 rounded">
          {realWorldTime}
        </span>
      </div>
      {date && (
        <span className="text-slate-500 text-xs">
          {date}
        </span>
      )}
      {isPlaying && (
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
      )}
    </div>
  )
}
