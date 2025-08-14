"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getRegistrations } from '@/lib/actions/registrations.action';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { getColumns, Registration } from './columns';

const RegistrationManagement = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRegistrations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getRegistrations();
      if (response.success && response.data) {
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
  }, []);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  // Create columns with refreshData function
  const columns = getColumns(fetchRegistrations);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Registrations</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={registrations}
          isLoading={loading}
          searchableColumns={[
            {
              id: "studentName",
              placeholder: "Search student name...",
            },
            {
              id: "fatherName",
              placeholder: "Search father's name...",
            },
            {
              id: "email",
              placeholder: "Search email...",
            },
          ]}
          filterableColumns={[
            {
              id: "status",
              title: "Status",
              options: [
                { value: "pending", label: "Pending" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ],
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default RegistrationManagement;