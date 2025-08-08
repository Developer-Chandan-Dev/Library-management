"use server";

import { dummySheets } from "@/constants/data";
import { getSheets } from "@/lib/actions/sheets.actions";

type SheetData = {
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfName?: string;
  lastHalfName?: string;
  fullTimeName?: string;
};

type RawAssignment = {
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfStudent?: { name: string };
  lastHalfStudent?: { name: string };
  fullTimeStudent?: { name: string };
  firstHalfName?: string;
  lastHalfName?: string;
  fullTimeName?: string;
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

  rawSheets.forEach((assignment: RawAssignment) => {
    const sheet = sheetMap.get(assignment.sheetNumber);

    if (!sheet) return;

    // Extract names
    const firstHalfName =
        USE_SERVER_DATA && assignment.firstHalfStudent
            ? assignment.firstHalfStudent.name
            : assignment.firstHalfName;

    const lastHalfName =
        USE_SERVER_DATA && assignment.lastHalfStudent
            ? assignment.lastHalfStudent.name
            : assignment.lastHalfName;

    const fullTimeName =
        USE_SERVER_DATA && assignment.fullTimeStudent
            ? assignment.fullTimeStudent.name
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
    } else if (assignment.status === "half" && !lastHalfName) {
      sheet.firstHalfName = firstHalfName;
      sheet.fullTimeName = undefined;
      // If another half already exists, now both = full
      sheet.status = sheet.lastHalfName ? "full" : "half";
    } else if (assignment.status === "half" && !firstHalfName) {
      sheet.lastHalfName = lastHalfName;
      sheet.fullTimeName = undefined;
      // If another half already exists, now both = full
      sheet.status = sheet.firstHalfName ? "full" : "half";
    }

    sheetMap.set(assignment.sheetNumber, sheet);
  });

  return Array.from(sheetMap.values());
};