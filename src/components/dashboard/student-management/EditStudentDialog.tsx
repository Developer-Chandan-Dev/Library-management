"use client";

import { useState } from "react";
import { Student } from "@/types";
import { AddStudentForm } from "./AddStudentForm";
import { Button } from "@/components/ui/button";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { updateStudent } from "@/lib/actions/students.action";
import { Loader2 } from "lucide-react";
import {Models} from "node-appwrite";

interface EditStudentDialogProps {
    student: Student;
    onStudentUpdated?: (student: string | Models.Document) => void;
}

export function EditStudentDialog({ student, onStudentUpdated }: EditStudentDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async (updatedStudent: Student): Promise<boolean> => {
        setIsLoading(true);
        try {
            const result = await updateStudent({
                ...updatedStudent,
                previousSheetNumber: student.sheetNumber,
                previousSlot: student.slot
            });

            if (!result) throw new Error("Failed to update student");

            toast.success("Student updated successfully");
            onStudentUpdated?.(result);
            return true;
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Update failed");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
            <div className="w-full">
                <AddStudentForm
                    mode="edit"
                    studentData={student}
                    onSave={handleSave}
                >
                    <Button variant="ghost" className="w-full justify-start" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            "Edit Student"
                        )}
                    </Button>
                </AddStudentForm>
            </div>
        </DropdownMenuItem>
    );
}