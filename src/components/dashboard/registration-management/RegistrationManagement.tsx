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
import { getRegistrations, updateRegistrationStatus } from '@/lib/actions/registrations.action';
import { toast } from 'sonner';

interface Registration {
  $id: string;
  studentName: string;
  fatherName: string;
  email: string;
  phone: string;
  address: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = async () => {
    try {
      const response = await getRegistrations();
      if (response.success && response.data) {
        // Type assertion to ensure correct type
        const docs = response.data.documents as unknown as Registration[];
        setRegistrations(docs || []);
      } else {
        toast.error(response.message || 'Failed to fetch registrations');
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
      toast.error('Failed to fetch registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (registrationId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await updateRegistrationStatus(registrationId, status);
      if (response.success) {
        toast.success(response.message);
        // Refresh the registrations list
        fetchRegistrations();
      } else {
        toast.error(response.message || 'Failed to update registration status');
      }
    } catch (error) {
      console.error('Error updating registration status:', error);
      toast.error('Failed to update registration status');
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500 hover:bg-green-600">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500 hover:bg-red-600">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading registrations...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        {registrations.length === 0 ? (
          <p className="text-center py-4">No registrations found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Father's Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrations.map((registration) => (
                <TableRow key={registration.$id}>
                  <TableCell>{registration.studentName}</TableCell>
                  <TableCell>{registration.fatherName}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.phone}</TableCell>
                  <TableCell>
                    {new Date(registration.registrationDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(registration.status)}</TableCell>
                  <TableCell>
                    {registration.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleStatusUpdate(registration.$id, 'approved')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleStatusUpdate(registration.$id, 'rejected')}
                        >
                          Reject
                        </Button>
                      </div>
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

export default RegistrationManagement;