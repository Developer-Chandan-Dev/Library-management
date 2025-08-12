"use server";

import { ID } from "node-appwrite";
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";

interface PaymentData {
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  paymentMethod: "cash" | "bank_transfer" | "online" | "other";
}

interface PaymentRecordData {
  paymentId: string;
  amount: number;
  paymentDate: string;
  receiptNumber?: string;
}

export async function createPayment(paymentData: PaymentData) {
  try {
    const { databases } = await createAdminClient();

    // Create payment document
    const payment = await databases.createDocument(
      appwriteConfig.databaseId,
      "payments", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        ...paymentData,
        status: "pending",
      }
    );

    return {
      success: true,
      message: "Payment record created successfully",
      data: payment,
    };
  } catch (error) {
    console.error("Error creating payment record:", error);
    return {
      success: false,
      message: "Failed to create payment record",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPayments() {
  try {
    const { databases } = await createAdminClient();

    // Get all payments
    const payments = await databases.listDocuments(
      appwriteConfig.databaseId,
      "payments" // This collection needs to be created in Appwrite
    );

    return {
      success: true,
      data: payments,
    };
  } catch (error) {
    console.error("Error fetching payments:", error);
    return {
      success: false,
      message: "Failed to fetch payments",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function recordPayment(paymentRecordData: PaymentRecordData) {
  try {
    const { databases } = await createAdminClient();

    // Update payment status to paid
    const updatedPayment = await databases.updateDocument(
      appwriteConfig.databaseId,
      "payments",
      paymentRecordData.paymentId,
      {
        status: "paid",
        paymentDate: paymentRecordData.paymentDate,
        receiptNumber: paymentRecordData.receiptNumber,
      }
    );

    // Create payment history record
    const paymentHistory = await databases.createDocument(
      appwriteConfig.databaseId,
      "paymentHistory", // This collection needs to be created in Appwrite
      ID.unique(),
      {
        ...paymentRecordData,
      }
    );

    return {
      success: true,
      message: "Payment recorded successfully",
      data: { payment: updatedPayment, history: paymentHistory },
    };
  } catch (error) {
    console.error("Error recording payment:", error);
    return {
      success: false,
      message: "Failed to record payment",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getOverduePayments() {
  try {
    const { databases } = await createAdminClient();

    // Get overdue payments (due date has passed and status is not paid)
    const payments = await databases.listDocuments(
      appwriteConfig.databaseId,
      "payments",
      [
        // Add query for overdue payments
      ]
    );

    return {
      success: true,
      data: payments,
    };
  } catch (error) {
    console.error("Error fetching overdue payments:", error);
    return {
      success: false,
      message: "Failed to fetch overdue payments",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}