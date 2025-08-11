"use server";

import { Sheet, Student } from "@/types";
import { ID, Query } from 'node-appwrite';
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { avatarPlaceholderUrl } from "@/constants";

interface SheetDocument {
    $id: string;
    sheetNumber: number;
    status: "free" | "half" | "full";
    firstHalfName?: string | null;
    lastHalfName?: string | null;
    fullTimeName?: string | null;
    is_active: boolean;
}

interface StudentDocument extends Student {
    $id: string;
    photo_url: string;
    join_date: string;
}


interface StudentDocument {
  $id: string;
  name: string;
  slot: "full_time" | "first_half" | "last_half";
  sheetNumber: number;
}

const getAllStudents = async (): Promise<StudentDocument[] | []> => {
    try {
        const { databases } = await createAdminClient();

        const { documents: students, total } = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId
        );

        if (total === 0) return [];
        return students as unknown as StudentDocument[];
    } catch (error) {
        console.log(error);
        return [];
    }
};

const addNewStudent = async (
    student: Omit<Student, "$id">
): Promise<StudentDocument | string | null> => {
    const { name, slot, father_name, phone, address, sheetNumber } = student;

    if (!name || !slot || !father_name || !address || !sheetNumber) {
        return "Please fill in all fields";
    }

    try {
        const { databases } = await createAdminClient();

        const existingSheetRes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId,
            [Query.equal("sheetNumber", sheetNumber)]
        );

        const sheet = existingSheetRes.documents[0] as unknown as SheetDocument | undefined;

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

        const studentRes = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            ID.unique(),
            {
                name,
                slot,
                father_name,
                phone: phone || "",
                address,
                sheetNumber,
                photo_url: avatarPlaceholderUrl,
                join_date: new Date().toISOString(),
            }
        ) as unknown as StudentDocument;

        const sheetData: Partial<SheetDocument> = {
            sheetNumber,
            is_active: true,
        };

        if (slot === "full_time") {
            sheetData.status = "full";
            sheetData.fullTimeName = name;
        } else if (slot === "first_half") {
            sheetData.firstHalfName = name;
            sheetData.status = sheet?.lastHalfName ? "full" : "half";
        } else if (slot === "last_half") {
            sheetData.lastHalfName = name;
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

        return studentRes;
    } catch (error) {
        console.error("❌ Failed to add student:", error);
        return null;
    }
};

const updateStudent = async (
    student: Student & {
        previousSheetNumber?: number;
        previousSlot?: "full_time" | "first_half" | "last_half"
    }
): Promise<StudentDocument | string | null> => {
    const { $id, name, slot, father_name, phone, address, sheetNumber, previousSheetNumber, previousSlot } = student;

    if (!$id || !name || !slot || !father_name || !address || !sheetNumber) {
        return "Please fill in all required fields";
    }

    try {
        const { databases } = await createAdminClient();

        // Helper function to clear previous slot assignment
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
                    prevSheetUpdate.status = prevSheet.firstHalfName || prevSheet.lastHalfName 
                        ? "half" 
                        : "free";
                    break;
                case "first_half":
                    prevSheetUpdate.firstHalfName = undefined;
                    prevSheetUpdate.status = prevSheet.lastHalfName 
                        ? (prevSheet.fullTimeName ? "full" : "half")
                        : "free";
                    break;
                case "last_half":
                    prevSheetUpdate.lastHalfName = undefined;
                    prevSheetUpdate.status = prevSheet.firstHalfName 
                        ? (prevSheet.fullTimeName ? "full" : "half")
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

        // Helper function to check new slot availability
        const checkNewSlotAvailability = async () => {
            const newSheetRes = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                [Query.equal("sheetNumber", sheetNumber)]
            );

            const newSheet = newSheetRes.documents[0];
            if (!newSheet) return true; // New sheet will be created

            switch (slot) {
                case "full_time":
                    if (newSheet.status !== "free") {
                        return "Sheet is already partially or fully occupied";
                    }
                    break;
                case "first_half":
                    if (newSheet.firstHalfName) {
                        return "First half is already taken";
                    }
                    break;
                case "last_half":
                    if (newSheet.lastHalfName) {
                        return "Last half is already taken";
                    }
                    break;
            }
            return true;
        };

        // Check if we need to update sheets
        const needsSheetUpdate = (
            sheetNumber !== previousSheetNumber || 
            slot !== previousSlot
        );

        if (needsSheetUpdate) {
            // Clear previous assignment if exists
            await clearPreviousSlot();

            // Check new slot availability
            const availability = await checkNewSlotAvailability();
            if (typeof availability === "string") return availability;
        }

        // Update student document
        const updatedStudent = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            $id,
            {
                name,
                slot,
                father_name,
                phone: phone || "",
                address,
                sheetNumber
            }
        );

        // Update sheet assignment if needed
        if (needsSheetUpdate) {
            const sheetRes = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                [Query.equal("sheetNumber", sheetNumber)]
            );

            const sheetData: Partial<Sheet> = {
                sheetNumber,
                is_active: true
            };

            switch (slot) {
                case "full_time":
                    sheetData.status = "full";
                    sheetData.fullTimeName = name;
                    sheetData.firstHalfName = undefined;
                    sheetData.lastHalfName = undefined;
                    break;
                case "first_half":
                    sheetData.firstHalfName = name;
                    sheetData.status = sheetRes.documents[0]?.lastHalfName 
                        ? "full" 
                        : "half";
                    break;
                case "last_half":
                    sheetData.lastHalfName = name;
                    sheetData.status = sheetRes.documents[0]?.firstHalfName 
                        ? "full" 
                        : "half";
                    break;
            }

            if (sheetRes.documents.length > 0) {
                await databases.updateDocument(
                    appwriteConfig.databaseId,
                    appwriteConfig.sheetsCollectionId,
                    sheetRes.documents[0].$id,
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
        }

        return updatedStudent as unknown as StudentDocument;
    } catch (error) {
        console.error("❌ Failed to update student:", error);
        return null;
    }
};

