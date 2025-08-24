// src/components/settings/SecuritySettings.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Eye,
  EyeOff,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  updatePassword,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  verifyTwoFactorAuth,
} from "@/lib/actions/security.actions";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface TwoFactorData {
  secret: string;
  qrCode: string;
  verificationCode: string;
}

export default function SecuritySettings() {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData>({
    secret: "",
    qrCode: "",
    verificationCode: "",
  });
  const [is2FALoading, setIs2FALoading] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);

  const handlePasswordUpdate = async () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Passwords don't match");
      return;
    }

    if (passwords.new.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updatePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      if (result) {
        const parsedResult = JSON.parse(result);
        if (parsedResult.success) {
          toast.success("Password updated successfully");
          setPasswords({ current: "", new: "", confirm: "" });
        } else {
          toast.error(parsedResult.error || "Failed to update password");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to update password");
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEnable2FA = async () => {
    setIs2FALoading(true);
    try {
      const result = await enableTwoFactorAuth();

      if (result) {
        const parsedResult = JSON.parse(result);
        if (parsedResult.success) {
          setTwoFactorData({
            secret: parsedResult.secret,
            qrCode: parsedResult.qrCode,
            verificationCode: "",
          });
          setShow2FASetup(true);
          toast.info("Scan the QR code with your authenticator app");
        } else {
          toast.error(parsedResult.error || "Failed to enable 2FA");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to enable 2FA");
      }
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (
      !twoFactorData.verificationCode ||
      twoFactorData.verificationCode.length !== 6
    ) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIs2FALoading(true);
    try {
      const result = await verifyTwoFactorAuth(
        twoFactorData.verificationCode,
        twoFactorData.secret
      );

      if (result) {
        const parsedResult = JSON.parse(result);
        if (parsedResult.success) {
          setIs2FAEnabled(true);
          setShow2FASetup(false);
          toast.success("Two-factor authentication enabled successfully");
        } else {
          toast.error(parsedResult.error || "Invalid verification code");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to very 2FA");
      }
    } finally {
      setIs2FALoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIs2FALoading(true);
    try {
      const result = await disableTwoFactorAuth();

      if (result) {
        const parsedResult = JSON.parse(result);
        if (parsedResult.success) {
          setIs2FAEnabled(false);
          toast.success("Two-factor authentication disabled");
        } else {
          toast.error(parsedResult.error || "Failed to disable 2FA");
        }
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("Failed to dsable 2FA");
      }
    } finally {
      setIs2FALoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <div className="relative">
              <Input
                type={showCurrent ? "text" : "password"}
                value={passwords.current}
                onChange={(e) =>
                  setPasswords({ ...passwords, current: e.target.value })
                }
                placeholder="Enter current password"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showNew ? "text" : "password"}
                value={passwords.new}
                onChange={(e) =>
                  setPasswords({ ...passwords, new: e.target.value })
                }
                placeholder="Enter new password"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Confirm New Password</Label>
            <Input
              type="password"
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              placeholder="Confirm new password"
            />
          </div>

          <Button
            onClick={handlePasswordUpdate}
            disabled={
              isUpdating ||
              !passwords.current ||
              !passwords.new ||
              !passwords.confirm
            }
          >
            {isUpdating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Password"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication Card */}
      <Card>
        <CardHeader>
          <CardTitle>Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {is2FAEnabled ? (
            <div className="space-y-4">
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>Two-factor authentication is enabled</span>
              </div>
              <Button
                variant="outline"
                onClick={handleDisable2FA}
                disabled={is2FALoading}
              >
                {is2FALoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Disable 2FA"
                )}
              </Button>
            </div>
          ) : show2FASetup ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app (Google
                Authenticator, Authy, etc.)
              </div>

              {twoFactorData.qrCode && (
                <div className="flex justify-center">
                  <Image
                    src={twoFactorData.qrCode}
                    alt="QR Code for 2FA"
                    className="w-48 h-48 border rounded-lg"
                    width={192}
                    height={192}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Verification Code</Label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={twoFactorData.verificationCode}
                  onChange={(e) =>
                    setTwoFactorData({
                      ...twoFactorData,
                      verificationCode: e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6),
                    })
                  }
                  maxLength={6}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleVerify2FA}
                  disabled={
                    is2FALoading || twoFactorData.verificationCode.length !== 6
                  }
                >
                  {is2FALoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Verify & Enable"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShow2FASetup(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <XCircle className="h-5 w-5 mr-2" />
                <span>Two-factor authentication is disabled</span>
              </div>
              <Button onClick={handleEnable2FA} disabled={is2FALoading}>
                {is2FALoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Enable 2FA
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions Card */}
      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border divide-y">
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="font-medium">Current Session</p>
                <p className="text-sm text-muted-foreground">
                  This device • Active now
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Current
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Sign out of all other devices
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
