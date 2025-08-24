// src/components/settings/NotificationSettings.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  });

  const toggleNotification = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    
    const settingName = key === 'email' ? 'Email notifications' :
                       key === 'push' ? 'Push notifications' :
                       'Marketing emails';
    
    toast.success(`${settingName} ${value ? 'enabled' : 'disabled'}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Email Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive emails about your account
            </p>
          </div>
          <Switch
            checked={notifications.email}
            onCheckedChange={(value) => toggleNotification('email', value)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Push Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive browser notifications
            </p>
          </div>
          <Switch
            checked={notifications.push}
            onCheckedChange={(value) => toggleNotification('push', value)}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Marketing Emails</Label>
            <p className="text-sm text-muted-foreground">
              Receive offers and updates
            </p>
          </div>
          <Switch
            checked={notifications.marketing}
            onCheckedChange={(value) => toggleNotification('marketing', value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}