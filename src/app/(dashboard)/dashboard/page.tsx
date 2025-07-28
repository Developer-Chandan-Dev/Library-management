"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SheetStatusChart } from "@/components/dashboard/SheetStatusChart";

const Dashboard = () => {
  // Dummy Data - Replace with Appwrite calls later
  const totalSheets = 60;
  const freeSheets = 20;
  const fullyOccupiedSheets = 25;
  const halfOccupiedSheets = 15; // Combines first/last half for simplicity in display

  // Dummy data for the chart, now including colors
  const chartData = [
    { name: "Free Sheets", value: freeSheets, color: "#82ca9d" },
    { name: "Fully Occupied", value: fullyOccupiedSheets, color: "#ffc658" },
    { name: "Half Occupied", value: halfOccupiedSheets, color: "#8884d8" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">📊 Dashboard Overview</h1>

      {/* Quick Links */}
      <div className="mb-6 flex gap-4">
        <Button asChild>
          <Link href="/dashboard/add-student">➕ Add Student</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/sheets">📚 View All Sheets</Link>
        </Button>
      </div>

      {/* Sheet Status Cards */}
      <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total Sheets" value={totalSheets} />
        <DashboardCard title="Free Sheets" value={freeSheets} />
        <DashboardCard title="Fully Occupied" value={fullyOccupiedSheets} />
        <DashboardCard title="Half Occupied" value={halfOccupiedSheets} />
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

// You'll likely put this in its own file: components/DashboardCard.tsx
interface DashboardCardProps {
  title: string;
  value: number;
}

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* Icon can go here */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* Optional: <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
      </CardContent>
    </Card>
  );
}
