"use client";

import { useEffect } from "react";
import { account, ADMIN_TEAM_ID, teams } from "@/lib/appwrite";
import { useRouter } from "next/navigation";

export default function RedirectPage() {
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const user = await account.get();
      console.log(user);
      if (!user) {
        router.replace("/login");
        return;
      }
      console.log("User ID:", user.$id);
      // Fetch memberships to determine user role
      const memberships = await teams.listMemberships(
        ADMIN_TEAM_ID,
        [],
        user.$id
      );
      const isAdmin =
        memberships.total > 0 &&
        memberships.memberships[0].roles.includes("admin");
      console.log("Is Admin:", isAdmin);

      if (isAdmin) {
        router.replace("/dashboard");
      } else {
        router.replace("/dashboard/students");
      }
    };

    checkRole();
  }, [router]);

  return <p className="p-4">Redirecting...</p>;
}
