import { SidebarDemo } from "@/components/dashboard/Sidebar";
import { cn } from "@/lib/utils";
import React from "react";

const DashboardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <SidebarDemo />
      <div className="h-full w-full overflow-auto">{children}</div>
    </div>
  );
};

export default DashboardLayout;
