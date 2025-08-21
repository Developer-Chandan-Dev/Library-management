// src/components/user/OTPModel.tsx
"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Mail, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { verifySecret, sendEmailOTP } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

interface OtpModalProps {
  accountId: string;
  email: string;
  type?: "sign-in" | "sign-up";
  isOpen?: boolean;
  onClose?: () => void;
}

const OtpModal = ({ accountId, email, type = "sign-in", isOpen = true, onClose }: OtpModalProps) => {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow numbers
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
    
    setError("");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter a valid 6-digit code");
      setIsLoading(false);
      return;
    }

    try {
      const sessionId = await verifySecret({ accountId, password: otpValue });

      if (sessionId) {
        setSuccess(type === "sign-in" ? "Successfully signed in!" : "Account created successfully!");
        
        // Redirect after a brief success message
        setTimeout(() => {
          router.push("/");
        }, 1500);
      }
    } catch (error) {
      console.log("Error", error);
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      await sendEmailOTP({ email });
      setSuccess("OTP has been resent to your email!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.log("Error: ", error);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-md w-[450px] bg-slate-900/95 backdrop-blur-md border border-white/10 text-white p-6 rounded-xl">
        <DialogHeader className="relative">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
              <Mail className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <DialogTitle className="text-xl sm:text-2xl font-bold text-center text-white">
            Enter Verification Code
          </DialogTitle>
          
          <DialogDescription className="text-center text-slate-300 mt-2">
            We've sent a 6-digit code to
            <br />
            <span className="font-medium text-white">{email}</span>
          </DialogDescription>
          
          {onClose && (
            <button
              onClick={onClose}
              className="absolute right-2 top-2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </DialogHeader>
        
        <div className="flex flex-col space-y-6 mt-4">
          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-900/30 border border-green-700/30 rounded-lg p-3 text-green-300 text-sm"
              >
                {success}
              </motion.div>
            )}
            
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/30 border border-red-700/30 rounded-lg p-3 text-red-300 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="flex justify-center space-x-2 sm:space-x-3">
            {otp.map((digit, index) => (
              <Input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-8 h-8 text-[14px] sm:w-12 sm:h-14 text-center sm:text-xl font-semibold bg-white/5 border-white/10 focus:border-blue-500 text-white"
                disabled={isLoading}
              />
            ))}
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading || otp.join("").length !== 6}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              type === "sign-in" ? "Sign In" : "Create Account"
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-400">
            Didn't receive the code?
            <Button
              type="button"
              variant="link"
              className="pl-1 text-blue-400 hover:text-blue-300 font-medium"
              onClick={handleResendOtp}
              disabled={isLoading}
            >
              Click to resend
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OtpModal;