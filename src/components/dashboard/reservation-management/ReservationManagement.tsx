"use client";

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { getReservations, cancelReservation } from '@/lib/actions/reservations.action';
import { toast } from 'sonner';

interface Reservation {
  $id: string;
  studentId: string;
  studentName: string;
  sheetNumber: number;
  slot: 'full_time' | 'first_half' | 'last_half';
  reservationDate: string;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'cancelled';
}

const ReservationManagement = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const response = await getReservations();
      if (response.success && response.data) {
        // Type assertion to ensure correct type
        const docs = response.data.documents as unknown as Reservation[];
        setReservations(docs || []);
      } else {
        toast.error(response.message || 'Failed to fetch reservations');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      toast.error('Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const response = await cancelReservation(reservationId);
      if (response.success) {
        toast.success(response.message);
        // Refresh the reservations list
        fetchReservations();
      } else {
        toast.error(response.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('Failed to cancel reservation');
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
      case 'completed':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  const getSlotBadge = (slot: string) => {
    switch (slot) {
      case 'full_time':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Full Time</Badge>;
      case 'first_half':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">First Half</Badge>;
      case 'last_half':
        return <Badge className="bg-orange-500 hover:bg-orange-600">Last Half</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reservations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading reservations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sheet Reservations</CardTitle>
      </CardHeader>
      <CardContent>
        {reservations.length === 0 ? (
          <p className="text-center py-4">No reservations found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Sheet Number</TableHead>
                <TableHead>Slot</TableHead>
                <TableHead>Reservation Date</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.map((reservation) => (
                <TableRow key={reservation.$id}>
                  <TableCell>{reservation.studentName}</TableCell>
                  <TableCell>Sheet #{reservation.sheetNumber}</TableCell>
                  <TableCell>{getSlotBadge(reservation.slot)}</TableCell>
                  <TableCell>
                    {new Date(reservation.reservationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(reservation.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {reservation.endDate 
                      ? new Date(reservation.endDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    {reservation.status === 'active' && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancelReservation(reservation.$id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationManagement;