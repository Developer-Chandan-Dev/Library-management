"use client";

import * as React from "react";
import { generatedSheets} from '@/lib/generatedSheets'
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
    const fetchSheets = async () => {
      const data = await generatedSheets();

      const allSheets: {
        sheetNumber: number;
        status: "free" | "half" | "full";
        firstHalfName?: string;
        lastHalfName?: string;
        fullTimeName?: string
      }[] = data.map(item => ({
        ...item,
        // any necessary conversion logic here
      }));

      setSheets(allSheets);

    };
    fetchSheets().then(r => console.log(r));
  }, []);

const updateSheet = React.useCallback(
  (
    sheetNumber: number,
    slot: "full_time" | "first_half" | "last_half",
    name: string
  ) => {
    setSheets((prev) =>
      prev.map((sheet) => {
        if (sheet.sheetNumber !== sheetNumber) return sheet;

        // Decide the new state and names
        if (slot === "full_time") {
          // Marked as full, assigns to fullTimeName

          return { ...sheet, status: "full", fullTimeName: name };
        } else if (slot === "first_half" && sheet.status !== "full") {
          // If lastHalfName is present, then it is full
          if (sheet.lastHalfName) {
            return {
              ...sheet,
              status: "full",
              firstHalfName: name,
              // Optionally, also keep fullTimeName for clarity
              fullTimeName: `${name} & ${sheet.lastHalfName}`,
            };
          } else {
            return {
              ...sheet,
              status: "half",
              firstHalfName: name,
            };
          }
        } else if (slot === "last_half") {
          // If firstHalfName is present, then it is full
          if (sheet.firstHalfName) {
            return {
              ...sheet,
              status: "full",
              lastHalfName: name,
              // Optionally, also keep fullTimeName for clarity
              fullTimeName: `${sheet.firstHalfName} & ${name}`,
            };
          } else {
            return {
              ...sheet,
              status: "half",
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