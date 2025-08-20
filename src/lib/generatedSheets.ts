"use server";

import { dummySheets } from "@/constants/data";
import { getSheets } from "@/lib/actions/sheets.actions";
import { Sheet } from "@/types";

type SheetData = {
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfName?: string;
  lastHalfName?: string;
  fullTimeName?: string;
};

// Extended type for server data which includes student objects
type ServerSheet = Sheet & {
  firstHalfStudent?: { name: string };
  lastHalfStudent?: { name: string };
  fullTimeStudent?: { name: string };
};

const USE_SERVER_DATA = true;

export const generatedSheets = async (): Promise<SheetData[]> => {
  const sheetMap = new Map<number, SheetData>();

  // Initialize all 60 sheets as free
  for (let i = 1; i <= 60; i++) {
    sheetMap.set(i, {
      sheetNumber: i,
      status: "free",
    });
  }

  const rawSheets = USE_SERVER_DATA ? await getSheets() : dummySheets;

  if (!rawSheets) return Array.from(sheetMap.values());

  rawSheets.forEach((assignment: Sheet | ServerSheet) => {
    const sheet = sheetMap.get(assignment.sheetNumber);

    if (!sheet) return;

    // Extract names
    const firstHalfName =
      USE_SERVER_DATA && (assignment as ServerSheet).firstHalfStudent
        ? (assignment as ServerSheet).firstHalfStudent!.name
        : assignment.firstHalfName;

    const lastHalfName =
      USE_SERVER_DATA && (assignment as ServerSheet).lastHalfStudent
        ? (assignment as ServerSheet).lastHalfStudent!.name
        : assignment.lastHalfName;

    const fullTimeName =
      USE_SERVER_DATA && (assignment as ServerSheet).fullTimeStudent
        ? (assignment as ServerSheet).fullTimeStudent!.name
        : assignment.fullTimeName;

    // Determine correct status and names
    if (assignment.status === "full") {
      if (firstHalfName && lastHalfName) {
        // Two half names = fully occupied
        sheet.status = "full";
        sheet.firstHalfName = firstHalfName;
        sheet.lastHalfName = lastHalfName;
        sheet.fullTimeName = undefined;
      } else if (fullTimeName) {
        sheet.status = "full";
        sheet.fullTimeName = fullTimeName;
        sheet.firstHalfName = undefined;
        sheet.lastHalfName = undefined;
      }
    } else if (assignment.status === "half") {
      if (firstHalfName && !lastHalfName) {
        sheet.firstHalfName = firstHalfName;
        sheet.fullTimeName = undefined;
        sheet.status = sheet.lastHalfName ? "full" : "half";
      } else if (lastHalfName && !firstHalfName) {
        sheet.lastHalfName = lastHalfName;
        sheet.fullTimeName = undefined;
        sheet.status = sheet.firstHalfName ? "full" : "half";
      }
    }

    sheetMap.set(assignment.sheetNumber, sheet);
  });

  return Array.from(sheetMap.values());
};