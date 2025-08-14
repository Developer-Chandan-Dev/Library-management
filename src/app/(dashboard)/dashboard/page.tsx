"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SheetStatusChart } from "@/components/dashboard/SheetStatusChart";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { useEffect, useState } from "react";
import { ClipboardCheck, DivideCircle, FilePlus2, Layers } from "lucide-react";

interface SheetStats {
  total: number;
  free: number;
  full: number;
  half: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<SheetStats | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/dashboard/sheet-stats");
        const data: SheetStats = await res.json();
        console.log("Sheet data", data);
        setStats(data);
      } catch (error) {
        console.error("Failed to load sheet stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Dummy data for the chart, now including colors
  const chartData = [
    { name: "Free Sheets", value: stats?.free, color: "#82ca9d" },
    { name: "Fully Occupied", value: stats?.full, color: "#ffc658" },
    { name: "Half Occupied", value: stats?.half, color: "#8884d8" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">📊 Dashboard Overview</h1>

      {/* Quick Links */}
      <div className="mb-6 flex gap-4">
        <Button asChild>
          <Link href="/dashboard/students">➕ Add Student</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/sheets">📚 View All Sheets</Link>
        </Button>
      </div>

      {/* Sheet Status Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Sheets"
          loading={loading}
          value={stats?.total}
          icon={<Layers className="h-4 w-4 text-blue-600 dark:text-blue-300" />}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
        />
        <DashboardCard
          title="Free Sheets"
          loading={loading}
          value={stats?.free}
          icon={
            <ClipboardCheck className="h-4 w-4 text-green-600 dark:text-green-300" />
          }
          className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30"
        />
        <DashboardCard
          title="Fully Occupied"
          loading={loading}
          value={stats?.full}
          icon={
            <DivideCircle className="h-4 w-4 text-amber-600 dark:text-amber-300" />
          }
          className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30"
        />
        <DashboardCard
          title="Half Occupied"
          loading={loading}
          value={stats?.half}
          icon={
            <FilePlus2 className="h-4 w-4 text-gray-600 dark:text-gray-300" />
          }
          className="bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-800/30 dark:to-slate-800/30"
        />
      </div>

      {/* Chart and Filters */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sheet Occupancy Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Pass the chartData to the SheetStatusChart component */}
            <SheetStatusChart data={chartData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Filters</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button variant="outline">Show Free</Button>
            <Button variant="outline">Show Fully Occupied</Button>
            <Button variant="outline">Show Half Occupied</Button>
            <Button variant="secondary">Show All</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
