"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getReservations } from "@/lib/actions/reservations.action"; // Make sure this exists
import { toast } from "sonner";
import { DataTable } from "@/components/ui/data-table";
import { getColumns, Reservation } from "./columns"; // Correct import
import ReservationForm from "./ReservationForm";

const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);

  // Create a stable refresh function
  const fetchReservations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getReservations(); // Make sure this function exists

      if (response.success && response.data) {
        const docs = response.data.documents as unknown as Reservation[];
        setReservations(docs || []);
      } else {
        toast.error(response.message || "Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
      toast.error("Failed to fetch reservations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleEditClick = useCallback((reservation: Reservation) => {
    setCurrentReservation(reservation);
    setIsDialogOpen(true);
}, []);

  // Create columns with refreshData function
  const columns = getColumns(fetchReservations, handleEditClick);

  // const handleDelete = async (reservationId: string) => {
  //   try {
  //     const result = await deleteReservation(reservationId);

  //     if (result.success) {
  //       toast.success(result.message);

  //       // Update context to reflect freed sheet
  //       updateSheet(
  //         reservation.sheetNumber,
  //         reservation.slot,
  //         "" // Empty name to clear slot
  //       );

  //       refreshData(); // Refresh your reservations list
  //     } else {
  //       throw new Error(result.message);
  //     }
  //   } catch (error) {
  //     toast.error(error.message || "Failed to delete reservation");
  //   }
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Reservation Management</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={reservations}
          isLoading={loading}
          searchableColumns={[
            {
              id: "studentName",
              placeholder: "Search student name...",
            },
            {
              id: "sheetNumber",
              placeholder: "Search sheet number...",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { value: "active", label: "Active" },
                { value: "completed", label: "Completed" },
                { value: "cancelled", label: "Cancelled" },
              ],
            },
            {
              id: "slot",
              title: "Time Slot",
              options: [
                { value: "full_time", label: "Full Time" },
                { value: "first_half", label: "First Half" },
                { value: "last_half", label: "Last Half" },
              ],
            },
          ]}
        />

        {currentReservation && (
          <ReservationForm
            mode="edit"
            reservationData={currentReservation}
            open={isDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setCurrentReservation(null);
              }
              setIsDialogOpen(open);
            }}
            // onSuccess={() => {
            //   fetchReservations();
            //   setIsDialogOpen(false);
            //   setCurrentReservation(null);
            // }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationManagement;
