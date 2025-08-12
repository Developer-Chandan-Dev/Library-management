import React from 'react';
import ReservationManagement from '@/components/dashboard/reservation-management/ReservationManagement';

const ReservationsPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reservations</h1>
        <p className="text-muted-foreground">
          Manage sheet reservations
        </p>
      </div>
      <ReservationManagement />
    </div>
  );
};

export default ReservationsPage;
