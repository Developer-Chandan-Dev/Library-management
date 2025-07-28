import { dummyStudents } from "./dummyStudents";

type SheetData = {
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfName?: string;
  lastHalfName?: string;
  fullTimeName?: string;
};

const sheetMap = new Map<number, SheetData>();

for (let i = 1; i <= 60; i++) {
  sheetMap.set(i, {
    sheetNumber: i,
    status: "free",
  });
}

dummyStudents.forEach(({ name, timeSlot, sheetNumber }) => {
  const sheet = sheetMap.get(sheetNumber)!;

  if (timeSlot === "full_time") {
    sheet.status = "full";
    sheet.fullTimeName = name;
  } else {
    if (timeSlot === "first_half") {
      sheet.firstHalfName = name;
    } else {
      sheet.lastHalfName = name;
    }

    if (sheet.firstHalfName && sheet.lastHalfName) {
      sheet.status = "full";
    } else {
      sheet.status = "half";
    }
  }

  sheetMap.set(sheetNumber, sheet);
});

export const generatedSheets = Array.from(sheetMap.values());
