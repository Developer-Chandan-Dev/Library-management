"use client";

import * as React from "react";
import {ID} from 'node-appwrite'
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
    id: z.string().optional(),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    father_name: z.string().min(2, {
        message: "Father name must be at least 2 characters.",
    }),
    phone: z.string().min(10, {
        message: "Phone number must be at least 10 digits.",
    }).optional(),
    slot: z.enum(["full_time", "first_half", "last_half"], {
        required_error: "Please select a time slot.",
    }),
    sheetNumber: z.number({
        error: "Please select a sheet.",
    }),
    address: z.string().min(2, {
        message: "Address must be at least 2 characters."
    })
});

interface AddStudentFormProps {
    mode?: "add" | "edit";
    studentData?: Partial<Student>;
    onSave: (student: Student) => Promise<boolean>;
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}


export function AddStudentForm({
                                   mode = "add",
                                   studentData,
                                   onSave,
                                   children,
                                   open,
                                   onOpenChange
                               }: AddStudentFormProps) {
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const { sheets } = useSheetAvailability();
    const [filteredSheets, setFilteredSheets] = React.useState<Sheet[]>([]);
    const [selectedSlot, setSelectedSlot] = React.useState<
        "full_time" | "first_half" | "last_half"
    >();

    const isOpen = open !== undefined ? open : isDialogOpen;
    const setIsOpen = onOpenChange || setIsDialogOpen;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            id: "",
            name: "",
            father_name: "",
            phone: "",
            slot: undefined,
            sheetNumber: 0,
            address: ""
        },
    });

    // Reset form with student data when the dialog opens or studentData changes
    React.useEffect(() => {
        if (isOpen && studentData) {
            form.reset({
                id: studentData.$id,
                name: studentData.name,
                father_name: studentData.father_name || "",
                phone: studentData.phone || "",
                slot: studentData.slot,
                sheetNumber: studentData.sheetNumber || 0,
                address: studentData.address || ""
            });
            setSelectedSlot(studentData.slot);
        }
    }, [isOpen, studentData, form]);

    // Filter sheets based on a selected time slot
    React.useEffect(() => {
        const subscription = form.watch((value, { name }) => {
            if (name === "slot") {
                const slot = value.slot;
                setSelectedSlot(slot as Student['slot']);

                if (!slot) {
                    setFilteredSheets([]);
                    return;
                }

                const filtered = sheets.filter((sheet) => {
                    const isCurrentSheet = mode === "edit" && studentData?.sheetNumber === sheet.sheetNumber;

                    if (slot === "full_time") {
                        return sheet.status === "free" || isCurrentSheet;
                    } else if (slot === "first_half") {
                        return (!sheet.firstHalfName && !sheet.fullTimeName) || isCurrentSheet;
                    } else if (slot === "last_half") {
                        return (!sheet.lastHalfName && !sheet.fullTimeName) || isCurrentSheet;
                    }
                    return false;
                });

                setFilteredSheets(filtered);
                if (name === "slot") form.setValue("sheetNumber", 0);
            }
        });
        return () => subscription.unsubscribe();
    }, [sheets, mode, studentData]);

    const isSheetDisabled = (sheet: Sheet) => {
        if (!selectedSlot) return true;
        if (mode === "edit" && studentData?.sheetNumber === sheet.sheetNumber) return false;
        if (sheet.status === "full") return true;

        if (selectedSlot === "full_time") return sheet.status !== "free";
        if (selectedSlot === "first_half") return !!sheet.firstHalfName;
        if (selectedSlot === "last_half") return !!sheet.lastHalfName;

        return false;
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            form.reset();
            setSelectedSlot(undefined);
        }
        setIsOpen(open);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const success = await onSave({
                $id: values.id?.toString() || ID.unique().toString(),
                name: values.name,
                slot: values.slot,
                sheetNumber: values.sheetNumber,
                phone: values.phone,
                father_name: values.father_name,
                address: values.address
            });

            if (success) {
                form.reset();
                setIsOpen(false);
                toast.success(`Student ${mode === "add" ? "Added" : "Updated"}`, {
                    description: `${values.name} has been ${mode === "add" ? "added to" : "updated in"} the system.`,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error("An error occurred", {
                description: `Failed to ${mode === "add" ? "add" : "update"} student.`,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {mode === "add" ? "Add New Student" : "Edit Student"}
                    </DialogTitle>
                    <DialogDescription>
                        {mode === "add"
                            ? "Fill out the form below to add a new student to the system."
                            : "Update the student information below."}
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
                                        <FormLabel>Father's Name *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Father's name" {...field} />
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
                                            <Input
                                                placeholder="Enter phone number"
                                                {...field}
                                                type="tel"
                                                minLength={10}
                                                maxLength={10}
                                            />
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
                                        <FormLabel>Address *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter address" {...field} />
                                        </FormControl>
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
                                    {sheet.status === "full"
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
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700"
                                disabled={form.formState.isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                                        {mode === "add" ? "Adding..." : "Updating..."}
                  </span>
                                ) : (
                                    mode === "add" ? "Add Student" : "Update Student"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}