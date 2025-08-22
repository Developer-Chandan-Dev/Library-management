"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { createContactSubmission } from "@/lib/actions/contact.action";
import { toast } from 'sonner'

export default function ContactForm() {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    // Show loading toast
    const toastId = toast.loading("Submitting your message...");

    try {
      const result = await createContactSubmission({
        name,
        phone,
        email,
        message,
      });

      if (result.success) {
        // Show success toast
        toast.success("Form submitted successfully!", { id: toastId });
        
        // Reset form fields
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
      } else {
        // Show error toast
        toast.error(result.message || "Failed to submit form", { id: toastId });
      }
      
    } catch (error) {
      console.error("Error submitting form:", error);
      // Show error toast
      toast.error("An unexpected error occurred. Please try again.", { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <div className="shadow-input mx-auto w-full max-w-md bg-white py-4 rounded-2xl p-4 md:p-8 dark:bg-black">
      <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
        Welcome
      </h2>
      <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
        Send a contact message to us.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="fullname">Full name</Label>
            <Input
              id="fullname"
              placeholder="John Doe"
              type="text"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="phone">Phone no</Label>
            <Input
              id="phone"
              placeholder="9876543210"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            placeholder="example@gmail.com"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="message..."
            value={message}
            required
            onChange={(e) => setMessage(e.target.value)}
          />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] disabled:opacity-50"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Submitting..." : "Send →"}
          <BottomGradient />
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};