"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

interface ReservationData {
  studentId: string;
  studentName: string;
  sheetNumber: number;
  slot: "full_time" | "first_half" | "last_half";
  startDate: string;
  endDate?: string;
}

export async function createReservation(reservationData: ReservationData) {
  try {
    const { databases } = await createAdminClient();

    // Create reservation document
    const reservation = await databases.createDocument(
      appwriteConfig.databaseId,
      "reservations", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        ...reservationData,
        reservationDate: new Date().toISOString(),
        status: "active",
      }
    );

    return {
      success: true,
      message: "Reservation created successfully",
      data: reservation,
    };
  } catch (error) {
    console.error("Error creating reservation:", error);
    return {
      success: false,
      message: "Failed to create reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getReservations() {
  try {
    const { databases } = await createAdminClient();

    // Get all reservations
    const reservations = await databases.listDocuments(
      appwriteConfig.databaseId,
      "reservations" // This collection needs to be created in Appwrite
    );

    return {
      success: true,
      data: reservations,
    };
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return {
      success: false,
      message: "Failed to fetch reservations",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function cancelReservation(reservationId: string) {
  try {
    const { databases } = await createAdminClient();

    // Update reservation status to cancelled
    const updatedReservation = await databases.updateDocument(
      appwriteConfig.databaseId,
      "reservations",
      reservationId,
      {
        status: "cancelled",
      }
    );

    return {
      success: true,
      message: "Reservation cancelled successfully",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    return {
      success: false,
      message: "Failed to cancel reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function completeReservation(reservationId: string) {
  try {
    const { databases } = await createAdminClient();

    // Update reservation status to completed
    const updatedReservation = await databases.updateDocument(
      appwriteConfig.databaseId,
      "reservations",
      reservationId,
      {
        status: "completed",
        endDate: new Date().toISOString(),
      }
    );

    return {
      success: true,
      message: "Reservation completed successfully",
      data: updatedReservation,
    };
  } catch (error) {
    console.error("Error completing reservation:", error);
    return {
      success: false,
      message: "Failed to complete reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}