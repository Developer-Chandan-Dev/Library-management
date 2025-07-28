// components/DashboardCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  value: number;
  // You can add an icon prop here later if needed
  // icon?: React.ReactNode;
}

export function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* {icon} */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* Optional: Add a description or trend text */}
        {/* <p className="text-xs text-muted-foreground">+X% from last period</p> */}
      </CardContent>
    </Card>
  );
}