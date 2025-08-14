"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getPayments } from '@/lib/actions/payments.action';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { columns, Payment } from './columns';

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await getPayments();
      if (response.success && response.data) {
        // Type assertion to ensure correct type
        const docs = response.data.documents as unknown as Payment[];
        setPayments(docs || []);
      } else {
        toast.error(response.message || 'Failed to fetch payments');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={payments}
          refreshData={fetchPayments}
          isLoading={loading}
          searchableColumns={[
            {
              id: "studentName",
              placeholder: "Search student name...",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { value: "paid", label: "Paid" },
                { value: "pending", label: "Pending" },
                { value: "overdue", label: "Overdue" },
              ],
            },
            {
              id: "paymentMethod",
              title: "Payment Method",
              options: [
                { value: "cash", label: "Cash" },
                { value: "bank_transfer", label: "Bank Transfer" },
                { value: "online", label: "Online" },
                { value: "other", label: "Other" },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentManagement;