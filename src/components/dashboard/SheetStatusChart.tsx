// components/SheetStatusChart.tsx
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  color: string; // Add color to the interface
}


interface SheetStatusChartProps {
  data: ChartData[]; // Now expects data as a prop
}

export function SheetStatusChart({ data }: SheetStatusChartProps) {
  // Define custom labels for the pie chart if needed, or let Recharts handle default
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    // ResponsiveContainer ensures the chart scales with its parent
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" // Center X position
          cy="50%" // Center Y position
          labelLine={false} // Don't show lines to labels
          label={renderCustomizedLabel} // Use the custom label function
          outerRadius={120} // Size of the pie chart
          fill="#8884d8" // Default fill, overridden by Cell colors
          dataKey="value" // Which key in your data represents the value
        >
          {/* Map over your data to apply specific colors to each slice */}
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip /> {/* Shows data on hover */}
        <Legend /> {/* Shows legend for each slice */}
      </PieChart>
    </ResponsiveContainer>
  );
}