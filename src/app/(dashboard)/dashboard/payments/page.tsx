import React from 'react';
import PaymentManagement from '@/components/dashboard/payment-management/PaymentManagement';

const PaymentsPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-muted-foreground">
          Track student fee payments
        </p>
      </div>
      <PaymentManagement />
    </div>
  );
};

export default PaymentsPage;