const deleteStudent = async (
  studentId: string,
  options: { softDelete?: boolean } = { softDelete: false }
): Promise<{ success: boolean; message: string }> => {
  try {
    const { databases } = await createAdminClient();
    const { softDelete } = options;

    // 1. Get the student document
    const student = await databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.studentsCollectionId,
        studentId
    ) as unknown as Student & { $id: string }; // Ensure $id is present

    // Check if already soft-deleted
    if (softDelete && student.is_active === false) {
      return { success: false, message: "Student is already inactive" };
    }

    // 2. Find the associated sheet
    const { documents: sheets } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.sheetsCollectionId,
      [Query.equal("sheetNumber", student.sheetNumber)]
    );

    const sheet = sheets[0] as unknown as (Sheet & { $id: string }) | undefined;

    // 3. Prepare sheet updates based on student's slot
    if (sheet) {
      const sheetUpdate: Partial<Sheet> = { 
        is_active: true // Maintain sheet active status
      };

      switch (student.slot) {
        case "full_time":
          sheetUpdate.fullTimeName = undefined;
          sheetUpdate.status = sheet.firstHalfName || sheet.lastHalfName 
            ? "half" 
            : "free";
          break;

        case "first_half":
          sheetUpdate.firstHalfName = undefined;
          sheetUpdate.status = sheet.lastHalfName 
            ? (sheet.fullTimeName ? "full" : "half")
            : "free";
          break;

        case "last_half":
          sheetUpdate.lastHalfName = undefined;
          sheetUpdate.status = sheet.firstHalfName 
            ? (sheet.fullTimeName ? "full" : "half")
            : "free";
          break;
      }

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.sheetsCollectionId,
        sheet.$id,
        sheetUpdate
      );
    }

    // 4. Handle deletion based on softDelete parameter
    if (softDelete) {
      // Soft delete - mark as inactive
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.studentsCollectionId,
        studentId,
        { is_active: false }
      );
      return { success: true, message: "Student deactivated successfully" };
    } else {
      // Hard delete - remove document
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.studentsCollectionId,
        studentId
      );
      return { success: true, message: "Student permanently deleted" };
    }

  } catch (error) {
    console.error("Failed to delete student:", error);
    return { 
      success: false, 
      message: error instanceof Error 
        ? error.message 
        : "An unexpected error occurred" 
    };
  }
};

export { getAllStudents, addNewStudent, updateStudent, deleteStudent };