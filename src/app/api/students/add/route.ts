import { NextRequest, NextResponse } from "next/server";
import { addNewStudent } from '@/lib/actions/students.action';
import {checkSheetAvailability} from "@/lib/actions/sheets.actions";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            name,
            slot,
            father_name,
            phone,
            address,
            sheetNumber,
        } = body;

        const isAvailable = await checkSheetAvailability(sheetNumber, slot);
        if (!isAvailable) {
            return NextResponse.json({ error: "Sheet already occupied" }, { status: 400 });
        }

        const result = await addNewStudent({
            name,
            slot,
            father_name,
            phone,
            address,
            sheetNumber,
        });

        if (!result || result === "Please fill in all fields") {
            return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
        }

        return NextResponse.json({ success:true, message: "Student added", data: result }, { status: 201 });
    } catch (error) {
        console.error("Error in POST /api/students/add:", error);
        return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
    }
}
