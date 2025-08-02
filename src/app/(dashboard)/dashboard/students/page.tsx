"use client";
import { StudentDataTable } from '@/components/dashboard/student-management/StudentDataTable'
import { Button } from '@/components/ui/button'
import React, {useEffect, useState} from 'react'
import {AddStudentForm} from "@/components/dashboard/student-management/AddStudentForm";
import {Student} from "@/types";
import {dummyStudents} from "@/constants/data";
import {SheetAvailabilityProvider} from "@/context/SheetAvailabilityContext";
import {addNewStudent, getAllStudents} from "@/lib/actions/students.action";

const StudentManagementPageContent = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    // const { sheets } = useSheetAvailability()
    const [isDialogOpen, setIsDialogOpen] = useState(false);


    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const res = await fetch("/api/students");
            const data = await res.json();
            setStudents(data);
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);


    const handleAddStudent = async (newStudent: Student) => {
        try{
            const res = await fetch("/api/students/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newStudent.name,
                    slot: newStudent.slot,
                    father_name: newStudent.father_name,
                    phone: newStudent.phone,
                    address: newStudent.address,
                    sheetNumber: newStudent.sheetNumber
                }),
            });

            // Check if the response was successful
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Something went wrong");
            }

            const data = await res.json();
            console.log("✅ Student added:", data);
            await fetchStudents();

            // You can also show a toast or UI message here
        }catch (error){
            console.error("❌ Failed to add student:", error);
            // Optionally show user-friendly error toast/message
        }


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
            <StudentDataTable students={students} onClick={fetchStudents} isLoading={isLoading} />
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