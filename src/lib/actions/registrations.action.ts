"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

interface RegistrationData {
  studentName: string;
  fatherName: string;
  email: string;
  phone: string;
  address: string;
}

export async function createRegistration(registrationData: RegistrationData) {
  try {
    const { databases } = await createAdminClient();

    // Create registration document
    const registration = await databases.createDocument(
      appwriteConfig.databaseId,
      "registrations", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        ...registrationData,
        registrationDate: new Date().toISOString(),
        status: "pending",
      }
    );

    return {
      success: true,
      message: "Registration created successfully",
      data: registration,
    };
  } catch (error) {
    console.error("Error creating registration:", error);
    return {
      success: false,
      message: "Failed to create registration",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getRegistrations() {
  try {
    const { databases } = await createAdminClient();

    // Get all registrations
    const registrations = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.registrationCollectionId,
    );

    return {
      success: true,
      data: registrations,
    };
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return {
      success: false,
      message: "Failed to fetch registrations",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateRegistrationStatus(
  registrationId: string,
  status: "pending" | "approved" | "rejected"
) {
  try {
    const { databases } = await createAdminClient();

    // Update registration status
    const updatedRegistration = await databases.updateDocument(
      appwriteConfig.databaseId,
      "registrations",
      registrationId,
      {
        status,
      }
    );

    return {
      success: true,
      message: "Registration status updated successfully",
      data: updatedRegistration,
    };
  } catch (error) {
    console.error("Error updating registration status:", error);
    return {
      success: false,
      message: "Failed to update registration status",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteRegistration(registrationId: string) {
  try {
    const { databases } = await createAdminClient();

    // Delete registration
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      "registrations",
      registrationId
    );

    return {
      success: true,
      message: "Registration deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting registration:", error);
    return {
      success: false,
      message: "Failed to delete registration",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
