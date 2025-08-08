"use server";

import { Student } from "@/types";
import { ID, Query } from 'node-appwrite';
import { createAdminClient } from "@/lib/appwrite";
import { appwriteConfig } from "@/lib/appwrite/config";
import { avatarPlaceholderUrl } from "@/constants";

interface SheetDocument {
    $id: string;
    sheetNumber: number;
    status: "free" | "half" | "full";
    firstHalfName?: string | null;
    lastHalfName?: string | null;
    fullTimeName?: string | null;
    is_active: boolean;
}

interface StudentDocument extends Student {
    $id: string;
    photo_url: string;
    join_date: string;
}

const getAllStudents = async (): Promise<StudentDocument[] | []> => {
    try {
        const { databases } = await createAdminClient();

        const { documents: students, total } = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId
        );

        if (total === 0) return [];
        return students as unknown as StudentDocument[];
    } catch (error) {
        console.log(error);
        return [];
    }
};

const addNewStudent = async (
    student: Omit<Student, "$id">
): Promise<StudentDocument | string | null> => {
    const { name, slot, father_name, phone, address, sheetNumber } = student;

    if (!name || !slot || !father_name || !address || !sheetNumber) {
        return "Please fill in all fields";
    }

    try {
        const { databases } = await createAdminClient();

        const existingSheetRes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId,
            [Query.equal("sheetNumber", sheetNumber)]
        );

        const sheet = existingSheetRes.documents[0] as unknown as SheetDocument | undefined;

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
        ) as unknown as StudentDocument;

        const sheetData: Partial<SheetDocument> = {
            sheetNumber,
            is_active: true,
        };

        if (slot === "full_time") {
            sheetData.status = "full";
            sheetData.fullTimeName = name;
        } else if (slot === "first_half") {
            sheetData.firstHalfName = name;
            sheetData.status = sheet?.lastHalfName ? "full" : "half";
        } else if (slot === "last_half") {
            sheetData.lastHalfName = name;
            sheetData.status = sheet?.firstHalfName ? "full" : "half";
        }

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

const updateStudent = async (
    student: Student & {
        previousSheetNumber?: number;
        previousSlot?: "full_time" | "first_half" | "last_half"
    }
): Promise<StudentDocument | string | null> => {
    const { $id, name, slot, father_name, phone, address, sheetNumber, previousSheetNumber, previousSlot } = student;

    if (!$id || !name || !slot || !father_name || !address || !sheetNumber) {
        return "Please fill in all required fields";
    }

    try {
        const { databases } = await createAdminClient();

        const sheetChanged = sheetNumber !== previousSheetNumber;
        const slotChanged = slot !== previousSlot;

        if (sheetChanged) {
            if (previousSheetNumber) {
                const prevSheetRes = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.sheetsCollectionId,
                    [Query.equal("sheetNumber", previousSheetNumber)]
                );

                if (prevSheetRes.documents.length > 0) {
                    const prevSheet = prevSheetRes.documents[0] as unknown as SheetDocument;
                    const prevSheetUpdate: Partial<SheetDocument> = {};

                    if (previousSlot === "full_time") {
                        prevSheetUpdate.fullTimeName = null;
                        prevSheetUpdate.status = prevSheet.firstHalfName || prevSheet.lastHalfName
                            ? "half"
                            : "free";
                    } else if (previousSlot === "first_half") {
                        prevSheetUpdate.firstHalfName = null;
                        prevSheetUpdate.status = prevSheet.lastHalfName ? "last_half" : "free";
                    } else if (previousSlot === "last_half") {
                        prevSheetUpdate.lastHalfName = null;
                        prevSheetUpdate.status = prevSheet.firstHalfName ? "first_half" : "free";
                    }

                    await databases.updateDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.sheetsCollectionId,
                        prevSheet.$id,
                        prevSheetUpdate
                    );
                }
            }

            const newSheetRes = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                [Query.equal("sheetNumber", sheetNumber)]
            );

            const newSheet = newSheetRes.documents[0] as unknown as SheetDocument | undefined;

            if (newSheet) {
                if (slot === "full_time" && newSheet.status !== "free") {
                    return "Sheet is already partially or fully occupied";
                }
                if (slot === "first_half" && newSheet.firstHalfName) {
                    return "First half is already taken";
                }
                if (slot === "last_half" && newSheet.lastHalfName) {
                    return "Last half is already taken";
                }
            }
        } else if (slotChanged) {
            if (previousSheetNumber) {
                const prevSheetRes = await databases.listDocuments(
                    appwriteConfig.databaseId,
                    appwriteConfig.sheetsCollectionId,
                    [Query.equal("sheetNumber", previousSheetNumber)]
                );

                if (prevSheetRes.documents.length > 0) {
                    const prevSheet = prevSheetRes.documents[0] as unknown as SheetDocument;
                    const prevSheetUpdate: Partial<SheetDocument> = {};

                    if (previousSlot === "full_time") {
                        prevSheetUpdate.fullTimeName = null;
                        prevSheetUpdate.status = prevSheet.firstHalfName || prevSheet.lastHalfName
                            ? "half"
                            : "free";
                    } else if (previousSlot === "first_half") {
                        prevSheetUpdate.firstHalfName = null;
                        prevSheetUpdate.status = prevSheet.lastHalfName ? "last_half" : "free";
                    } else if (previousSlot === "last_half") {
                        prevSheetUpdate.lastHalfName = null;
                        prevSheetUpdate.status = prevSheet.firstHalfName ? "first_half" : "free";
                    }

                    await databases.updateDocument(
                        appwriteConfig.databaseId,
                        appwriteConfig.sheetsCollectionId,
                        prevSheet.$id,
                        prevSheetUpdate
                    );
                }
            }

            const newSheetRes = await databases.listDocuments(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                [Query.equal("sheetNumber", sheetNumber)]
            );

            const newSheet = newSheetRes.documents[0] as unknown as SheetDocument | undefined;

            if (newSheet) {
                if (slot === "full_time" && newSheet.status !== "free") {
                    return "Sheet is already partially or fully occupied";
                }
                if (slot === "first_half" && newSheet.firstHalfName) {
                    return "First half is already taken";
                }
                if (slot === "last_half" && newSheet.lastHalfName) {
                    return "Last half is already taken";
                }
            }
        }

        const updatedStudent = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.studentsCollectionId,
            $id,
            {
                name,
                slot,
                father_name,
                phone: phone || "",
                address,
                sheetNumber
            }
        ) as unknown as StudentDocument;

        const sheetRes = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.sheetsCollectionId,
            [Query.equal("sheetNumber", sheetNumber)]
        );

        const sheetData: Partial<SheetDocument> = {
            sheetNumber,
            is_active: true
        };

        if (slot === "full_time") {
            sheetData.status = "full";
            sheetData.fullTimeName = name;
            sheetData.firstHalfName = null;
            sheetData.lastHalfName = null;
        } else if (slot === "first_half") {
            sheetData.firstHalfName = name;
            sheetData.status = sheetRes.documents[0]?.lastHalfName ? "full" : "half";
        } else if (slot === "last_half") {
            sheetData.lastHalfName = name;
            sheetData.status = sheetRes.documents[0]?.firstHalfName ? "full" : "half";
        }

        if (sheetRes.documents.length > 0) {
            await databases.updateDocument(
                appwriteConfig.databaseId,
                appwriteConfig.sheetsCollectionId,
                sheetRes.documents[0].$id,
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

        return updatedStudent;
    } catch (error) {
        console.error("❌ Failed to update student:", error);
        return null;
    }
};

export { getAllStudents, addNewStudent, updateStudent };