import { dummySheets } from "@/constants/data";

type SheetData = {
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfName?: string;
  lastHalfName?: string;
  fullTimeName?: string;
};

const sheetMap = new Map<number, SheetData>();

// Initialize all 60 sheets as free
for (let i = 1; i <= 60; i++) {
  sheetMap.set(i, {
    sheetNumber: i,
    status: "free",
  });
}

// Process each fake sheet assignment
dummySheets.forEach((assignment) => {
  const sheet = sheetMap.get(assignment.sheetNumber);

  if (!sheet) return; // Skip if a sheet doesn't exist

  // Process based on an assignment type
  if (assignment.status === "full_time" && !assignment.firstHalfName && !assignment.lastHalfName) {
    // Full time assignment
    sheet.status = "full";
    sheet.fullTimeName = assignment.fullTimeName;
    // Clear any half-assignments
    sheet.firstHalfName = undefined;
    sheet.lastHalfName = undefined;
  }
  else if(assignment.status === "full_time" && assignment.firstHalfName && assignment.lastHalfName) {
  //   Full time assignment
    sheet.status = "full";
    sheet.fullTimeName= undefined;
    sheet.firstHalfName = assignment.firstHalfName;
    sheet.lastHalfName = assignment.lastHalfName;
  }
  else if (assignment.status === "first_half") {
    // First half assignment
    sheet.firstHalfName = assignment.firstHalfName;
    sheet.fullTimeName = undefined; // Clear full time if exists

    // Update status based on another half
    if (sheet.lastHalfName) {
      sheet.status = "full";
    } else {
      sheet.status = "half";
    }
  }
  else if (assignment.status === "last_half") {
    // Last half assignment
    sheet.lastHalfName = assignment.lastHalfName;
    sheet.fullTimeName = undefined; // Clear full time if exists

    // Update status based on another half
    if (sheet.firstHalfName) {
      sheet.status = "full";
    } else {
      sheet.status = "half";
    }
  }

  sheetMap.set(assignment.sheetNumber, sheet);
});

export const generatedSheets = Array.from(sheetMap.values());