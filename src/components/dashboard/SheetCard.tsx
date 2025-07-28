export interface SheetCardProps {
  sheetNumber: number;
  status: "free" | "half" | "full";
  firstHalfName?: string;
  lastHalfName?: string;
  fullTimeName?: string;
}

export function SheetCard({
  sheetNumber,
  status,
  firstHalfName,
  lastHalfName,
  fullTimeName,
}: SheetCardProps) {
  const statusColor = {
    free: "bg-green-100 text-green-800",
    half: "bg-yellow-100 text-yellow-800",
    full: "bg-red-100 text-red-800",
  };

  const statusText = {
    free: "Free",
    half: "Half Occupied",
    full: "Fully Occupied",
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-gray-50 p-5 shadow-lg shadow-blue-100/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-200/60">
      {/* Header with sheet type and status */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium uppercase tracking-wider text-blue-500 bg-blue-50 px-2 py-1 rounded-lg">
          Sheet
        </span>
        <span
          className={`text-[0.7rem] px-2.5 py-1 rounded-full font-semibold tracking-wide ${statusColor[status]}`}
        >
          {statusText[status]}
        </span>
      </div>

      {/* Sheet number with decorative elements */}
      <div className="relative mb-4 flex justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full opacity-60"></div>
        </div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent relative z-10">
          #{sheetNumber}
        </h2>
      </div>

      {/* Student information */}
      <div className="space-y-3 mt-6">
        {status === "full" && (
          <>
            {fullTimeName ? (
              <div className="flex items-start p-3 bg-green-50 transition-all hover:bg-green-100 rounded-lg border border-green-100">
                <span className="mr-2 mt-0.5 text-green-600">👤</span>
                <div>
                  <p className="text-xs font-medium text-green-700">
                    Full Time
                  </p>
                  <p className="text-sm font-medium text-gray-800">
                    {fullTimeName}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start p-3 bg-amber-50 transition-all hover:bg-amber-100 rounded-lg border border-amber-100">
                  <span className="mr-2 mt-0.5 text-amber-600">🌅</span>
                  <div>
                    <p className="text-xs font-medium text-amber-700">
                      First Half
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {firstHalfName}
                    </p>
                  </div>
                </div>
                <div className="flex items-start p-3 bg-purple-50 transition-all hover:bg-purple-100 rounded-lg border border-purple-100">
                  <span className="mr-2 mt-0.5 text-purple-600">🌇</span>
                  <div>
                    <p className="text-xs font-medium text-purple-700">
                      Last Half
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      {lastHalfName}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {status === "half" && (
          <>
            <div className="flex items-start p-3 bg-amber-50 rounded-lg border border-amber-100">
              <span className="mr-2 mt-0.5 text-amber-600">🌅</span>
              <div>
                <p className="text-xs font-medium text-amber-700">First Half</p>
                <p className="text-sm font-medium text-gray-800">
                  {firstHalfName || (
                    <span className="text-gray-400 italic">Free</span>
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-start p-3 bg-purple-50 rounded-lg border border-purple-100">
              <span className="mr-2 mt-0.5 text-purple-600">🌇</span>
              <div>
                <p className="text-xs font-medium text-purple-700">Last Half</p>
                <p className="text-sm font-medium text-gray-800">
                  {lastHalfName || (
                    <span className="text-gray-400 italic">Free</span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}

        {status === "free" && (
          <div className="py-4 text-center">
            <div className="mx-auto bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mb-2">
              <span className="text-2xl">📭</span>
            </div>
            <p className="text-sm font-medium text-gray-500">
              No student assigned
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
