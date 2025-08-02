"use server";

import {createAdminClient} from "@/lib/appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";
import {Query} from 'node-appwrite'

const getSheets = async () => {
    try{
        const { databases } = await createAdminClient();

        const {documents: sheets, total} = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId
        );

        if(total === 0) return null;

        return sheets;

    }catch(error){
        console.log(error);
    }
};

const checkSheetAvailability = async (
    sheetNumber: number,
    slot: "full_time" | "first_half" | "last_half"
) => {
    try {
        const { databases } = await createAdminClient();

        // Get existing sheet document by sheetNumber
        const response = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId,
            [Query.equal("sheetNumber", sheetNumber)]
        );

        const sheet = response.documents[0];

        // No document yet — all slots are free
        if (!sheet) return true;

        if (slot === "full_time") {
            return false; // full_time cannot be set if any slot is occupied
        }

        if (slot === "first_half") {
            return !sheet.firstHalfStudent;
        }

        if (slot === "last_half") {
            return !sheet.lastHalfStudent;
        }

        return false;
    } catch (error) {
        console.error("Error checking sheet availability:", error);
        return false; // fallback too false to be safe
    }
};


export {getSheets, checkSheetAvailability};