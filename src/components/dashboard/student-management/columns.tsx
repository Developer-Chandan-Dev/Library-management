"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student } from "@/types";
import { EditStudentDialog } from "@/components/dashboard/student-management/EditStudentDialog";
import { formatDateTime } from "@/lib/utils";
import ReservationForm from "../reservation-management/ReservationForm";
import { deleteStudent } from "@/lib/actions/students.action";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "father_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Father name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "join_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joining Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const joinDate = row.getValue("join_date");
      return (
        <span>{joinDate ? formatDateTime(joinDate.toString()) : "N/A"}</span>
      );
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "slot",
    header: "Time Slot",
    cell: ({ row }) => {
      const slot = row.getValue("slot");
      const formatted =
        slot === "full_time"
          ? "Full Time"
          : slot === "first_half"
          ? "First Half"
          : "Last Half";

      const color =
        slot === "full_time"
          ? "bg-blue-100 text-blue-800"
          : slot === "first_half"
          ? "bg-amber-100 text-amber-800"
          : "bg-purple-100 text-purple-800";

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {formatted}
        </span>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "sheetNumber",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Assigned Sheet
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const sheet = row.getValue("sheetNumber");
      return sheet ? (
        <span className="font-mono font-bold text-indigo-600 ml-10">
          #{Number(sheet)}
        </span>
      ) : (
        <span className="text-gray-400 italic">None</span>
      );
    },
    filterFn: (row, id, value) => {
      const sheetNumber = row.getValue(id);
      if (!value) return true; // Show all when no filter
      if (!sheetNumber) return false; // Hide if no sheet number

      // Convert both to string for case-insensitive partial matching
      return sheetNumber
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase());
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => {
      const phone = row.getValue("phone");
      return phone || <span className="text-gray-400">-</span>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      const [reservationDialogOpen, setReservationDialogOpen] =
        React.useState(false);
      const [editDialogOpen, setEditDialogOpen] = React.useState(false);
      const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
      const [isDeleting, setIsDeleting] = React.useState(false);

      const handleDelete = async (permanent: boolean) => {
        if (!student.$id) return;

        setIsDeleting(true);
        const toastId = toast.loading(
          permanent ? "Deleting permanently..." : "Moving to trash...",
          { description: "Please wait while we process your request" }
        );

        try {
          const result = await deleteStudent(student.$id, {
            softDelete: !permanent,
          });

          if (result?.success) {
            toast.success(
              permanent ? "Permanently deleted!" : "Student moved to trash",
              {
                id: toastId,
                description: `${student.name} has been ${
                  permanent ? "permanently removed" : "moved to trash"
                }`,
              }
            );
            // refreshData(); // Refresh the table data
          } else {
            throw new Error(result?.message || "Failed to delete student");
          }
        } catch (error: any) {
          toast.error("Deletion failed", {
            id: toastId,
            description: error.message || "An error occurred while deleting",
          });
        } finally {
          setIsDeleting(false);
          setDeleteDialogOpen(false);
        }
      };

      return (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(student.$id || "No ID");
                }}
              >
                Copy ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  setEditDialogOpen(true);
                }}
              >
                Edit Student
              </DropdownMenuItem>
              {!student.sheetNumber && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    setReservationDialogOpen(true);
                  }}
                >
                  Reserve Sheet
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.preventDefault();
                   setDeleteDialogOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

                {/* Use the reusable dialog */}
          <DeleteConfirmationDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={handleDelete}
            itemName={student.name}
            isLoading={isDeleting}
          />

          {/* Dialogs rendered outside dropdown */}
          {editDialogOpen && (
            <EditStudentDialog
              student={student}
              open={editDialogOpen}
              onOpenChange={setEditDialogOpen}
            />
          )}

          <ReservationForm
            mode="add"
            studentData={student}
            open={reservationDialogOpen}
            onOpenChange={setReservationDialogOpen}
          />
        </>
      );
    },
  },
];
