"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Student} from "@/types";
import {EditStudentDialog} from "@/components/dashboard/student-management/EditStudentDialog";

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
    header: "Assigned Sheet",
    cell: ({ row }) => {
      const sheet = row.getValue("sheetNumber");
      return sheet ? (
        <span className="font-mono font-bold text-indigo-600">#{Number(sheet)}</span>
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
      return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(student.$id))}>
                Copy ID
              </DropdownMenuItem>
              <EditStudentDialog
                  student={student}
                  onStudentUpdated={(updatedStudent) => {
                    // Handle update in your data table
                    console.log("Updated student:", updatedStudent);
                  }}
              />
              <DropdownMenuItem className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
      );
    },
  },
];

// const