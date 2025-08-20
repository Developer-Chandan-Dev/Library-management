"use server";

import { Student } from "@/types";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { avatarPlaceholderUrl } from "@/constants";

// Utility function for standardized responses
interface ActionResponse<T = null> {
  success: boolean;
  message: string;
  data?: T;
}

function createResponse<T = null>(
  success: boolean,
  message: string,
  data?: T
): ActionResponse<T> {
  return { success, message, data };
}

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

const getAllStudents = async (): Promise<StudentDocument[] | []> => {
  try {
    const { databases } = await createAdminClient();

    const { documents: students, total } = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      [
        // Add query to filter active students
        Query.equal('is_active', true)
      ]
    );

    if (total === 0) return [];
    console.log("Student: ", students);
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

    const sheet = existingSheetRes.documents[0] as unknown as
      | SheetDocument
      | undefined;

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

    const studentRes = (await databases.createDocument(
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
    )) as unknown as StudentDocument;

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
    previousSlot?: "full_time" | "first_half" | "last_half";
  }
): Promise<ActionResponse<StudentDocument> | ActionResponse<null>> => {
  const {
    $id,
    name,
    father_name,
    phone,
    email,
    address,
  } = student;

  if (!$id || !name || !father_name || !address) {
    return createResponse(false, "Please fill all the fields");
  }

  try {
    const { databases } = await createAdminClient();

    // Update student document
    const updatedStudent = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      $id,
      {
        name,
        father_name,
        phone: phone || "",
        email: email || "",
        address,
      }
    );

    // Update sheet assignment if needed

    return createResponse(true, "Student updated successfully", updatedStudent as unknown as StudentDocument);
  } catch (error) {
    console.error("❌ Failed to update student:", error);
    return createResponse(false, error instanceof Error ? error.message : "Failed to update student");
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
    await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.studentsCollectionId,
      studentId
    ) as unknown as Student;

    // 2. Check for active reservations - CORRECTED
    const reservations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.reservationCollectionId,
      [
        Query.equal("studentId", studentId),
        Query.equal("status", "active")
      ]
    );

    if (reservations.total > 0) {
      return {
        success: false, 
        message: "Delete student's active reservations before deleting the student"
      };
    }

    // 3. Handle deletion based on softDelete parameter
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
        : "An unexpected error occurred",
    };
  }
};

export { getAllStudents, addNewStudent, updateStudent, deleteStudent };
