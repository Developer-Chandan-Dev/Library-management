"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSheetAvailability } from "@/context/SheetAvailabilityContext";
import { Student, Sheet } from "@/types";
import { dummyStudents } from "@/constants/data";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  slot: z.enum(["full_time", "first_half", "last_half"], {
    error: "Please select a time slot.",
  }),
  sheetNumber: z.number(),
});

interface AddStudentFormProps {
  onAddStudent: (student: Student) => void;
}

export function AddStudentForm({ onAddStudent }: AddStudentFormProps) {
  const { sheets, updateSheet } = useSheetAvailability();
  const [filteredSheets, setFilteredSheets] = React.useState<Sheet[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState<
    "full_time" | "first_half" | "last_half"
  >();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
    },
  });

  // Filter sheets based on selected time slot
  React.useEffect(() => {
    const slot = form.watch("slot");
    setSelectedSlot(slot);

    if (!slot) {
      setFilteredSheets([]);
      return;
    }

    const filtered = sheets.filter((sheet) => {
      // If sheet is full, it's not available for any slot
      if (sheet.status === "full_time") return false;

      if (slot === "full_time") {
        // Only available if completely free
        return sheet.status === "free";
      } else if (slot === "first_half") {
        // Available if no first half is taken
        return !sheet.firstHalfName;
      } else if (slot === "last_half") {
        // Available if no last half is taken
        return !sheet.lastHalfName;
      }
      return false;
    });

    setFilteredSheets(filtered);

    // Reset sheet selection when slot changes
    form.resetField("sheetNumber");
  }, [form.watch("slot"), sheets]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Create new student
    const newStudent: Student = {
      id: `s${Date.now()}`,
      name: values.name,
      slot: values.slot,
      sheetNumber: values.sheetNumber,
      phone: values.phone || undefined,
    };

    // Update sheet availability
    updateSheet(values.sheetNumber, values.slot, values.name);

    // Add to students
    onAddStudent(newStudent);

    // Reset form
    form.reset();
    setSelectedSlot(undefined);

    // Updated toast notification
    toast.success("Student Added", {
      description: `${values.name} has been successfully added.`,
    });
  }

  const isSheetDisabled = (sheet: Sheet) => {
    if (!selectedSlot) return true;

    if (sheet.status === "full_time") return true;

    if (selectedSlot === "full_time") {
      return sheet.status !== "free";
    } else if (selectedSlot === "first_half") {
      return !!sheet.firstHalfName;
    } else if (selectedSlot === "last_half") {
      return !!sheet.lastHalfName;
    }

    return false;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Add New Student</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter student's full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormDescription>
                    Optional contact information
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Slot *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a time slot" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="full_time">Full Time</SelectItem>
                      <SelectItem value="first_half">First Half</SelectItem>
                      <SelectItem value="last_half">Last Half</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sheetNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign to Sheet *</FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString()}
                    disabled={!selectedSlot || filteredSheets.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            !selectedSlot
                              ? "Select a time slot first"
                              : filteredSheets.length === 0
                              ? "No available sheets"
                              : "Select a sheet"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {filteredSheets.length === 0 ? (
                        <div className="py-2 text-center text-sm text-gray-500">
                          No available sheets for this time slot
                        </div>
                      ) : (
                        filteredSheets.map((sheet) => (
                          <SelectItem
                            key={sheet.sheetNumber}
                            value={sheet.sheetNumber.toString()}
                            disabled={isSheetDisabled(sheet)}
                          >
                            <div className="flex justify-between items-center">
                              <span>Sheet #{sheet.sheetNumber}</span>
                              {isSheetDisabled(sheet) && (
                                <span className="text-xs text-red-500 ml-2">
                                  {sheet.status === "full_time"
                                    ? "full_time"
                                    : sheet.firstHalfName
                                    ? "First half taken"
                                    : sheet.lastHalfName
                                    ? "Last half taken"
                                    : ""}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3"
              disabled={form.formState.isSubmitting}
            >
              Add Student
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
