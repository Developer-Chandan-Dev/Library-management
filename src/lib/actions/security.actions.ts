// src/lib/actions/security.actions.ts
"use server";

import { createSessionClient } from "@/lib/appwrite";
import { parseStringify } from "@/lib/utils";
import * as speakeasy from "speakeasy";
import * as QRCode from "qrcode";

// Update password
export const updatePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    const { account } = await createSessionClient();

    // First verify current password by trying to create a session
    try {
      await account.createEmailPasswordSession(
        (
          await account.get()
        ).email,
        currentPassword
      );
    } catch (error) {
      return parseStringify({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Update to new password
    await account.updatePassword(newPassword, currentPassword);

    return parseStringify({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An error occurred. Please try again.";

    return parseStringify({
      success: false,
      error: errorMessage || "Failed to update password",
    });
  }
};

// Enable Two-Factor Authentication
export const enableTwoFactorAuth = async () => {
  try {
    const { account } = await createSessionClient();
    const currentUser = await account.get();

    // Generate a secret
    const secret = speakeasy.generateSecret({
      name: `YourApp (${currentUser.email})`,
      issuer: "YourApp",
    });

    // Generate QR code
    const qrCode = await QRCode.toDataURL(secret.otpauth_url!);

    return parseStringify({
      success: true,
      secret: secret.base32,
      qrCode: qrCode,
      message: "2FA setup initiated",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to enable 2FA";

    console.error("Enable 2FA error:", errorMessage);
    return parseStringify({
      success: false,
      error: errorMessage || "Failed to enable 2FA",
    });
  }
};

// Verify Two-Factor Authentication
export const verifyTwoFactorAuth = async (token: string, secret: string) => {
  try {
    // const { account } = await createSessionClient();

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: token,
      window: 1, // Allow 30 seconds before/after
    });

    if (!verified) {
      return parseStringify({
        success: false,
        error: "Invalid verification code",
      });
    }

    // In a real app, you would store the 2FA secret in the user's record
    // For now, we'll just return success

    return parseStringify({
      success: true,
      message: "2FA verified successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to verify 2FA";

    console.error("Verify 2FA error:", errorMessage);
    return parseStringify({
      success: false,
      error: errorMessage || "Failed to verify 2FA",
    });
  }
};

// Disable Two-Factor Authentication
export const disableTwoFactorAuth = async () => {
  try {
    // In a real app, you would remove the 2FA secret from the user's record
    // For now, we'll just return success

    return parseStringify({
      success: true,
      message: "2FA disabled successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error
        ? err.message
        : "An error occurred. Please try again.";
    console.error("Disable 2FA error:", errorMessage);
    
    return parseStringify({
      success: false,
      error: errorMessage || "Failed to disable 2FA",
    });
  }
};
