"use client";

import * as React from "react";
import { dummySheets } from "@/constants/data";
import { Sheet } from "@/types";

interface SheetAvailabilityContextType {
  sheets: Sheet[];
  updateSheet: (
    sheetNumber: number,
    slot: "full_time" | "first_half" | "last_half",
    name: string
  ) => void;
}

const SheetAvailabilityContext = React.createContext<
  SheetAvailabilityContextType | undefined
>(undefined);

export function SheetAvailabilityProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sheets, setSheets] = React.useState<Sheet[]>([]);

  React.useEffect(() => {
    // Initialize sheets with dummy data
    setSheets(dummySheets);
  }, []);

  const updateSheet = React.useCallback(
    (
      sheetNumber: number,
      slot: "full_time" | "first_half" | "last_half",
      name: string
    ) => {
      setSheets((prev) =>
        prev.map((sheet) => {
          if (sheet.sheetNumber === sheetNumber) {
            if (slot === "full_time") {
              return { ...sheet, status: "full_time", fullTimeName: name };
            } else if (slot === "first_half") {
              // If lastHalfName exists, set status to "full_time", else "first_half"
              return {
                ...sheet,
                status: sheet.lastHalfName ? "full_time" : "first_half",
                firstHalfName: name,
              };
            } else if (slot === "last_half") {
              // If firstHalfName exists, set status to "full_time", else "last_half"
              return {
                ...sheet,
                status: sheet.firstHalfName ? "full_time" : "last_half",
                lastHalfName: name,
              };
            }
          }
          return sheet;
        })
      );
    },
    []
  );

  const value = React.useMemo(
    () => ({ sheets, updateSheet }),
    [sheets, updateSheet]
  );

  return (
    <SheetAvailabilityContext.Provider value={value}>
      {children}
    </SheetAvailabilityContext.Provider>
  );
}

export function useSheetAvailability() {
  const context = React.useContext(SheetAvailabilityContext);
  if (!context) {
    throw new Error(
      "useSheetAvailability must be used within a SheetAvailabilityProvider"
    );
  }
  return context;
}
