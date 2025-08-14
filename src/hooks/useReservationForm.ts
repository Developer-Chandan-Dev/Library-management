// hooks/useReservationForm.ts
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSheetAvailability } from "@/context/SheetAvailabilityContext";
import { Student, Sheet, Reservation } from "@/types";
import { createReservation, updateReservation } from "@/lib/actions/reservations.action";
import { toast } from "sonner";

const formSchema = z.object({
  studentId: z.string().min(2),
  studentName: z.string().min(2, {
    message: "Student name must be at least 2 characters.",
  }),
  slot: z.enum(["full_time", "first_half", "last_half"], {
    required_error: "Please select a time slot.",
  }),
  sheetNumber: z.number({
    error: "Please select a sheet.",
  }),
  startDate: z.string().min(2, {
    message: "Start date is required",
  }),
  endDate: z.string().optional(),
});

const formatDateForInput = (dateString: string | undefined): string => {
  if (!dateString) return "";
  return dateString.substring(0, 10);
};

export const useReservationForm = ({
  mode,
  studentData,
  reservationData,
  onOpenChange,
  open,
}: {
  mode: "add" | "edit";
  studentData?: Partial<Student>;
  reservationData?: Partial<Reservation>;
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { sheets, updateSheet } = useSheetAvailability();
  const [filteredSheets, setFilteredSheets] = React.useState<Sheet[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState<
    "full_time" | "first_half" | "last_half"
  >();
  const [previousSheetSlot, setPreviousSheetSlot] = React.useState<{
    sheetNumber?: number;
    slot?: "full_time" | "first_half" | "last_half";
  }>({});

  const isOpen = open !== undefined ? open : isDialogOpen;
  const setIsOpen = onOpenChange || setIsDialogOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: studentData ? studentData.$id : "",
      studentName: studentData ? studentData.name : "",
      slot: undefined,
      sheetNumber: 0,
      startDate: "",
      endDate: "",
    },
  });

  // Update selectedSlot when slot changes in the form
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "slot") {
        setSelectedSlot(value.slot);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Filter sheets based on selected slot
  React.useEffect(() => {
    if (!selectedSlot || !sheets) {
      setFilteredSheets([]);
      return;
    }

    const availableSheets = sheets.filter((sheet) => !isSheetDisabled(sheet));
    setFilteredSheets(availableSheets);
  }, [selectedSlot, sheets, isSheetDisabled]);

  // Reset form with student data
  React.useEffect(() => {
    if (isOpen && reservationData) {
      form.reset({
        studentId: reservationData.studentId,
        studentName: reservationData.studentName,
        slot: reservationData.slot,
        sheetNumber: reservationData.sheetNumber || 0,
        startDate: formatDateForInput(reservationData?.startDate),
        endDate: formatDateForInput(reservationData?.endDate || ""),
      });

      setPreviousSheetSlot({
        sheetNumber: reservationData.sheetNumber,
        slot: reservationData.slot,
      });

      setSelectedSlot(reservationData.slot);
    } else if (isOpen && studentData) {
      form.reset({
        studentId: studentData.$id || "",
        studentName: studentData.name || "",
        slot: undefined,
        sheetNumber: 0,
        startDate: "",
        endDate: "",
      });
      setPreviousSheetSlot({});
    }
  }, [isOpen, reservationData, studentData, form]);

  const isSheetDisabled = (sheet: Sheet) => {
    if (!selectedSlot) return true;

    if (mode === "edit" && reservationData?.sheetNumber === sheet.sheetNumber) {
      return false;
    }

    if (sheet.fullTimeName) return true;

    switch (selectedSlot) {
      case "full_time":
        return !!(sheet.firstHalfName || sheet.lastHalfName);
      case "first_half":
        return !!sheet.firstHalfName;
      case "last_half":
        return !!sheet.lastHalfName;
      default:
        return true;
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setSelectedSlot(undefined);
      setFilteredSheets([]);
    }
    setIsOpen(open);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let result;
      if (mode === "add") {
        result = await createReservation(values);
        if (!result?.success) {
          throw new Error(result?.message || "Failed to create reservation");
        }
        updateSheet(values.sheetNumber, values.slot, values.studentName);
        toast.success("Reservation created successfully!");
      } else {
        if (!reservationData?.$id) {
          throw new Error("Missing reservation ID");
        }
        result = await updateReservation({
          ...values,
          reservationId: reservationData.$id,
          previousSheetNumber: previousSheetSlot.sheetNumber,
          previousSlot: previousSheetSlot.slot,
        });
        if (!result?.success) {
          throw new Error(result?.message || "Failed to update reservation");
        }
        if (previousSheetSlot.sheetNumber && previousSheetSlot.slot) {
          updateSheet(
            previousSheetSlot.sheetNumber,
            previousSheetSlot.slot,
            ""
          );
        }
        updateSheet(values.sheetNumber, values.slot, values.studentName);
        toast.success("Reservation updated successfully!");
      }
      handleOpenChange(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isOpen,
    handleOpenChange,
    onSubmit,
    isSubmitting,
    selectedSlot,
    filteredSheets,
    isSheetDisabled,
    mode,
    studentData
  };
};