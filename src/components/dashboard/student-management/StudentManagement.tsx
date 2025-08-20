"use client";

// import { useState, useEffect } from "react";
// import { Student } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { DataTable } from "@/components/ui/data-table";

const StudentManagement = () => {
  // const [students, setStudents] = useState<Student[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);

  // const fetchStudents = async () => {
  //   try {
  //     setIsLoading(true);
  //     const res = await fetch("/api/students");
  //     const data = await res.json();
  //     setStudents(data);
  //   } catch (error) {
  //     console.error("Failed to fetch students", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchStudents().then((r) => console.log(r, 29, "Students"));
  // }, []);

  // const handleAddStudent = async (newStudent: Student) => {
  //   try {
  //     const res = await fetch("/api/students/add", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: newStudent.name,
  //         father_name: newStudent.father_name,
  //         phone: newStudent.phone,
  //         address: newStudent.address,
  //         email: newStudent.email,
  //       }),
  //     });

  //     // Check if the response was successful
  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(errorData.error || "Something went wrong");
  //     }

  //     const data = await res.json();
  //     console.log("✅ Student added:", data);
  //     await fetchStudents();

  //     // You can also show a toast or UI message here
  //     return true;
  //   } catch (error) {
  //     console.error("❌ Failed to add student:", error);
  //     // Optionally show user-friendly error toast/message
  //     return false;
  //   }
  // };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Management </CardTitle>
        </CardHeader>
        <CardContent>
          {/* <DataTable /> */}
        </CardContent>
      </Card>
    </>
  );
};

export default StudentManagement;
