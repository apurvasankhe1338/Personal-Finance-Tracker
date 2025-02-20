
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Card } from "@/components/ui/card";

interface MonthlyChartProps {
  data: Record<string, number>;
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const chartData = Object.entries(data).map(([month, amount]) => ({
    month,
    amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No data available. Add transactions to see your monthly expenses.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <XAxis
            dataKey="month"
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
                return (
                  <Card className="p-2 border bg-background">
                    <p className="text-muted-foreground">{payload[0].payload.month}</p>
                    <p className="font-bold">${formattedValue}</p>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="amount"
            fill="hsl(var(--mint-500))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
