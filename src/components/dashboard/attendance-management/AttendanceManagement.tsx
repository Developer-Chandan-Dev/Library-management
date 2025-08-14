"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAttendanceRecords } from '@/lib/actions/attendance.action';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/data-table';
import { columns, AttendanceRecord } from './columns';

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await getAttendanceRecords();
      if (response.success && response.data) {
        // Type assertion to ensure correct type
        const docs = response.data.documents as unknown as AttendanceRecord[];
        setAttendanceRecords(docs || []);
      } else {
        toast.error(response.message || 'Failed to fetch attendance records');
      }
    } catch (error) {
      console.error('Error fetching attendance records:', error);
      toast.error('Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={attendanceRecords}
          refreshData={fetchAttendanceRecords}
          isLoading={loading}
          searchableColumns={[
            {
              id: "studentName",
              placeholder: "Search student name...",
            },
          ]}
        />
      </CardContent>
    </Card>
  );
};

export default AttendanceManagement;