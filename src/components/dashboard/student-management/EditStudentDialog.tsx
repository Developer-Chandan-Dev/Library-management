"use client";

import { Student } from "@/types";
import { AddStudentForm } from "./AddStudentForm";
import { toast } from "sonner";
import { updateStudent } from "@/lib/actions/students.action";

interface EditStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: Student;
}

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
}: EditStudentDialogProps) {
  // const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (updatedStudent: Student): Promise<boolean> => {
    // setIsLoading(true);

    try {
      const result = await updateStudent({
        ...updatedStudent,
        previousSheetNumber: student.sheetNumber,
        previousSlot: student.slot,
      });

      return result;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
      return false;
    }
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    // When using AddStudentForm directly:
    <AddStudentForm
      mode="edit"
      studentData={student}
      onSave={handleSave}
      open={open}
      onOpenChange={onOpenChange}
    >
      <button>Edit Student</button> {/* This is the trigger */}
    </AddStudentForm>
  );
}
