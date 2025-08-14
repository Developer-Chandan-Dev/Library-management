"use client";

import React, { useState, useCallback } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cancelReservation,
  deleteReservation,
  fulfillReservation,
} from "@/lib/actions/reservations.action";
import { toast } from "sonner";
import { Edit, Trash2 } from "lucide-react";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export type Reservation = {
  $id: string;
  studentId: string;
  studentName: string;
  sheetNumber: number;
  slot: "full_time" | "first_half" | "last_half";
  reservationDate: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "cancelled";
};

const getStatusBadge = (status: Reservation["status"]) => {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
    case "completed":
      return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
    case "cancelled":
      return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
  }
};

const getSlotBadge = (slot: Reservation["slot"]) => {
  switch (slot) {
    case "full_time":
      return (
        <Badge className="bg-purple-500 hover:bg-purple-600">Full Time</Badge>
      );
    case "first_half":
      return (
        <Badge className="bg-yellow-500 hover:bg-yellow-600">First Half</Badge>
      );
    case "last_half":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600">Last Half</Badge>
      );
    default:
      return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
  }
};

// Action cell component to handle state and hooks
const ActionCell = ({ 
  row, 
  refreshData,
  onEditClick
}: { 
  row: Row<Reservation>;
  refreshData: () => void;
  onEditClick: (reservation: Reservation) => void;
}) => {
  const reservation = row.original;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const response = await cancelReservation(reservationId);
      if (response.success) {
        toast.success(response.message);
        refreshData();
      } else {
        toast.error(response.message || "Failed to cancel reservation");
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation");
    }
  };

  const handleFulfillReservation = async (reservationId: string) => {
    try {
      const response = await fulfillReservation(reservationId);
      if (response.success) {
        toast.success(response.message);
        refreshData();
      } else {
        toast.error(response.message || "Failed to fulfill reservation");
      }
    } catch (error) {
      console.error("Error fulfilling reservation:", error);
      toast.error("Failed to fulfill reservation");
    }
  };

  const handleDelete = useCallback(async (permanent: boolean) => {
    setIsDeleting(true);
    const toastId = toast.loading(
      permanent ? "Deleting permanently..." : "Moving to trash...",
      { description: "Please wait while we process your request" }
    );

    try {
      const result = await deleteReservation(reservation.$id, {
        softDelete: !permanent,
      });

      if (result?.success) {
        toast.success(
          permanent ? "Permanently deleted!" : "Reservation moved to trash",
          {
            id: toastId,
            description: `${reservation.studentName}'s reservation has been ${
              permanent ? "permanently removed" : "moved to trash"
            }`,
          }
        );
        refreshData();
      } else {
        throw new Error(result?.message || "Failed to delete reservation");
      }
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : "An error occurred while deleting";
      toast.error("Deletion failed", {
        id: toastId,
        description: errorMessage,
      });
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
    }
  }, [reservation, refreshData]);

  return (
    <div className="flex space-x-2">
      <div className="flex items-center gap-2">
        {reservation.status === "active" && (
          <>
            <Trash2
              className="size-5 text-red-500 hover:text-red-800 transition-all cursor-pointer"
              onClick={() => setDeleteDialogOpen(true)}
              aria-label="Delete reservation"
            />
            
            <Edit
              className="size-5 text-blue-500 hover:text-blue-800 transition-all cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                onEditClick(reservation);
              }}
              aria-label="Edit reservation"
            />
            
            <Button
              className="cursor-pointer"
              variant="outline"
              size="sm"
              onClick={() => handleFulfillReservation(reservation.$id)}
            >
              Fulfill
            </Button>
            
            <Button
              className="cursor-pointer"
              variant="destructive"
              size="sm"
              onClick={() => handleCancelReservation(reservation.$id)}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
      
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={reservation.studentName}
        isLoading={isDeleting}
      />
    </div>
  );
};

export const getColumns = (
  refreshData: () => void,
  onEditClick: (reservation: Reservation) => void
): ColumnDef<Reservation>[] => {
  return [
    {
      accessorKey: "studentName",
      header: "Student Name",
    },
    {
      accessorKey: "sheetNumber",
      header: "Sheet Number",
      cell: ({ row }) => {
        const sheetNumber = row.getValue("sheetNumber") as number;
        return `Sheet #${sheetNumber}`;
      },
    },
    {
      accessorKey: "slot",
      header: "Slot",
      cell: ({ row }) => {
        const slot = row.getValue("slot") as Reservation["slot"];
        return getSlotBadge(slot);
      },
      filterFn: (row, columnId, filterValue) => {
        const slot = row.getValue(columnId) as Reservation["slot"];
        return slot.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      accessorKey: "reservationDate",
      header: "Reservation Date",
      cell: ({ row }) => {
        const date = row.getValue("reservationDate") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }) => {
        const date = row.getValue("startDate") as string;
        return new Date(date).toLocaleDateString();
      },
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }) => {
        const date = row.getValue("endDate") as string | undefined;
        return date ? new Date(date).toLocaleDateString() : "N/A";
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Reservation["status"];
        return getStatusBadge(status);
      },
      filterFn: (row, columnId, filterValue) => {
        const status = row.getValue(columnId) as Reservation["status"];
        return status.toLowerCase().includes(filterValue.toLowerCase());
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionCell 
          row={row} 
          refreshData={refreshData} 
          onEditClick={onEditClick} 
        />
      ),
    },
  ];
};