"use client";

import * as React from "react";
import { generatedSheets } from "@/lib/generatedSheets";
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
        fullTimeName?: string;
      }[] = data.map((item) => ({
        ...item,
        status: item.fullTimeName
          ? "full"
          : item.firstHalfName && item.lastHalfName
          ? "full"
          : item.firstHalfName || item.lastHalfName
          ? "half"
          : "free",
      }));

      setSheets(allSheets);
    };
    fetchSheets().then((r) => console.log(r));
  }, []);

  // Fix the updateSheet function to properly handle all cases
  const updateSheet = React.useCallback(
    (
      sheetNumber: number,
      slot: "full_time" | "first_half" | "last_half",
      name: string
    ) => {
      setSheets((prev) =>
        prev.map((sheet) => {
          if (sheet.sheetNumber !== sheetNumber) return sheet;

          const updatedSheet = { ...sheet };

          switch (slot) {
            case "full_time":
              // Full-time reservation clears both halves
              updatedSheet.status = "full";
              updatedSheet.fullTimeName = name;
              updatedSheet.firstHalfName = undefined;
              updatedSheet.lastHalfName = undefined;
              break;

            case "first_half":
              updatedSheet.firstHalfName = name;
              // Update status based on other half
              if (updatedSheet.lastHalfName) {
                updatedSheet.status = "full";
              } else {
                updatedSheet.status = "half";
              }
              break;

            case "last_half":
              updatedSheet.lastHalfName = name;
              // Update status based on other half
              if (updatedSheet.firstHalfName) {
                updatedSheet.status = "full";
              } else {
                updatedSheet.status = "half";
              }
              break;
          }

          return updatedSheet;
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
