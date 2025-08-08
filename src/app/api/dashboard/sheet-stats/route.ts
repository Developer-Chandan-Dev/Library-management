// app/api/dashboard/sheet-stats/route.ts
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";


type SheetStatus = "free" | "full" | "half";

interface SheetDocument {
    $id: string;
    status: SheetStatus;
    // [key: string]: any; // other fields
    $collectionId: string;
    $databaseId: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: [];
}

export async function GET() {
    const { databases } = await createAdminClient();

    try {
        const [response] = await Promise.all([databases.listDocuments<SheetDocument>(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId,
            [ // optional: pagination, filters
                // Query.limit(100)  <-- if needed
            ]
        )]);

        const sheets = response.documents;
        console.log("Sheets length: ", response.documents.length);

        const stats = {
            total: sheets.length,
            free: sheets.filter(sheet => sheet.status === "free").length,
            full: sheets.filter(sheet => sheet.status === "full").length,
            half: sheets.filter(sheet => sheet.status === "half").length,
        };

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching sheet stats:", error);
        return NextResponse.json({ error: "Failed to fetch sheet stats" }, { status: 500 });
    }
}
