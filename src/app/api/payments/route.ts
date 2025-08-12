import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { ID } from "node-appwrite";

export async function POST(req: NextRequest) {
  try {
    const { studentId, studentName, amount, dueDate, paymentMethod } = await req.json();

    // Validate required fields
    if (!studentId || !studentName || !amount || !dueDate || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();

    // Create payment document
    const payment = await databases.createDocument(
      appwriteConfig.databaseId,
      "payments", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        studentId,
        studentName,
        amount,
        dueDate,
        paymentMethod,
        status: "pending",
      }
    );

    return NextResponse.json(
      { success: true, message: "Payment record created successfully", data: payment },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating payment record:", error);
    return NextResponse.json(
      { error: "Failed to create payment record" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { databases } = await createAdminClient();

    // Get all payments
    const payments = await databases.listDocuments(
      appwriteConfig.databaseId,
      "payments" // This collection needs to be created in Appwrite
    );

    return NextResponse.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { paymentId, status, paymentDate, receiptNumber } = await req.json();

    // Validate required fields
    if (!paymentId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { databases } = await createAdminClient();

    // Update payment status
    const updatedPayment = await databases.updateDocument(
      appwriteConfig.databaseId,
      "payments",
      paymentId,
      {
        status,
        ...(paymentDate && { paymentDate }),
        ...(receiptNumber && { receiptNumber }),
      }
    );

    // If payment is being marked as paid, create payment history record
    if (status === "paid") {
      const paymentHistory = await databases.createDocument(
        appwriteConfig.databaseId,
        "paymentHistory", // This collection needs to be created in Appwrite
        ID.unique(),
        {
          paymentId,
          amount: updatedPayment.amount,
          paymentDate: paymentDate || new Date().toISOString(),
          receiptNumber: receiptNumber || null,
        }
      );
    }

    return NextResponse.json(
      { success: true, message: "Payment updated successfully", data: updatedPayment },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}