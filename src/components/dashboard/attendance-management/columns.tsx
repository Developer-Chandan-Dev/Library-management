"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// Define the type for our attendance record
export type AttendanceRecord = {
  $id: string
  studentId: string
  studentName: string
  date: string
  entryTime: string
  exitTime?: string
  duration?: number // in minutes
}

const formatTime = (timeString: string) => {
  return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}

const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export const columns: ColumnDef<AttendanceRecord>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
    filterFn: "includesString", // Enable filtering for this column
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as string
      return formatDate(date)
    },
    filterFn: "includesString", // Enable filtering for this column
  },
  {
    accessorKey: "entryTime",
    header: "Entry Time",
    cell: ({ row }) => {
      const time = row.getValue("entryTime") as string
      return formatTime(time)
    },
  },
  {
    accessorKey: "exitTime",
    header: "Exit Time",
    cell: ({ row }) => {
      const time = row.getValue("exitTime") as string | undefined
      return time ? formatTime(time) : "Still in library"
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.getValue("duration") as number | undefined
      return duration ? formatDuration(duration) : "In progress"
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const exitTime = row.getValue("exitTime") as string | undefined
      return exitTime ? (
        <Badge className="bg-green-500 hover:bg-green-600">Exited</Badge>
      ) : (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">In Library</Badge>
      )
    },
    filterFn: (row, columnId, filterValue) => {
      const exitTime = row.getValue("exitTime") as string | undefined;
      const status = exitTime ? "Exited" : "In Library";
      return status.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
]