import React from "react";
import { SheetCard } from "@/components/dashboard/SheetCard";
import { generatedSheets } from "@/lib/generatedSheets";

const Sheets = () => {
  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
          🪑 Library Sheet Status
      </h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {generatedSheets &&
          generatedSheets.map((sheet) => (
            <SheetCard key={sheet.sheetNumber} {...sheet} />
          ))}
      </div>
    </main>
  );
};

export default Sheets;
