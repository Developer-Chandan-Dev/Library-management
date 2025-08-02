"use server";

import { dummyStudents } from "@/constants/data"

type StudentData ={
    name: string;
    sheetNumber: number;
    phone? : string;
    slot: "full_time" | "first_half" | "last_half";
    father_name: string;
    address: string;
    is_active: boolean;
    join_date: string;
}

// ⏹️ Switch this to true for live data, false for fake

export const generatedStudents = async(): Promise<StudentData[]>=>{
    const studentMap = new Map(number, )
}