"use server";

import {Student} from "@/types";
import {ID, Query} from 'node-appwrite';
import {createAdminClient} from "@/lib/appwrite";
import {appwriteConfig} from "@/lib/appwrite/config";
import {avatarPlaceholderUrl} from "@/constants";

const getAllStudents = async () => {
    try{
        const { databases } = await createAdminClient();

        const {documents: students, total} = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId
        );

        if(total === 0) return null;

        return students;

    }catch(error){
        console.log(error);
    }
};

const addNewStudent = async (
    {
                                        name,
                                        slot,
                                        father_name,
                                        phone,
                                        address,
                                        sheetNumber,
                                    }: Student) => {
    if (!name || !slot || !father_name || !address || !sheetNumber) {
        return "Please fill in all fields";
    }

    try {
        const { databases } = await createAdminClient();

        // Check if sheet exists
        const existingSheetRes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId,
            [Query.equal("sheetNumber", sheetNumber)]
        );

        const sheet = existingSheetRes.documents[0];

        // 🔒 Prevent if slot already taken
        if (sheet) {
            if (slot === "full_time" && sheet.status !== "free") {
                return "Sheet is already partially or fully occupied";
            }
            if (slot === "first_half" && sheet.firstHalfName) {
                return "First half is already taken";
            }
            if (slot === "last_half" && sheet.lastHalfName) {
                return "Last half is already taken";
            }
        }

        // ✅ Add student
        const studentRes = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            ID.unique(),
            {
                name,
                slot,
                father_name,
                phone: phone || "",
                address,
                sheetNumber,
                photo_url: avatarPlaceholderUrl,
                join_date: new Date().toISOString(),
            }
        );

        // 🧩 Prepare sheet data
        const sheetData: any = {
            sheetNumber,
            is_active: true,
        };

        if (slot === "full_time") {
            sheetData.status = "full_time";
            sheetData.fullTimeName = name;
        } else if (slot === "first_half") {
            sheetData.firstHalfName = name;
            sheetData.status = sheet?.lastHalfName ? "full_time" : "first_half";
        } else if (slot === "last_half") {
            sheetData.lastHalfName = name;
            sheetData.status = sheet?.firstHalfName ? "full_time" : "last_half";
        }
        console.log(sheetData, 98);

        // ✏️ Create or Update Sheet
        if (sheet) {
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                sheet.$id,
                sheetData
            );
        } else {
            await databases.createDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                ID.unique(),
                sheetData
            );
        }

        return studentRes;
    } catch (error) {
        console.error("❌ Failed to add student:", error);
        return null;
    }
};

export { getAllStudents, addNewStudent };