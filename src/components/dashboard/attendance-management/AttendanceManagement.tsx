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
import { getAttendanceRecords } from '@/lib/actions/attendance.action';
import { toast } from 'sonner';

interface AttendanceRecord {
  $id: string;
  studentId: string;
  studentName: string;
  date: string;
  entryTime: string;
  exitTime?: string;
  duration?: number; // in minutes
}

const AttendanceManagement = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendanceRecords = async () => {
    try {
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

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading attendance records...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        {attendanceRecords.length === 0 ? (
          <p className="text-center py-4">No attendance records found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Entry Time</TableHead>
                <TableHead>Exit Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.$id}>
                  <TableCell>{record.studentName}</TableCell>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell>{formatTime(record.entryTime)}</TableCell>
                  <TableCell>
                    {record.exitTime ? formatTime(record.exitTime) : 'Still in library'}
                  </TableCell>
                  <TableCell>
                    {record.duration ? formatDuration(record.duration) : 'In progress'}
                  </TableCell>
                  <TableCell>
                    {record.exitTime ? (
                      <Badge className="bg-green-500 hover:bg-green-600">Exited</Badge>
                    ) : (
                      <Badge className="bg-yellow-500 hover:bg-yellow-600">In Library</Badge>
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

export default AttendanceManagement;