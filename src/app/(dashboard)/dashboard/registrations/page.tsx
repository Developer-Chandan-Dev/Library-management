import React from 'react';
import RegistrationManagement from '@/components/dashboard/registration-management/RegistrationManagement';

const RegistrationsPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Registrations</h1>
        <p className="text-muted-foreground">
          Manage student registrations
        </p>
      </div>
      <RegistrationManagement />
    </div>
  );
};

export default RegistrationsPage;