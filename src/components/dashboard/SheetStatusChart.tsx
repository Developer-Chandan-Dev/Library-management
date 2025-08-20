import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

interface ChartData {
  name: string;
  value: number | undefined;
  color: string;
}

interface SheetStatusChartProps {
  data: (ChartData | undefined)[];
}

export function SheetStatusChart({ data }: SheetStatusChartProps) {
  // Filter out undefined values and entries with undefined values
  const validData = data.filter((entry): entry is ChartData =>
    entry !== undefined &&
    entry.value !== undefined &&
    typeof entry.value === 'number' &&
    !isNaN(entry.value)
  );

  const renderCustomizedLabel = (props: PieLabelRenderProps) => {
    // Extract properties with proper type checking
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    
    // Check if required properties exist and are numbers
    if (typeof cx !== 'number' || typeof cy !== 'number' || typeof midAngle !== 'number' ||
        typeof innerRadius !== 'number' || typeof outerRadius !== 'number' || typeof percent !== 'number') {
      return null;
    }

    // Additional check for valid numbers
    if (isNaN(cx) || isNaN(cy) || isNaN(midAngle) || isNaN(innerRadius) || isNaN(outerRadius) || isNaN(percent)) {
      return null;
    }

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Don't render if there's no valid data
  if (validData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={validData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={120}
          innerRadius={60}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
        >
          {validData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}