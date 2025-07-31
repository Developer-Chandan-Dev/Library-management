"use client";
import { StudentDataTable } from '@/components/dashboard/student-management/StudentDataTable'
import { Button } from '@/components/ui/button'
import React, {useState} from 'react'
import {AddStudentForm} from "@/components/dashboard/student-management/AddStudentForm";
import {Student} from "@/types";
import {dummyStudents} from "@/constants/data";
import {SheetAvailabilityProvider} from "@/context/SheetAvailabilityContext";

const StudentManagementPageContent = () => {
    const [students, setStudents] = useState<Student[]>(dummyStudents)
    // const { sheets } = useSheetAvailability()
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleAddStudent = (newStudent: Student) => {
        setStudents(prev => [...prev, newStudent])
    }

  return (
      <>
        <div className="container mx-auto py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
              <p className="text-gray-600 mt-2">
                View, search, and manage student records
              </p>
            </div>

              <AddStudentForm
                  onAddStudent={handleAddStudent}
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
              >
                  <Button className="bg-indigo-600 hover:bg-indigo-700">
                      Add New Student
                  </Button>
              </AddStudentForm>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <StudentDataTable students={students} />
          </div>
        </div>

      </>
  )
}



export default function StudentManagementPage() {
    return (
        <SheetAvailabilityProvider>
            <StudentManagementPageContent />
        </SheetAvailabilityProvider>
    )
}