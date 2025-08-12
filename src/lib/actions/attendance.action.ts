"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

interface CheckInData {
  studentId: string;
  studentName: string;
}

interface CheckOutData {
  attendanceId: string;
}

export async function checkInStudent(checkInData: CheckInData) {
  try {
    const { databases } = await createAdminClient();

    // Create attendance record
    const attendanceRecord = await databases.createDocument(
      appwriteConfig.databaseId,
      "attendance", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        ...checkInData,
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        entryTime: new Date().toISOString(),
      }
    );

    return {
      success: true,
      message: "Student checked in successfully",
      data: attendanceRecord,
    };
  } catch (error) {
    console.error("Error checking in student:", error);
    return {
      success: false,
      message: "Failed to check in student",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function checkOutStudent(checkOutData: CheckOutData) {
  try {
    const { databases } = await createAdminClient();

    // Get the attendance record to calculate duration
    const attendanceRecord = await databases.getDocument(
      appwriteConfig.databaseId,
      "attendance",
      checkOutData.attendanceId
    );

    // Calculate duration in minutes
    const entryTime = new Date(attendanceRecord.entryTime);
    const exitTime = new Date();
    const duration = Math.round((exitTime.getTime() - entryTime.getTime()) / 60000);

    // Update attendance record with exit time and duration
    const updatedAttendanceRecord = await databases.updateDocument(
      appwriteConfig.databaseId,
      "attendance",
      checkOutData.attendanceId,
      {
        exitTime: exitTime.toISOString(),
        duration: duration,
      }
    );

    return {
      success: true,
      message: "Student checked out successfully",
      data: updatedAttendanceRecord,
    };
  } catch (error) {
    console.error("Error checking out student:", error);
    return {
      success: false,
      message: "Failed to check out student",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAttendanceRecords() {
  try {
    const { databases } = await createAdminClient();

    // Get all attendance records
    const attendanceRecords = await databases.listDocuments(
      appwriteConfig.databaseId,
      "attendance" // This collection needs to be created in Appwrite
    );

    return {
      success: true,
      data: attendanceRecords,
    };
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return {
      success: false,
      message: "Failed to fetch attendance records",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getAttendanceSummary() {
  try {
    const { databases } = await createAdminClient();

    // Get today's attendance records
    const today = new Date().toISOString().split('T')[0];
    const attendanceRecords = await databases.listDocuments(
      appwriteConfig.databaseId,
      "attendance",
      [
        // Add query for today's records
      ]
    );

    // Calculate summary statistics
    const totalStudents = attendanceRecords.total;
    const currentlyInLibrary = attendanceRecords.documents.filter(
      (record: any) => !record.exitTime
    ).length;

    return {
      success: true,
      data: {
        totalStudents,
        currentlyInLibrary,
        date: today,
      },
    };
  } catch (error) {
    console.error("Error fetching attendance summary:", error);
    return {
      success: false,
      message: "Failed to fetch attendance summary",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}