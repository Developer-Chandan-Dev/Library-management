// src/components/user/AuthForm.tsx
"use client";
import { z } from "zod";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Loader2, Mail, User, BookOpen } from "lucide-react";

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
      const user =
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
      <AnimatePresence mode="wait">
        <motion.div
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <Card className="bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
                    <BookOpen className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {type === "sign-in" ? "Welcome Back" : "Create Account"}
                </h2>
                <p className="text-gray-300 mt-2">
                  {type === "sign-in"
                    ? "Sign in to access your digital library"
                    : "Join us to explore thousands of resources"}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {type === "sign-up" && (
                    <FormField
                      control={form.control}
                      name="fullname"
                      render={({ field }) => (
                        <FormItem>
                          <Label className="text-white">Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <FormControl>
                              <Input
                                placeholder="Enter your full name"
                                className="pl-10 bg-white/5 border-white/10 text-white"
                                {...field}
                              />
                            </FormControl>
                          </div>
                          <FormMessage className="text-red-400" />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-white">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              placeholder="Enter your email"
                              className="pl-10 bg-white/5 border-white/10 text-white"
                              {...field}
                            />
                          </FormControl>
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-red-400 text-sm text-center"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {type === "sign-in"
                          ? "Signing In..."
                          : "Creating Account..."}
                      </>
                    ) : type === "sign-in" ? (
                      "Sign In"
                    ) : (
                      "Sign Up"
                    )}
                  </Button>

                  {type === "sign-in" && (
                    <div className="text-center py-3">
                      <Link
                        href="/forgot-password"
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {/* Forgot your password? */}
                      </Link>
                    </div>
                  )}

                  <div className="text-center text-sm text-gray-300">
                    <p>
                      {type === "sign-in"
                        ? "Don't have an account?"
                        : "Already have an account?"}
                      <Link
                        href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                        className="ml-1 font-medium text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {type === "sign-in" ? "Sign Up" : "Sign In"}
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

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