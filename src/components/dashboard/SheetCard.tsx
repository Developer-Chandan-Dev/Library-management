import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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
    const statusVariant = {
        free: "default",
        half: "secondary",
        full: "destructive",
    } as const;

    const statusText = {
        free: "Free",
        half: "Half",
        full: "Full",
    };

    return (
        <Card className="max-sm:py-3 max-sm:gap-3 min-w-[120px] max-w-[180px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px] transition-all hover:shadow-lg hover:border-primary/20 flex flex-col mx-auto">
            <CardHeader className="max-sm:px-3 flex flex-row items-center max-sm:flex-col justify-between pb-2 space-y-0">
                <CardTitle className="text-md sm:text-lg font-semibold">
                    Sheet #{sheetNumber}
                </CardTitle>
                <Badge variant={statusVariant[status]}>
                    {statusText[status]}
                </Badge>
            </CardHeader>

            <CardContent className="flex-1 grid gap-4 max-sm:px-2 max-sm:gap-2">
                {status === "full" && (
                    <>
                        {fullTimeName ? (
                            <div className="sm:flex items-center space-x-4 rounded-md border p-2 sm:p-4 bg-green-50 transition-colors hover:bg-green-100 dark:bg-transparent ">
                                <div className="text-xl sm:text-2xl max-sm:mb-2">👤</div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-[12px] sm:text-sm font-medium leading-none">Full Time</p>
                                    <p className="text-[12px] sm:text-sm text-muted-foreground">
                                        {fullTimeName}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="sm:flex items-center space-x-4 rounded-md border p-4 bg-amber-50 transition-colors hover:bg-amber-100 dark:bg-transparent">
                                    <div className="text-xl sm:text-2xl max-sm:mb-2">🌅</div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[12px] sm:text-sm font-medium leading-none">First Half</p>
                                        <p className="text-[12px] sm:text-sm text-muted-foreground">
                                            {firstHalfName}
                                        </p>
                                    </div>
                                </div>
                                <div className="sm:flex items-center space-x-4 rounded-md border p-4 bg-purple-50 transition-colors hover:bg-purple-100 dark:bg-transparent">
                                    <div className="text-xl sm:text-2xl max-sm:mb-2">🌇</div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-[12px] sm:text-sm font-medium leading-none">Last Half</p>
                                        <p className="text-[12px] sm:text-sm text-muted-foreground">
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
                        <div className="sm:flex items-center space-x-4 rounded-md border p-4">
                            <div className="text-xl sm:text-2xl">🌅</div>
                            <div className="flex-1 space-y-1">
                                <p className="text-[12px] sm:text-sm font-medium leading-none">First Half</p>
                                <p className="text-[12px] sm:text-sm text-muted-foreground">
                                    {firstHalfName || <span className="italic text-gray-400">Available</span>}
                                </p>
                            </div>
                        </div>
                        <div className="sm:flex items-center space-x-4 rounded-md border p-4">
                            <div className="textxl sm:text-2xl">🌇</div>
                            <div className="flex-1 space-y-1">
                                <p className="text-[12px] sm:text-sm font-medium leading-none">Last Half</p>
                                <p className="text-[12px] sm:text-sm text-muted-foreground">
                                    {lastHalfName || <span className="italic text-gray-400">Available</span>}
                                </p>
                            </div>
                        </div>
                    </>
                )}

                {status === "free" && (
                    <div className="h-full flex flex-col items-center justify-center py-8 space-y-4">
                        <div className="text-4xl">📭</div>
                        <p className="text-[12px] sm:text-sm text-gray-500">
                            No student assigned
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground">
                    Click for details
                </div>
                <div className="text-xs font-mono font-medium text-blue-600">
                    ID: {sheetNumber.toString().padStart(3, '0')}
                </div>
            </CardFooter>
        </Card>
    );
}