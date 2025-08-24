// src/app/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { getCurrentUser, signOutUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Calendar,
  Shield,
  LogOut,
  Moon,
  Sun,
  Settings,
  BookOpen,
  CreditCard,
  Bell,
  Home,
} from "lucide-react";
import Link from "next/link";
import { User as UserType } from "@/types";

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
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
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to fetch user:", error);
      redirect("/sign-in");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    redirect("/sign-in");
  };

  if (!mounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center mb-8">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-48 mt-4" />
            <Skeleton className="h-4 w-32 mt-2" />
          </div>
          <div className="grid gap-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    redirect("/sign-in");
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-center">
          <Avatar className="h-32 w-32 mb-4 border-4 border-primary/10">
            <AvatarImage src={user.avatar} alt={user.fullName} />
            <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
              {getInitials(user.fullName)}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-3xl font-bold tracking-tight">{user.fullName}</h1>
          <p className="text-muted-foreground mt-2 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            {user.email}
          </p>

          <Badge variant="secondary" className="mt-4 px-3 py-1">
            <Shield className="h-3 w-3 mr-1" />
            Standard User
          </Badge>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Your personal details and account information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Full Name</Label>
                    <p className="font-medium">{user.fullName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Email Address
                    </Label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Account Type
                    </Label>
                    <p className="font-medium">Standard User</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Member Since
                    </Label>
                    <p className="font-medium flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Resources & Access
                  </CardTitle>
                  <CardDescription>
                    Your available resources and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Available Features</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Personal reading library
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Bookmarking system
                      </li>
                      <li className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                        Reading progress tracking
                      </li>
                    </ul>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                    <h4 className="font-medium mb-2 text-amber-800 dark:text-amber-400 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Access Information
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      You don't have admin privileges to access the dashboard.
                      Contact an administrator if you believe this is an error.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">
                        Email Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        Receive emails about your account activity
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="product-updates">Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new features and improvements
                      </p>
                    </div>
                    <Switch id="product-updates" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-emails">Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive offers and promotional content
                      </p>
                    </div>
                    <Switch id="marketing-emails" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 mr-2" />
                    ) : (
                      <Sun className="h-5 w-5 mr-2" />
                    )}
                    Appearance
                  </CardTitle>
                  <CardDescription>
                    Customize how the app looks on your device
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-mode">Dark Mode</Label>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4" />
                      <Switch
                        id="theme-mode"
                        checked={theme === "dark"}
                        onCheckedChange={(checked) => {
                          setTheme(checked ? "dark" : "light");
                        }}
                      />
                      <Moon className="h-4 w-4" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Billing Information
                </CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border p-6 text-center">
                  <div className="mb-4">
                    <Badge variant="outline">Free Plan</Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Current Plan</h3>
                  <p className="text-muted-foreground mb-6">
                    You're currently on the free plan with basic features
                  </p>
                  <Button>Upgrade to Premium</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Sign Out Button */}
        <div className="mt-8 flex justify-center items-center gap-2">
          <Link href="/">
            <Button variant="outline" className="flex items-center">
              <Home className="h-4 w-4 mr-2" />
              Back to home
            </Button>
          </Link>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
