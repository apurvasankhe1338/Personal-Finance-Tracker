
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "@/components/ui/card";
import { Category } from "@/types/transaction";

interface CategoryPieChartProps {
  data: Record<Category, number>;
}

const COLORS = {
  Food: "#FF6B6B",
  Transport: "#4ECDC4",
  Housing: "#45B7D1",
  Entertainment: "#96CEB4",
  Shopping: "#FFEEAD",
  Healthcare: "#D4A5A5",
  Education: "#9B9B9B",
  Utilities: "#FFD93D",
  Others: "#6C5B7B",
};

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  const chartData = Object.entries(data).map(([category, amount]) => ({
    category,
    amount,
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No data available. Add transactions to see category breakdown.
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ name, percent }) =>
              `${name} (${(percent * 100).toFixed(0)}%)`
            }
            labelLine={true}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.category as Category]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value;
                const formattedValue = typeof value === 'number' ? value.toFixed(2) : value;
                return (
                  <Card className="p-2 border bg-background">
                    <p className="text-muted-foreground">
                      {payload[0].name}
                    </p>
                    <p className="font-bold">${formattedValue}</p>
                  </Card>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
