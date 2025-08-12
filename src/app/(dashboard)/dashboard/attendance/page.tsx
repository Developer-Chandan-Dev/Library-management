import React from 'react';
import AttendanceManagement from '@/components/dashboard/attendance-management/AttendanceManagement';

const AttendancePage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Attendance</h1>
        <p className="text-muted-foreground">
          Track student attendance
        </p>
      </div>
      <AttendanceManagement />
    </div>
  );
};

export default AttendancePage;