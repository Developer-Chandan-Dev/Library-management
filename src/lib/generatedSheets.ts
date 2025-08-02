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

// ⏹️ Switch this to true for live data, false for fake
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

  rawSheets.forEach((assignment: any) => {
    const sheet = sheetMap.get(assignment.sheetNumber);
    if (!sheet) return;

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

    // 🧠 Handle status updates
    if (assignment.status === "full_time" && !firstHalfName && !lastHalfName) {
      sheet.status = "full";
      sheet.fullTimeName = fullTimeName;
      sheet.firstHalfName = undefined;
      sheet.lastHalfName = undefined;
    } else if (
        assignment.status === "full_time" &&
        firstHalfName &&
        lastHalfName
    ) {
      sheet.status = "full";
      sheet.fullTimeName = undefined;
      sheet.firstHalfName = firstHalfName;
      sheet.lastHalfName = lastHalfName;
    } else if (assignment.status === "first_half") {
      sheet.firstHalfName = firstHalfName;
      sheet.fullTimeName = undefined;
      sheet.status = sheet.lastHalfName ? "full" : "half";
    } else if (assignment.status === "last_half") {
      sheet.lastHalfName = lastHalfName;
      sheet.fullTimeName = undefined;
      sheet.status = sheet.firstHalfName ? "full" : "half";
    }

    console.log(assignment.sheetNumber, sheet);
    sheetMap.set(assignment.sheetNumber, sheet);
  });

  return Array.from(sheetMap.values());
};
