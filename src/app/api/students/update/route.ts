import {NextRequest, NextResponse} from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        return NextResponse.json({ success: true, message: "Student updated" });
    }catch(e) {
        console.error("Error in updating student", e);
    }
}