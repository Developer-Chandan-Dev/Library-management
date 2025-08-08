import { NextResponse } from "next/server";
import { getAllStudents } from "@/lib/actions/students.action";
import { Student } from "@/types";

export async function GET() {
    try {
        const students = await getAllStudents();

        if (!students) {
            return NextResponse.json([], { status: 200 });
        }

        const filteredStudents: Student[] = students.map((student: Student) => ({
            $id: student.$id,
            name: student.name,
            slot: student.slot,
            sheetNumber: student.sheetNumber,
            phone: student.phone,
            father_name: student.father_name,
            address: student.address,
            is_active: student.is_active,
        }));

        return NextResponse.json(filteredStudents);
    } catch (error) {
        console.error("Error fetching students:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}