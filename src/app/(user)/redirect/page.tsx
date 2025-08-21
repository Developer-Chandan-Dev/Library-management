"use client";

import { useEffect } from "react";
import { account, ADMIN_TEAM_ID, teams } from "@/lib/appwrite/appwrite";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const user = await account.get();
        if (!user) {
          router.replace("/login");
          return;
        } // <-- This closing brace was missing

        // Fetch memberships to determine user role
        const memberships = await teams.listMemberships(
          ADMIN_TEAM_ID,
          [],
          user.$id
        );
        const isAdmin =
          memberships.total > 0 &&
          memberships.memberships[0].roles.includes("admin");

        if (isAdmin) {
          router.replace("/dashboard");
        } else {
          router.replace("/dashboard/students");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        router.replace("/login");
      }
    };

    checkRole();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  );
}