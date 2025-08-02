import { NextResponse } from "next/server";
import { getAllStudents } from "@/lib/actions/students.action";

export async function GET() {
    const students = await getAllStudents();

    const filteredStudents = students.map((student: any) => ({
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
}

