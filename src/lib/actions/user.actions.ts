"use server";

import { appwriteConfig } from "@/lib/appwrite/config";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "@/lib/utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.usersCollectionId,
    [Query.equal("email", [email])]
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  if (error instanceof Error) {
    throw new Error(`${message}: ${error.message}`);
  }
  throw new Error(message);
};

// Utility function to validate password strength
const validatePassword = (password: string) => {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }
  // Add more validation rules as needed
  // if (!/[A-Z]/.test(password)) {
  //   throw new Error("Password must contain at least one uppercase letter");
  // }
  // if (!/[0-9]/.test(password)) {
  //   throw new Error("Password must contain at least one number");
  // }
};

export const createAccount = async ({
  fullName,
  email,
  password,
}: {
  fullName: string;
  email: string;
  password: string;
}) => {
  try {
    // Validate password strength
    if (password.length < 8) {
      return parseStringify({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return parseStringify({
        success: false,
        error: "User already exists with this email",
      });
    }

    const { account, databases } = await createAdminClient();

    // 1. Create the Auth account in Appwrite
    const newAccount = await account.create(
      ID.unique(), // userId
      email,
      password,
      fullName
    );

    // 2. Create user document in your database
    await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      {
        fullName,
        email,
        avatar: avatarPlaceholderUrl,
        accountId: newAccount.$id, // Store the Appwrite user ID
      }
    );

    // 3. Automatically log the user in after signup
    const session = await account.createEmailPasswordSession(email, password);

    // 4. Set session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({
      success: true,
      userId: newAccount.$id,
      message: "Account created successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to create account";
    console.error("Update profile error:", errorMessage);

    return parseStringify({
      success: false,
      error: errorMessage,
    });
  }
};

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    const { account, databases } = await createAdminClient();

    // 1. Create email/password session (this authenticates the user)
    const session = await account.createEmailPasswordSession(email, password);

    // 2. Set session cookie
    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    // 3. Get user data from your database
    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("email", email)]
    );

    if (user.total <= 0) {
      return parseStringify({
        success: false,
        error: "User not found in database",
      });
    }

    return parseStringify({
      success: true,
      user: user.documents[0],
      message: "Signed in successfully",
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Sign in error";
    console.error("Update profile error:", errorMessage);

    return parseStringify({
      success: false,
      error: errorMessage || "Failed to sign in",
    });
  }
};

// NEW: Update user password (for settings page)
export const updatePassword = async ({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) => {
  try {
    validatePassword(newPassword);

    const { account } = await createSessionClient();
    await account.updatePassword(newPassword, currentPassword);

    return parseStringify({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    handleError(error, "Failed to update password");
  }
};

// NEW: Password reset flow (step 1: send recovery email)
export const sendPasswordRecovery = async ({ email }: { email: string }) => {
  try {
    const { account } = await createAdminClient();

    // This will send a password reset email to the user
    // The URL should point to your reset password page
    await account.createRecovery(
      email,
      `${process.env.NEXT_PUBLIC_APP_URL}/reset-password` // Redirect URL
    );

    return parseStringify({
      success: true,
      message: "Password recovery email sent",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to send recovery email";

    console.error("Password recovery error:", errorMessage);
    return parseStringify({
      success: false,
      error: errorMessage || "Failed to send recovery email",
    });
  }
};

// NEW: Password reset flow (step 2: confirm recovery)
export const confirmPasswordRecovery = async ({
  userId,
  secret,
  newPassword,
}: {
  userId: string;
  secret: string;
  newPassword: string;
}) => {
  try {
    // Validate password strength
    if (newPassword.length < 8) {
      return parseStringify({
        success: false,
        error: "Password must be at least 8 characters long",
      });
    }

    const { account } = await createAdminClient();

    // Update the password using the recovery secret
    await account.updateRecovery(userId, secret, newPassword);

    return parseStringify({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to reset password";

    console.error("Password reset error:", errorMessage);
    return parseStringify({
      success: false,
      error: errorMessage,
    });
  }
};

// Keep these functions - they work the same way
export const getCurrentUser = async () => {
  try {
    const { databases, account } = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) return null;

    return user.documents[0]; // Return the full user document
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const signOutUser = async () => {
  const { account } = await createSessionClient();

  try {
    await account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const updateUserProfile = async (profileData: {
  fullName: string;
  email: string;
  bio: string;
  location: string;
}) => {
  try {
    const { databases, account } = await createSessionClient();
    const currentUser = await account.get();

    // Find user document by accountId
    const userDoc = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentUser.$id)]
    );

    if (userDoc.total === 0) {
      return parseStringify({
        success: false,
        error: "User not found in database",
      });
    }

    // Update the user document
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userDoc.documents[0].$id,
      {
        fullName: profileData.fullName,
        email: profileData.email,
        bio: profileData.bio,
        location: profileData.location,
        $updatedAt: new Date().toISOString(),
      }
    );

    return parseStringify({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update profile";
    console.error("Update profile error:", errorMessage);

    return parseStringify({
      success: false,
      error: errorMessage,
    });
  }
};

// Optional: Add avatar upload function
export const updateUserAvatar = async (avatarUrl: string) => {
  try {
    const { databases, account } = await createSessionClient();
    const currentUser = await account.get();

    const userDoc = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentUser.$id)]
    );

    if (userDoc.total === 0) {
      return parseStringify({
        success: false,
        error: "User not found",
      });
    }

    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userDoc.documents[0].$id,
      {
        avatar: avatarUrl,
        $updatedAt: new Date().toISOString(),
      }
    );

    return parseStringify({
      success: true,
      user: updatedUser,
      message: "Avatar updated successfully",
    });
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Failed to update avatar";

    console.error("Update avatar error:", errorMessage);
    return parseStringify({
      success: false,
      error: errorMessage || "Failed to update avatar",
    });
  }
};

// Note using this function logic changed OTP based to email/password login
export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const session = await account.createEmailToken(ID.unique(), email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send email OTP");
  }
};

export const verifySecret = async ({
  accountId,
  password,
}: {
  accountId: string;
  password: string;
}) => {
  try {
    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, password);

    (await cookies()).set("appwrite-session", session.secret, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    return parseStringify({ sessionId: session.$id });
  } catch (error) {
    handleError(error, "Failed to verify OTP");
  }
};
