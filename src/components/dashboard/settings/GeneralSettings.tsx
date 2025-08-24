// src/components/settings/GeneralSettings.tsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Save, Loader2 } from "lucide-react";
import { getCurrentUser, updateUserProfile } from "@/lib/actions/user.actions";
import AvatarUpload from "./AvatarUpload";
import { User as UserType } from "@/types";

interface UserProfile {
  fullName: string;
  email: string;
  bio: string;
  location: string;
  avatar: string;
}

export default function GeneralSettings() {
  const [user, setUser] = useState<UserType | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    fullName: "",
    email: "",
    bio: "",
    location: "",
    avatar: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userData = await getCurrentUser();

      if (userData) {
        // Map Document to UserType
        const mappedUser: UserType = {
          $id: userData.$id,
          accountId: userData.accountId,
          avatar: userData.avatar,
          email: userData.email,
          fullName: userData.fullName,
          // Add other UserType fields if needed
        };
        setUser(mappedUser);

        setProfile({
          fullName: userData.fullName || "",
          email: userData.email || "",
          bio: userData.bio || "",
          location: userData.location || "",
          avatar: userData.avatar || "",
        });
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);

    try {
      const result = await updateUserProfile(profile);

      if (result) {
        const parsedResult = JSON.parse(result);
        if (parsedResult.success) {
          toast.success("Profile updated successfully");
          // Refresh user data
          await fetchUserData();
        } else {
          toast.error(parsedResult.error || "Failed to update profile");
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update profile.";
      console.error("Update error:", error);

      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 bg-muted rounded-full animate-pulse" />
            <div className="h-9 w-32 bg-muted rounded-md animate-pulse" />
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-20 bg-muted rounded animate-pulse" />
              <div className="h-10 w-full bg-muted rounded animate-pulse" />
            </div>
          ))}
          <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">
            Unable to load user data. Please try again.
          </p>
          <Button onClick={fetchUserData} variant="outline" className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={profile.avatar} alt={profile.fullName} />
            <AvatarFallback className="text-lg">
              {profile.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <AvatarUpload
              currentAvatar={profile.avatar}
              onAvatarUpdate={(newAvatar) =>
                handleInputChange("avatar", newAvatar)
              }
            />
            <p className="text-xs text-muted-foreground mt-1">
              JPG, GIF or PNG. Max size 2MB.
            </p>
          </div>
          {/* <div>
            <Button variant="outline" size="sm">
              Change Avatar
            </Button>
            <p className="text-xs text-muted-foreground mt-1">
              JPG, GIF or PNG. Max size 2MB.
            </p>
          </div> */}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              value={profile.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              className="pl-10"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="pl-10"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Input
            id="bio"
            value={profile.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            placeholder="Tell us about yourself"
          />
          <p className="text-xs text-muted-foreground">
            Brief description for your profile.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profile.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="Your location"
          />
        </div>

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
