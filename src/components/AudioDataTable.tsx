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
  { accessorKey: "id", header: "ID", enableSorting: false },
  { accessorKey: "place", header: "Place", enableSorting: true },
  { accessorKey: "date", header: "Date", enableSorting: true },
  { accessorKey: "filename", header: "Filename", enableSorting: true },
  { accessorKey: "length", header: "Length", enableSorting: true },
];

interface AudioDataTableProps {
  data: AudioTrack[]
  currentTab?: string
}

export function AudioDataTable({ data, currentTab }: AudioDataTableProps) {
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

  const { currentTrack, setCurrentTrack } = useAudio()

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtro..."
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
                
                // Simple check: is this track the currently playing one?
                const isPlaying = currentTrack?.id === track.id
                
                const handleRowDoubleClick = () => {
                  setCurrentTrack(track)
                }
                
                // Touch handling for mobile
                let touchTimeout: NodeJS.Timeout
                let touchCount = 0
                
                const handleTouchStart = (e: React.TouchEvent) => {
                  e.preventDefault()
                  touchCount++
                  
                  if (touchCount === 1) {
                    touchTimeout = setTimeout(() => {
                      // Single tap - do nothing for now
                      touchCount = 0
                    }, 300)
                  } else if (touchCount === 2) {
                    clearTimeout(touchTimeout)
                    setCurrentTrack(track)
                    touchCount = 0
                  }
                }
                
                const handleRowClick = () => {
                  // Single click - do nothing for now
                }
                
                // Determine row styling based on state
                let rowClassName = "cursor-pointer transition-colors select-none touch-manipulation "
                if (isPlaying) {
                  rowClassName += "bg-slate-900 text-white hover:bg-slate-800"
                } else {
                  rowClassName += "hover:bg-slate-50"
                }
                
                return (
                  <TableRow
                    key={row.id}
                    className={rowClassName}
                    onClick={handleRowClick}
                    onDoubleClick={handleRowDoubleClick}
                    onTouchStart={handleTouchStart}
                    style={{ touchAction: 'manipulation' }}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell 
                        key={cell.id}
                        className={isPlaying ? "text-white" : ""}
                      >
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
      {table.getPageCount() > 1 && (
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
      )}
      {/* SpectrogramPlayer removed: component not found */}
    </div>
  )
}