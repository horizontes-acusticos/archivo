"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table"
import { Play, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AudioTrack, useAudio } from "@/context/AudioContext"

export const columns: ColumnDef<AudioTrack>[] = [
  {
    id: "play",
    header: "Play",
    cell: ({ row }) => <AudioPlayCell track={row.original} />,
    enableSorting: false,
  },
  { accessorKey: "id", header: "ID", enableSorting: false },
  { accessorKey: "place", header: "Place", enableSorting: true },
  { accessorKey: "date", header: "Date", enableSorting: true },
  { accessorKey: "filename", header: "Filename", enableSorting: true },
  { accessorKey: "length", header: "Length", enableSorting: true },
  {
    accessorKey: "link",
    header: "Audio",
    cell: ({ row }) => {
      const defaultUrl = "https://archivo-prod.sfo3.cdn.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3";
      const audioUrl = row.original.link || defaultUrl;
      return (
        <a
          href={audioUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          Listen
        </a>
      );
    },
    enableSorting: false,
  },
];

function AudioPlayCell({ track }: { track: AudioTrack }) {
  const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying } = useAudio();
  const isCurrent = currentTrack?.id === track.id;
  const defaultUrl = "https://archivo-prod.sfo3.cdn.digitaloceanspaces.com/audio/s01/S4A11192_20230315_150854.mp3";
  
  const handlePlayTrack = () => {
    // Create track with fallback URL for playing
    const trackWithUrl = {
      ...track,
      link: track.link || defaultUrl
    };
    setCurrentTrack(trackWithUrl);
    setIsPlaying(true);
  };
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handlePlayTrack}
      className="h-8 w-8"
      disabled={track.isAvailable !== "TRUE"}
    >
      {isCurrent && isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
    </Button>
  );
}

interface AudioDataTableProps {
  data: AudioTrack[]
}

export function AudioDataTable({ data }: AudioDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filter, setFilter] = React.useState("")

  // Only show available tracks
  const availableData = React.useMemo(
    () => data.filter(track => track.isAvailable === "TRUE"),
    [data]
  )

  // Filter by place, date, filename, length
  const filteredData = React.useMemo(
    () =>
      availableData.filter(
        (track) =>
          (track.place?.toLowerCase() ?? "").includes(filter.toLowerCase()) ||
          (track.date?.toLowerCase() ?? "").includes(filter.toLowerCase()) ||
          (track.filename?.toLowerCase() ?? "").includes(filter.toLowerCase()) ||
          (track.length?.toLowerCase() ?? "").includes(filter.toLowerCase())
      ),
    [availableData, filter]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 48, // Show 48 files per page
      },
    },
  })

  const { currentTrack } = useAudio()

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter by title or artist..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => {
                const track = row.original
                const isCurrent = currentTrack?.id === track.id
                return (
                  <TableRow
                    key={row.id}
                    className={isCurrent ? "bg-slate-50" : ""}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </Button>
        <Button
          variant="outline"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </Button>
        <Button
          variant="outline"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </Button>
        <Button
          variant="outline"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </Button>
      </div>
      <div className="py-4">
        {currentTrack && (
          <div>
            <h3 className="font-semibold text-lg">{currentTrack.filename}</h3>
            <p className="text-slate-600">{currentTrack.place}</p>
          </div>
        )}
      </div>
      {/* SpectrogramPlayer removed: component not found */}
    </div>
  )
}