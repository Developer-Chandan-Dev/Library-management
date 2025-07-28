import { StudentDataTable } from '@/components/dashboard/student-management/StudentDataTable'
import { Button } from '@/components/ui/button'
import React from 'react'

const Students = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
          <p className="text-gray-600 mt-2">
            View, search, and manage student records
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          Add New Student
        </Button>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <StudentDataTable />
      </div>
    </div>
  )
}

export default Students
