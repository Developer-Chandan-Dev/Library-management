"use client";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import React from "react";

const Logout = () => {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await account.deleteSession("current");
        router.push("/login");
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
