"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

interface ReservationData {
  $id?: string | undefined;
  studentId: string;
  studentName: string;
  sheetNumber: number;
  slot: "full_time" | "first_half" | "last_half";
  startDate: string;
  endDate?: string;
}

interface Sheet {
  $id: string;
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfName?: string | null;
  lastHalfName?: string | null;
  fullTimeName?: string | null;
  is_active: boolean;
}

export async function createReservation(reservationData: ReservationData) {
  const { studentId, studentName, slot, sheetNumber, startDate } =
    reservationData;

  if (!studentId || !slot || !studentName || !startDate || !sheetNumber) {
    return "Please fill in all fields";
  }

  try {
    const { databases } = await createAdminClient();

    // Check sheet is available or not
    const existingSheetRes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      [Query.equal("sheetNumber", sheetNumber)]
    );

    const sheet = existingSheetRes.documents[0] as unknown as Sheet | undefined;

    if (sheet) {
      if (slot === "full_time" && sheet.status !== "free") {
        return "Sheet is already partially or fully occupied";
      }
      if (slot === "first_half" && sheet.firstHalfName) {
        return "First half is already taken";
      }
      if (slot === "last_half" && sheet.lastHalfName) {
        return "Last half is already taken";
      }
    }

    // Create reservation document
    const reservation = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId, // This collection needs to be created in Appwrite
      ID.unique(),
      {
        ...reservationData,
        reservationDate: new Date().toISOString(),
        status: "active",
      }
    );

    const sheetData: Partial<Sheet> = {
      sheetNumber,
      is_active: true,
    };

    if (slot === "full_time") {
      sheetData.status = "full";
      sheetData.fullTimeName = studentName;
    } else if (slot === "first_half") {
      sheetData.firstHalfName = studentName;
      sheetData.status = sheet?.lastHalfName ? "full" : "half";
    } else if (slot === "last_half") {
      sheetData.lastHalfName = studentName;
      sheetData.status = sheet?.firstHalfName ? "full" : "half";
    }

    if (sheet) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        sheet.$id,
        sheetData
      );
    } else {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        ID.unique(),
        sheetData
      );
    }

    if (!reservation) {
      return { message: "Something went wrong with reservation" };
    }

    // Update Student Document
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      studentId,
      {
        slot,
        sheetNumber,
        reservationId: reservation.$id,
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
      appwriteConfig.reservationCollectionId
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
      appwriteConfig.reservationCollectionId,
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

export async function fulfillReservation(reservationId: string) {
  try {
    const { databases } = await createAdminClient();

    // Get the reservation
    const reservation = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      reservationId
    );

    // Check if sheet is available for this slot
    const sheetAvailability = await checkSheetAvailability(
      reservation.sheetNumber,
      reservation.slot
    );

    if (!sheetAvailability.available) {
      return {
        success: false,
        message:
          sheetAvailability.reason || "Sheet is not available for this slot",
      };
    }

    // Update student with sheet assignment
    const updatedStudent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      reservation.studentId,
      {
        sheetNumber: reservation.sheetNumber,
        slot: reservation.slot,
      }
    );

    // Update sheet status
    await updateSheetStatus(
      reservation.sheetNumber,
      reservation.slot,
      reservation.studentName,
      "assign"
    );

    // Update reservation status to fulfilled
    const updatedReservation = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      reservationId,
      {
        status: "completed",
        endDate: new Date().toISOString(),
      }
    );

    return {
      success: true,
      message: "Reservation fulfilled and sheet assigned successfully",
      data: {
        reservation: updatedReservation,
        student: updatedStudent,
      },
    };
  } catch (error) {
    console.error("Error fulfilling reservation:", error);
    return {
      success: false,
      message: "Failed to fulfill reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Helper function to check sheet availability
async function checkSheetAvailability(
  sheetNumber: number,
  slot: "full_time" | "first_half" | "last_half"
) {
  try {
    const { databases } = await createAdminClient();

    // Get existing sheet document by sheetNumber
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      [Query.equal("sheetNumber", sheetNumber)]
    );

    const sheet = response.documents[0];

    // No document yet — all slots are free
    if (!sheet) return { available: true, reason: null };

    if (slot === "full_time") {
      if (sheet.status !== "free") {
        return {
          available: false,
          reason: "Sheet is already partially or fully occupied",
        };
      }
    } else if (slot === "first_half") {
      if (sheet.firstHalfName) {
        return { available: false, reason: "First half is already taken" };
      }
    } else if (slot === "last_half") {
      if (sheet.lastHalfName) {
        return { available: false, reason: "Last half is already taken" };
      }
    }

    return { available: true, reason: null };
  } catch (error) {
    console.error("Error checking sheet availability:", error);
    return { available: false, reason: "Error checking sheet availability" };
  }
}

// Helper function to update sheet status
async function updateSheetStatus(
  sheetNumber: number,
  slot: "full_time" | "first_half" | "last_half",
  studentName: string,
  action: "assign" | "remove"
) {
  try {
    const { databases } = await createAdminClient();

    // Get existing sheet document by sheetNumber
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      [Query.equal("sheetNumber", sheetNumber)]
    );

    let sheet = response.documents[0];
    let sheetId = sheet?.$id;

    // If sheet doesn't exist, create it
    if (!sheet) {
      sheet = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        ID.unique(),
        {
          sheetNumber,
          status: "free",
          is_active: true,
        }
      );
      sheetId = sheet.$id;
    }

    // Prepare update data
    const sheetData: Sheet = {
      is_active: true,
    };

    if (action === "assign") {
      if (slot === "full_time") {
        sheetData.status = "full";
        sheetData.fullTimeName = studentName;
      } else if (slot === "first_half") {
        sheetData.firstHalfName = studentName;
        sheetData.status = sheet.lastHalfName ? "full" : "half";
      } else if (slot === "last_half") {
        sheetData.lastHalfName = studentName;
        sheetData.status = sheet.firstHalfName ? "full" : "half";
      }
    } else {
      // Remove assignment
      if (slot === "full_time") {
        sheetData.status = "free";
        sheetData.fullTimeName = null;
      } else if (slot === "first_half") {
        sheetData.firstHalfName = null;
        sheetData.status = sheet.lastHalfName ? "half" : "free";
      } else if (slot === "last_half") {
        sheetData.lastHalfName = null;
        sheetData.status = sheet.firstHalfName ? "half" : "free";
      }
    }

    // Update sheet
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      sheetId,
      sheetData
    );

    return { success: true };
  } catch (error) {
    console.error("Error updating sheet status:", error);
    return { success: false, error };
  }
}

