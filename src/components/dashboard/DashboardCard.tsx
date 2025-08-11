// components/DashboardCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardCardProps {
  title: string | undefined | null;
  value: number | string | undefined | null;
  loading: boolean;
  icon?: React.ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  className?: string | undefined | null;
}

export function DashboardCard({ 
  title, 
  value, 
  loading, 
  icon,
  description,
  trend,
  trendValue,
  className,
}: DashboardCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-shadow duration-300 group ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-[70%]" />
        ) : (
          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
        )}
        
        {(description || trendValue) && (
          <div className="flex items-center mt-2">
            {trend === 'up' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-green-500"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {trend === 'down' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-red-500"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 5.22a.75.75 0 011.06 0L14 12.94V7.25a.75.75 0 011.5 0v7.5a.75.75 0 01-.75.75h-7.5a.75.75 0 010-1.5h5.69L5.22 6.28a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <p className="text-xs text-muted-foreground ml-1">
              {description && <span>{description}</span>}
              {trendValue && (
                <span className={trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : ''}>
                  {trendValue}
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}