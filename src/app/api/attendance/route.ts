import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { action, studentId, studentName, attendanceId } = await req.json();

    // Validate required fields based on action
    if (!action) {
      return NextResponse.json(
        { error: "Missing action field" },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();

    if (action === "check-in") {
      // Validate required fields for check-in
      if (!studentId || !studentName) {
        return NextResponse.json(
          { error: "Missing required fields for check-in" },
          { status: 400 }
        );
      }

      // Create attendance record
      const attendanceRecord = await databases.createDocument(
        appwriteConfig.databaseId,
        "attendance", // This collection needs to be created in Appwrite
        ID.unique(),
        {
          studentId,
          studentName,
          date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
          entryTime: new Date().toISOString(),
        }
      );

      return NextResponse.json(
        { success: true, message: "Student checked in successfully", data: attendanceRecord },
        { status: 201 }
      );
    } else if (action === "check-out") {
      // Validate required fields for check-out
      if (!attendanceId) {
        return NextResponse.json(
          { error: "Missing attendanceId for check-out" },
          { status: 400 }
        );
      }

      // Get the attendance record to calculate duration
      const attendanceRecord = await databases.getDocument(
        appwriteConfig.databaseId,
        "attendance",
        attendanceId
      );

      // Calculate duration in minutes
      const entryTime = new Date(attendanceRecord.entryTime);
      const exitTime = new Date();
      const duration = Math.round((exitTime.getTime() - entryTime.getTime()) / 60000);

      // Update attendance record with exit time and duration
      const updatedAttendanceRecord = await databases.updateDocument(
        appwriteConfig.databaseId,
        "attendance",
        attendanceId,
        {
          exitTime: exitTime.toISOString(),
          duration: duration,
        }
      );

      return NextResponse.json(
        { success: true, message: "Student checked out successfully", data: updatedAttendanceRecord },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'check-in' or 'check-out'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing attendance action:", error);
    return NextResponse.json(
      { error: "Failed to process attendance action" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    // Get all attendance records
    const attendanceRecords = await databases.listDocuments(
      appwriteConfig.databaseId,
      "attendance" // This collection needs to be created in Appwrite
    );

    return NextResponse.json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}