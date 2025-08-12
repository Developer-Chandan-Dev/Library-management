import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { studentId, studentName, sheetNumb1er, slot, startDate, endDate } = await req.json();

    // Validate required fields
    if (!studentId || !studentName || !sheetNumber || !slot || !startDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();

    // Create reservation document
    const reservation = await databases.createDocument(
      appwriteConfig.databaseId,
      "reservations", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        studentId,
        studentName,
        sheetNumber,
        slot,
        startDate,
        endDate: endDate || null,
        reservationDate: new Date().toISOString(),
        status: "active",
      }
    );

    return NextResponse.json(
      { success: true, message: "Reservation created successfully", data: reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    // Get all reservations
    const reservations = await databases.listDocuments(
      appwriteConfig.databaseId,
      "reservations" // This collection needs to be created in Appwrite
    );

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { reservationId, status } = await req.json();

    // Validate required fields
    if (!reservationId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();

    // Update reservation status
    const updatedReservation = await databases.updateDocument(
      appwriteConfig.databaseId,
      "reservations",
      reservationId,
      {
        status,
        ...(status === "completed" && { endDate: new Date().toISOString() }),
      }
    );

    return NextResponse.json(
      { success: true, message: "Reservation updated successfully", data: updatedReservation },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating reservation:", error);
    return NextResponse.json(
      { error: "Failed to update reservation" },
      { status: 500 }
    );
  }
}