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
import { getPayments, recordPayment } from '@/lib/actions/payments.action';
import { toast } from 'sonner';

interface Payment {
  $id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'online' | 'other';
  status: 'pending' | 'paid' | 'overdue';
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
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

  const handleRecordPayment = async (paymentId: string) => {
    try {
      const response = await recordPayment({
        paymentId,
        amount: 0, // This should be the payment amount
        paymentDate: new Date().toISOString(),
      });
      
      if (response.success) {
        toast.success(response.message);
        // Refresh the payments list
        fetchPayments();
      } else {
        toast.error(response.message || 'Failed to record payment');
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      toast.error('Failed to record payment');
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case 'cash':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Cash</Badge>;
      case 'bank_transfer':
        return <Badge className="bg-purple-500 hover:bg-purple-600">Bank Transfer</Badge>;
      case 'online':
        return <Badge className="bg-green-500 hover:bg-green-600">Online</Badge>;
      case 'other':
        return <Badge className="bg-gray-500 hover:bg-gray-600">Other</Badge>;
      default:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading payments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {payments.length === 0 ? (
          <p className="text-center py-4">No payments found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.$id}>
                  <TableCell>{payment.studentName}</TableCell>
                  <TableCell>₹{payment.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {new Date(payment.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {payment.paymentDate 
                      ? new Date(payment.paymentDate).toLocaleDateString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{getPaymentMethodBadge(payment.paymentMethod)}</TableCell>
                  <TableCell>{getStatusBadge(payment.status)}</TableCell>
                  <TableCell>
                    {payment.status === 'pending' || payment.status === 'overdue' ? (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => handleRecordPayment(payment.$id)}
                      >
                        Record Payment
                      </Button>
                    ) : null}
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

export default PaymentManagement;