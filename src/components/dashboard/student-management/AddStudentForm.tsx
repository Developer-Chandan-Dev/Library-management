"use client";

import * as React from "react";
import { ID } from "node-appwrite";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Student} from "@/types";
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

const formSchema = z.object({
  $id: z.string().optional(),
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  father_name: z.string().min(2, {
    message: "Father name must be at least 2 characters.",
  }),
  email: z.string().optional(),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  join_date: z.string().optional(),
});

interface AddStudentFormProps {
  mode?: "add" | "edit";
  studentData?: Partial<Student>;
  onSave: (student: Student) => Promise<boolean>;
  children?: React.ReactNode; // Made optional
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddStudentForm({
  mode = "add",
  studentData,
  onSave,
  children,
  open,
  onOpenChange,
}: AddStudentFormProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isOpen = open !== undefined ? open : isDialogOpen;
  const setIsOpen = onOpenChange || setIsDialogOpen;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      $id: "",
      name: "",
      father_name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  // Reset form with student data when the dialog opens or studentData changes
  React.useEffect(() => {
    if (isOpen && studentData) {
      form.reset({
        $id: studentData.$id,
        name: studentData.name,
        father_name: studentData.father_name || "",
        phone: studentData.phone || "",
        email: studentData.email || "",
        address: studentData.address || "",
      });
    }
  }, [isOpen, studentData, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const success = await onSave({
        $id: values.$id?.toString() || ID.unique().toString(),
        name: values.name,
        father_name: values.father_name,
        phone: values.phone,
        email: values.email,
        address: values.address,
        slot: "full_time",
        sheetNumber: 0,
        join_date: ""
      });
      console.log("Success: ",success);
      if (success) {
        form.reset();
        setIsOpen(false);
        toast.success(`Student ${mode === "add" ? "Added" : "Updated"}`, {
          description: `${values.name} has been ${
            mode === "add" ? "added to" : "updated in"
          } the system.`,
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

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {open === undefined && <DialogTrigger asChild>{children}</DialogTrigger>}

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
                      <Input
                        placeholder="Enter student's full name"
                        {...field}
                      />
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
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
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {mode === "add" ? "Adding..." : "Updating..."}
                  </span>
                ) : mode === "add" ? (
                  "Add Student"
                ) : (
                  "Update Student"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
