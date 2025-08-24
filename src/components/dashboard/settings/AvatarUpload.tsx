// src/components/settings/AvatarUpload.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { updateUserAvatar } from "@/lib/actions/user.actions";

interface AvatarUploadProps {
  currentAvatar: string;
  onAvatarUpdate: (newAvatar: string) => void;
}

export default function AvatarUpload({ onAvatarUpdate }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB");
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload to a storage service first
      // For now, we'll use a placeholder or convert to data URL
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUrl = e.target?.result as string;
        
        // Simulate upload - replace with actual upload logic
        setTimeout(async () => {
          // For demo purposes, we'll use the data URL directly
          // In production, upload to storage and get the URL
          const result = await updateUserAvatar(dataUrl);
          
          if (result) {
            const parsedResult = JSON.parse(result);
            if (parsedResult.success) {
              onAvatarUpdate(dataUrl);
              toast.success("Avatar updated successfully");
            } else {
              toast.error(parsedResult.error || "Failed to update avatar");
            }
          }
          setIsUploading(false);
        }, 1000);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar");
      setIsUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
          disabled={isUploading}
        />
        <label htmlFor="avatar-upload">
          <Button variant="outline" className="mt-4" size="sm" asChild disabled={isUploading}>
            <span>
              {isUploading ? "Uploading..." : "Change Avatar"}
            </span>
          </Button>
        </label>
      </div>
    </div>
  );
}