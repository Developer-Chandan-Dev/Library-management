"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSheetAvailability } from "@/context/SheetAvailabilityContext";
import { Student, Sheet } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  father_name: z.string().min(2,
    {message: "Father name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  slot: z.enum(["full_time", "first_half", "last_half"], {
    error: "Please select a time slot.",
  }),
  sheetNumber: z.number(),
  address: z.string().min(2, {
        message: "Address must be at least 2 characters."
  })
});

interface AddStudentFormProps {
  onAddStudent: (student: Student) => void;
  children: React.ReactNode; // For trigger element
  open?: boolean; // Optional controlled open state
  onOpenChange?: (open: boolean) => void; // For controlled state
}

export function AddStudentForm({
                                 onAddStudent,
                                 children,
                                 open,
                                 onOpenChange
                               }: AddStudentFormProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { sheets, updateSheet } = useSheetAvailability();
  const [filteredSheets, setFilteredSheets] = React.useState<Sheet[]>([]);
  const [selectedSlot, setSelectedSlot] = React.useState<
      "full_time" | "first_half" | "last_half"
  >();

  // Handle both controlled and uncontrolled open state
  const isOpen = open !== undefined ? open : isDialogOpen;
  const setIsOpen = onOpenChange || setIsDialogOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      father_name: "",
      phone: "",
      slot: undefined,
      sheetNumber: 0,
      address: ""
    },
  });

  // Filter sheets based on a selected time slot
  React.useEffect(() => {
    const slot = form.watch("slot");
    setSelectedSlot(slot);

    if (!slot) {
      setFilteredSheets([]);
      return;
    }

    const filtered = sheets.filter((sheet) => {
      if (sheet.status === "full_time") return false;
    console.log(slot);
      if (slot === "full_time") {
        return sheet.status === "free";
      } else if (slot === "first_half") {
        return !sheet.firstHalfName && !sheet.fullTimeName;
      } else if (slot === "last_half") {
        return !sheet.lastHalfName && !sheet.fullTimeName;
      }
      return false;
    });
    console.log(filtered);

    setFilteredSheets(filtered);
    form.resetField("sheetNumber");
  }, [form.watch("slot"), sheets]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    const newStudent: Student = {
      // stu_id: `s${Date.now()}`,
      name: values.name,
      slot: values.slot,
      sheetNumber: values.sheetNumber,
      phone: values.phone || undefined,
      father_name: values.father_name,
      address: values.address
    };

    updateSheet(values.sheetNumber, values.slot, values.name);
    onAddStudent(newStudent);

    form.reset();
    setSelectedSlot(undefined);
    setIsOpen(false);

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

  // Reset form when the dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
      setSelectedSlot(undefined);
    }
    setIsOpen(open);
  };

  return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>

        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Student</DialogTitle>
            <DialogDescription>
              Fill out the form below to add a new student to the system.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

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
                    name="father_name"
                    render={({ field }) => (
                        <FormItem>
                          <FormLabel>Father&apos; Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Your father name" {...field} />
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
                            <Input placeholder="Enter phone number" {...field} minLength={0} maxLength={10} />
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
                      name="address"
                      render={({ field }) => (
                          <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                  <Input placeholder="Enter your address..." {...field} />
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
                          <Select
                              onValueChange={field.onChange}
                              value={field.value}
                          >
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
                                        ? "Full"
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

              <DialogFooter>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700"
                    disabled={form.formState.isSubmitting}
                >
                  Add Student
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
  );
}