"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { recordPayment } from "@/lib/actions/payments.action"
import { toast } from "sonner"

// Define the type for our payment record
export type Payment = {
  $id: string
  studentId: string
  studentName: string
  amount: number
  dueDate: string
  paymentDate?: string
  paymentMethod: 'cash' | 'bank_transfer' | 'online' | 'other'
  status: 'pending' | 'paid' | 'overdue'
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
    case 'pending':
      return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
    case 'overdue':
      return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>
  }
}

const getPaymentMethodBadge = (method: string) => {
  switch (method) {
    case 'cash':
      return <Badge className="bg-blue-500 hover:bg-blue-600">Cash</Badge>
    case 'bank_transfer':
      return <Badge className="bg-purple-500 hover:bg-purple-600">Bank Transfer</Badge>
    case 'online':
      return <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>
    case 'other':
      return <Badge className="bg-gray-500 hover:bg-gray-600">Other</Badge>
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>
  }
}

const handleRecordPayment = async (paymentId: string, refreshData: () => void) => {
  try {
    const response = await recordPayment({
      paymentId,
      amount: 0, // This should be the payment amount
      paymentDate: new Date().toISOString(),
    })
    
    if (response.success) {
      toast.success(response.message)
      // Refresh the payments list
      refreshData()
    } else {
      toast.error(response.message || 'Failed to record payment')
    }
  } catch (error) {
    console.error('Error recording payment:', error)
    toast.error('Failed to record payment')
  }
}

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "studentName",
    header: "Student Name",
    filterFn: "includesString",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number
      return `₹${amount.toFixed(2)}`
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const date = row.getValue("dueDate") as string
      return new Date(date).toLocaleDateString()
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "paymentDate",
    header: "Payment Date",
    cell: ({ row }) => {
      const date = row.getValue("paymentDate") as string | undefined
      return date ? new Date(date).toLocaleDateString() : 'N/A'
    },
    filterFn: "includesString",
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string
      return getPaymentMethodBadge(method)
    },
    filterFn: (row, columnId, filterValue) => {
      const method = row.getValue("paymentMethod") as string;
      const methodLabels: Record<string, string> = {
        'cash': 'Cash',
        'bank_transfer': 'Bank Transfer',
        'online': 'Online',
        'other': 'Other'
      };
      const label = methodLabels[method] || method;
      return label.toLowerCase().includes(filterValue.toLowerCase());
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
      const status = row.getValue("status") as string;
      const statusLabels: Record<string, string> = {
        'paid': 'Paid',
        'pending': 'Pending',
        'overdue': 'Overdue'
      };
      const label = statusLabels[status] || status;
      return label.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original
      const refreshData = () => {
        // This will be provided by the DataTable component
        // For now, we'll just log it
      }
      
      return payment.status === 'pending' || payment.status === 'overdue' ? (
        <Button
          size="sm"
          variant="default"
          onClick={() => handleRecordPayment(payment.$id, refreshData)}
        >
          Record Payment
        </Button>
      ) : null
    },
  },
]