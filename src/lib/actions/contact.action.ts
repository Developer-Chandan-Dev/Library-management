"use server";
import { appwriteConfig } from "@/lib/appwrite/config";
import { sanitizeInput } from "@/lib/utils";
// import { revalidatePath } from "next/cache";
import { createAdminClient } from "../appwrite";

const MAX_MESSAGE_LENGTH = 1000;
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export interface ContactSubmission {
  $id?: string;
  name: string;
  email: string;
  message: string;
  phone?: string;
  status: string;
}

export async function createContactSubmission(formData: {
  name: string;
  email: string;
  message: string;
  phone?: string;
}) {
  try {
    const sanitizedData = {
      name: sanitizeInput(formData.name.trim()),
      email: sanitizeInput(formData.email.trim()),
      message: sanitizeInput(formData.message.trim()),
      phone: formData.phone ? sanitizeInput(formData.phone.trim()) : undefined,
      status: "unread",
    };

    // Validation checks
    if (
      !sanitizedData.name ||
      sanitizedData.name.length < 2 ||
      sanitizedData.name.length > 100
    ) {
      throw new Error("Name must be between 2-100 characters");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitizedData.email)) {
      throw new Error("Invalid email format");
    }

    if (
      !sanitizedData.message ||
      sanitizedData.message.length < 2 ||
      sanitizedData.message.length > MAX_MESSAGE_LENGTH
    ) {
      throw new Error(
        `Message must be between 2-${MAX_MESSAGE_LENGTH} characters`
      );
    }

    if (sanitizedData.phone && !PHONE_REGEX.test(sanitizedData.phone)) {
      throw new Error("Invalid phone number format");
    }

    const { databases } = await createAdminClient();

    // Create document in Appwrite
    const submission = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.contactCollectionId,
      "unique()", // Auto-generated ID
      sanitizedData
    );

    return {
      ...submission,
      success: true,
      message: "Submission received successfully",
    };
  } catch (error) {
    console.error("Contact submission error:", error);
    
    // Handle different error types properly
    let errorMessage = "Failed to process submission";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = String(error.message);
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
}
export async function getContactSubmissions(): Promise<{
  success: boolean;
  data: ContactSubmission[];
  message?: string;
}> {
  try {
    const { databases } = await createAdminClient();

    // Get all contact records
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.contactCollectionId
    );

    return {
      success: true,
      data: response.documents as unknown as ContactSubmission[],
    };
  } catch (error) {
    console.error("Error fetching contact submissions:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch contact submissions",
    };
  }
}
