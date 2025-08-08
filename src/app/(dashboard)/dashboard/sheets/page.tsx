import React from "react";
import { SheetCard } from "@/components/dashboard/SheetCard";
import { generatedSheets } from "@/lib/generatedSheets";

const Sheets = async () => {

    const sheets = await generatedSheets();

  return (
    <main className="p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
          🪑 Library Sheet Status
      </h1>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {sheets &&
          sheets.map((sheet) => (
            <SheetCard key={sheet.sheetNumber} {...sheet} />
          ))}
      </div>
    </main>
  );
};

export default Sheets;
