// components/DashboardCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardCardProps {
  title: string | undefined | null;
  value: number | string | undefined | null;
  loading: boolean;
  // You can add an icon prop here later if needed
  // icon?: React.ReactNode;
}

export function DashboardCard({ title, value, loading }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {/* {icon} */}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? 'Loading...' :value}</div>
        {/* Optional: Add a description or trend text */}
        {/* <p className="text-xs text-muted-foreground">+X% from the last period </p> */}
      </CardContent>
    </Card>
  );
}