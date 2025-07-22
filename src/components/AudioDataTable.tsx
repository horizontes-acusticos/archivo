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
  VisibilityState,
} from "@tanstack/react-table"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    accessorKey: "id", 
    header: "ID", 
    enableSorting: false,
    enableHiding: true,
  },
  { 
    accessorKey: "place", 
    header: "Place", 
    enableSorting: true,
    enableHiding: true,
  },
  { 
    accessorKey: "date", 
    header: "Date", 
    enableSorting: true,
    enableHiding: true,
  },
  { 
    accessorKey: "filename", 
    header: "Filename", 
    enableSorting: true,
    enableHiding: false, // Always show filename as it's the most important
  },
  { 
    accessorKey: "length", 
    header: "Length", 
    enableSorting: true,
    enableHiding: true,
  },
];

interface AudioDataTableProps {
  data: AudioTrack[]
}

export function AudioDataTable({ data }: AudioDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [filter, setFilter] = React.useState("")
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

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
    state: { 
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
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
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Filtrar por lugar, fecha, archivo o duración..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="max-w-md"
          />
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto h-8">
              <ChevronDown className="h-4 w-4" />
              Columnas
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[150px] bg-white border shadow-md">
            <DropdownMenuLabel>Mostrar columnas</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                )
              })}
          </DropdownMenuContent>
        </DropdownMenu>
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
                
                // Touch handling for mobile double-tap
                let touchTimeout: NodeJS.Timeout
                let touchCount = 0
                
                const handleTouchStart = (e: React.TouchEvent) => {
                  e.preventDefault()
                  touchCount++
                  
                  if (touchCount === 1) {
                    touchTimeout = setTimeout(() => {
                      touchCount = 0
                    }, 300)
                  } else if (touchCount === 2) {
                    clearTimeout(touchTimeout)
                    setCurrentTrack(track)
                    touchCount = 0
                  }
                }
                
                // Determine row styling
                const rowClassName = isPlaying
                  ? "cursor-pointer transition-colors select-none touch-manipulation bg-slate-900 text-white hover:bg-slate-800"
                  : "cursor-pointer transition-colors select-none touch-manipulation hover:bg-slate-50"
                
                return (
                  <TableRow
                    key={row.id}
                    className={rowClassName}
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
                <TableCell colSpan={table.getVisibleLeafColumns().length} className="h-24 text-center">
                  Sin resultados.
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