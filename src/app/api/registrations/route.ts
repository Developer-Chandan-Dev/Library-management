import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
    try {
      const { studentName, fatherName, email, phone, address } = await req.json();

      // Validate required fields
      if (!studentName || !fatherName || !email || !phone || !address) {
        return NextResponse.json(
          { error: "All fields are required" },
          { status: 400 }
        );
      }

      const { databases } = await createAdminClient();

      // Create registration document
      const registration = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.registrationCollectionId,
        // This collection needs to be created in Appwrite
        ID.unique(),
        {
          studentName,
          fatherName,
          email,
          phone,
          address,
          registrationDate: new Date().toISOString(),
          status: "pending",
        }
      );

      return NextResponse.json(
        { success: true, message: "Registration submitted successfully", data: registration },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error submitting registration:", error);
      return NextResponse.json(
        { error: "Failed to submit registration" },
        { status: 500 }
      );
    }
  }

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    // Get all registrations
    const registrations = await databases.listDocuments(
      appwriteConfig.databaseId,
      "registrations" // This collection needs to be created in Appwrite
    );

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { error: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}