"use client";
import { useRouter } from "next/navigation";
import React from "react";
import {signOutUser} from "@/lib/actions/user.actions";

const Logout = () => {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOutUser();
        router.push("/login");
      }}
    >
      Logout
    </button>
  );
};

export default Logout;
