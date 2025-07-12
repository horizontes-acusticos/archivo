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
import { Play, Pause, ArrowUpDown } from "lucide-react"
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
    cell: ({ row }) => {
      const track = row.original
      const { currentTrack, setCurrentTrack, isPlaying, setIsPlaying } = useAudio()
      const isCurrent = currentTrack?.id === track.id

      const handlePlayTrack = () => {
        if (isCurrent) {
          setIsPlaying(!isPlaying)
        } else {
          setCurrentTrack(track)
          setIsPlaying(true)
        }
      }

      return (
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePlayTrack}
          className="h-8 w-8"
        >
          {isCurrent && isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => <span className="font-medium">{row.index + 1}</span>,
    enableSorting: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("title")}</div>,
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => <div>{row.getValue("artist")}</div>,
  },
  {
    accessorKey: "duration",
    header: () => <div className="text-right">Duration</div>,
    cell: ({ row }) => (
      <div className="text-right">{row.getValue("duration") ?? "3:24"}</div>
    ),
  },
]

interface AudioDataTableProps {
  data: AudioTrack[]
}

export function AudioDataTable({ data }: AudioDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filter, setFilter] = React.useState("")

  // Filter tracks by title or artist
  const filteredData = React.useMemo(
    () =>
      data.filter(
        (track) =>
          track.title.toLowerCase().includes(filter.toLowerCase()) ||
          track.artist.toLowerCase().includes(filter.toLowerCase())
      ),
    [data, filter]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
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
    </div>
  )
}