export async function updateReservation(
  reservation: ReservationData & {
    previousSheetNumber?: number;
    previousSlot?: "full_time" | "first_half" | "last_half";
    reservationId: string;
  }
) {
  const {
    reservationId,
    studentId,
    studentName,
    sheetNumber,
    slot,
    startDate,
    endDate,
    previousSheetNumber,
    previousSlot,
  } = reservation;

  if (
    !reservationId ||
    !studentId ||
    !studentName ||
    !sheetNumber ||
    !slot ||
    !startDate
  ) {
    return {
      success: false,
      message: "Please fill in all required fields",
    };
  }

  try {
    const { databases } = await createAdminClient();

    // 1. Clear previous slot assignment
    const clearPreviousSlot = async () => {
      if (!previousSheetNumber || !previousSlot) return;

      const prevSheetRes = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        [Query.equal("sheetNumber", previousSheetNumber)]
      );

      if (prevSheetRes.documents.length === 0) return;

      const prevSheet = prevSheetRes.documents[0];
      const prevSheetUpdate: Partial<Sheet> = {};

      switch (previousSlot) {
        case "full_time":
          prevSheetUpdate.fullTimeName = undefined;
          prevSheetUpdate.status =
            prevSheet.firstHalfName || prevSheet.lastHalfName ? "half" : "free";
          break;
        case "first_half":
          prevSheetUpdate.firstHalfName = undefined;
          prevSheetUpdate.status = prevSheet.lastHalfName
            ? prevSheet.fullTimeName
              ? "full"
              : "half"
            : "free";
          break;
        case "last_half":
          prevSheetUpdate.lastHalfName = undefined;
          prevSheetUpdate.status = prevSheet.firstHalfName
            ? prevSheet.fullTimeName
              ? "full"
              : "half"
            : "free";
          break;
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        prevSheet.$id,
        prevSheetUpdate
      );
    };

    // 2. Check new slot availability using helper function
    const isSameSheetAndSlot =
      previousSheetNumber === sheetNumber && previousSlot === slot;

    if (!isSameSheetAndSlot) {
      const availability = await checkSheetAvailability(sheetNumber, slot);
      if (!availability.available) {
        return {
          success: false,
          message: availability.reason || "Slot unavailable",
        };
      }
    }

    // 3. Clear previous slot if needed
    if (previousSheetNumber && previousSlot && !isSameSheetAndSlot) {
      await clearPreviousSlot();
    }

    // 4. Update reservation document
    const updatedReservation = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      reservationId,
      {
        studentId,
        studentName,
        sheetNumber,
        slot,
        startDate,
        endDate: endDate || null,
      }
    );

    // 5. Update new sheet assignment
    const newSheetRes = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      [Query.equal("sheetNumber", sheetNumber)]
    );

    const newSheet = newSheetRes.documents[0] as unknown as Sheet | undefined;
    const sheetData: Partial<Sheet> = {
      sheetNumber,
      is_active: true,
    };

    if (slot === "full_time") {
      sheetData.status = "full";
      sheetData.fullTimeName = studentName;
      sheetData.firstHalfName = undefined;
      sheetData.lastHalfName = undefined;
    } else if (slot === "first_half") {
      sheetData.firstHalfName = studentName;
      sheetData.status = newSheet?.lastHalfName ? "full" : "half";
      sheetData.fullTimeName = undefined;
    } else if (slot === "last_half") {
      sheetData.lastHalfName = studentName;
      sheetData.status = newSheet?.firstHalfName ? "full" : "half";
      sheetData.fullTime = undefined;
    }

    if (newSheet) {
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        newSheet.$id,
        sheetData
      );
    } else {
      await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        ID.unique(),
        sheetData
      );
    }

    // 6. Update student document
    const updatedStudent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      studentId,
      {
        slot,
        sheetNumber,
        reservationId: reservationId,
      }
    );

    return {
      success: true,
      message: "Reservation updated successfully",
      data: {
        reservation: updatedReservation,
        student: updatedStudent,
      },
    };
  } catch (error) {
    console.error("Error updating reservation:", error);
    return {
      success: false,
      message: "Failed to update reservation",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteReservation(
 reservationId: string,
 options: { softDelete?: boolean } = { softDelete: false }
): Promise<{ success: boolean; message: string }> {

  try {
    const { databases } = await createAdminClient();
    const { softDelete } = options;
    
    // 1. Fetch reservation details
    const reservation = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      reservationId
    ) as unknown as ReservationData;

    if (!reservation) {
      return {
        success: false,
        message: "Reservation not found"
      };
    }

    const { studentId, sheetNumber, slot } = reservation;

    if(softDelete){
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.reservationCollectionId,
        reservationId,
        {is_active: false},
      );
      return { success: true, message: "Reservation deactivated successfully"}
    } else {

      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.reservationCollectionId,
        reservationId
      );
    }
    // 2. Delete the reservation document

    // 3. Free up the sheet slot
    const sheetResponse = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      [Query.equal("sheetNumber", sheetNumber)]
    );

    if (sheetResponse.documents.length > 0) {
      const sheet = sheetResponse.documents[0];
      const updateData: Partial<Sheet> = {};

      switch (slot) {
        case "full_time":
          updateData.fullTimeName = undefined;
          // If halves are occupied, status should be half, otherwise free
          updateData.status = sheet.firstHalfName || sheet.lastHalfName 
            ? "half" 
            : "free";
          break;
        case "first_half":
          updateData.firstHalfName = undefined;
          // If other half is occupied, status depends on full-time
          updateData.status = sheet.lastHalfName 
            ? (sheet.fullTimeName ? "full" : "half")
            : "free";
          break;
        case "last_half":
          updateData.lastHalfName = undefined;
          updateData.status = sheet.firstHalfName 
            ? (sheet.fullTimeName ? "full" : "half")
            : "free";
          break;
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        sheet.$id,
        updateData
      );
    }

    // 4. Update the student document
    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      studentId,
      {
        reservationId: null,
        slot: null,
        sheetNumber: null
      }
    );

    return {
      success: true,
      message: "Reservation deleted successfully"
    };
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return {
      success: false,
      message: "Failed to delete reservation",
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
}