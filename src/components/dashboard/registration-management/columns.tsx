"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { updateRegistrationStatus } from "@/lib/actions/registrations.action"
import { toast } from "sonner"
import { Edit, Trash2 } from 'lucide-react'

// Define the type for our registration record
export type Registration = {
  $id: string
  studentName: string
  fatherName: string
  email: string
  phone: string
  address: string
  registrationDate: string
  status: 'pending' | 'approved' | 'rejected'
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>
    case 'rejected':
      return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>
    default:
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
  }
}

// Export as a function that takes refreshData
export const getColumns = (refreshData: () => void): ColumnDef<Registration>[] => {
  const handleStatusUpdate = async (registrationId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await updateRegistrationStatus(registrationId, status)
      if (response.success) {
        toast.success(response.message)
        refreshData()
      } else {
        toast.error(response.message || 'Failed to update registration status')
      }
    } catch (error) {
      console.error('Error updating registration status:', error)
      toast.error('Failed to update registration status')
    }
  }

  return [
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "fatherName",
      header: "Father's Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "registrationDate",
      header: "Registration Date",
      cell: ({ row }) => {
        const date = row.getValue("registrationDate") as string
        return new Date(date).toLocaleDateString()
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return getStatusBadge(status)
      },
      filterFn: (row, columnId, filterValue) => {
        const status = row.getValue(columnId) as string;
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const registration = row.original
        return (
          <div className="flex gap-2">
            <Trash2
              className="size-5 text-red-500 hover:text-red-700 transition-all cursor-pointer"
             />
             <Edit
              className="size-5 text-blue-500 hover:text-blue-700 transition-all cursor-pointer"
             />
            {registration.status === 'pending' ? (
              <>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleStatusUpdate(registration.$id, 'approved')}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleStatusUpdate(registration.$id, 'rejected')}
                >
                  Reject
                </Button>
              </>
               )
                : null
                }
          </div>
        )
      },
    },
  ]
}