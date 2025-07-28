"use client";
import { z } from "zod";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import OtpModal from "./OTPModel";
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Interface for the AuthForm component props
interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

const signInSchema = z.object({
  fullname: z.string().optional(),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const signUpSchema = z.object({
  fullname: z
    .string()
    .min(2, { message: "Fullname must be at least 2 characters." }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [accountId, setAccountId] = React.useState(null);
  const [error, setError] = React.useState<string | null>(null);

  // 1. Define your form.
  const schema = type === "sign-in" ? signInSchema : signUpSchema;

  const defaultValue =
    type === "sign-in" ? { email: "" } : { fullname: "", email: "" };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    setError("");

    try {
      let user =
        type === "sign-up"
          ? await createAccount({
              fullName: values.fullname || "",
              email: values.email,
            })
          : await signInUser({ email: values.email });

      if (user) {
        const id = JSON.parse(user);
        setAccountId(id.accountId);
      } else {
        setError("No user data returned. Please try again.");
      }
    } catch {
      setError("Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <div
          onSubmit={form.handleSubmit(onSubmit)}
          className="shadow-input dark:shadow-input mx-auto w-full max-w-md rounded-sm bg-gray-200 p-4 md:rounded-2xl md:p-8 dark:bg-black"
        >
          <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
            {type === "sign-in" ? "Sign In" : "Sign Up"}
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
            Login to aceternity if you can because we don&apos;t have a login
            flow yet
          </p>
          <form className="my-8" onSubmit={form.handleSubmit(onSubmit)}>
            {type === "sign-up" && (
              <FormField
                control={form.control}
                name="fullname"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <LabelInputContainer>
                      <Label htmlFor="fullname" className="shad-form-label">
                        Full Name
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="Enter your full name"
                          className="shad-input"
                          id="fullname"
                          {...field}
                        />
                      </FormControl>
                    </LabelInputContainer>

                    <FormMessage className="shad-form-message" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <LabelInputContainer>
                    <Label className="shad-form-label">Email</Label>

                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>
                  </LabelInputContainer>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />

            <Button
              className="group/btn relative h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset] flex items-center gap-2"
              type="submit"
              disabled={isLoading}
            >
              <span>{type === "sign-in" ? "Sign In" : "Sign Up"}</span>
              {isLoading && <Loader2 className="ml-2 animate-spin size-6" />}
              <BottomGradient />
            </Button>

            {error && <p className="error-message">*{error}</p>}

            <div className="body-2 flex justify-center mt-4  text-[14px]">
              <p className="text-light-100 text-[14px]">
                {type === "sign-in"
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className="ml-1 font-medium text-brand"
              >
                {" "}
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </div>
          </form>
        </div>
      </Form>

      {accountId && (
        <OtpModal
          email={form.getValues("email")}
          accountId={String(accountId)}
        />
      )}
    </>
  );
};

export default AuthForm;

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
