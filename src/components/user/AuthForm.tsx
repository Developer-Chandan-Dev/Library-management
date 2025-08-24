// src/components/user/AuthForm.tsx
"use client";
import { z } from "zod";
import React, { useState } from "react";
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
import { createAccount, signInUser } from "@/lib/actions/user.actions";
import { Label } from "../ui/label";
import { Loader2, Mail, User, BookOpen, Lock, Eye, EyeOff } from "lucide-react";

// Interface for the AuthForm component props
interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

// Updated schemas to include password fields
const signInSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signUpSchema = z
  .object({
    fullname: z
      .string()
      .min(2, { message: "Fullname must be at least 2 characters." }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const AuthForm = ({ type }: AuthFormProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Define form schema based on type
  const schema = type === "sign-in" ? signInSchema : signUpSchema;

  // Set default values
  const defaultValue =
    type === "sign-in"
      ? { email: "", password: "" }
      : { fullname: "", email: "", password: "", confirmPassword: "" };

  // Use a union type to allow both sign-in and sign-up fields
  type AuthFormFields = z.infer<typeof signInSchema> &
    Partial<z.infer<typeof signUpSchema>>;

  const form = useForm<AuthFormFields>({
    resolver: zodResolver(schema),
    defaultValues: defaultValue,
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof schema>) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      if (type === "sign-up") {
        const { confirmPassword, ...signUpData } = values as z.infer<
          typeof signUpSchema
        >;
        const result = await createAccount({
          fullName: signUpData.fullname,
          email: signUpData.email,
          password: signUpData.password,
        });

        if (result) {
          const parsedResult = JSON.parse(result);
          if (parsedResult.success) {
            setSuccess("Account created successfully! Redirecting...");
            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
          } else {
            setError(parsedResult.error || "Failed to create account");
          }
        }
      } else {
        const result = await signInUser({
          email: values.email,
          password: values.password,
        });

        if (result) {
          const parsedResult = JSON.parse(result);
          if (parsedResult.success) {
            setSuccess("Signed in successfully! Redirecting...");
            // Redirect after a short delay
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 1500);
          } else {
            setError(parsedResult.error || "Failed to sign in");
          }
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <Label className="text-white">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={
                              type === "sign-in"
                                ? "Enter your password"
                                : "Create a password"
                            }
                            className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                {type === "sign-up" && (
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-white">Confirm Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <FormControl>
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              className="pl-10 pr-10 bg-white/5 border-white/10 text-white"
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-300"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <FormMessage className="text-red-400" />
                      </FormItem>
                    )}
                  />
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm text-center"
                  >
                    {error}
                  </motion.p>
                )}

                {success && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-green-400 text-sm text-center"
                  >
                    {success}
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
                      Forgot your password?
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
  );
};

export default AuthForm;
