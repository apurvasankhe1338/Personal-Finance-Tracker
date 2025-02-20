
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Transaction, Budget, Category } from "@/types/transaction";

interface BudgetComparisonChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetComparisonChart({ transactions, budgets }: BudgetComparisonChartProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const spendingByCategory = monthlyTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<Category, number>);

  const chartData = budgets.map((budget) => ({
    category: budget.category,
    budget: budget.amount,
    spent: spendingByCategory[budget.category] || 0,
    remaining: Math.max(
      budget.amount - (spendingByCategory[budget.category] || 0),
      0
    ),
  }));

  if (chartData.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No budgets set. Add your first budget above.
      </div>
    );
  }

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <Card className="p-3 border bg-background">
                    <p className="font-semibold">{payload[0].payload.category}</p>
                    <p className="text-sm">
                      Budget: ${payload[0].payload.budget.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Spent: ${payload[0].payload.spent.toFixed(2)}
                    </p>
                    <p className="text-sm">
                      Remaining: ${payload[0].payload.remaining.toFixed(2)}
                    </p>
                  </Card>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar dataKey="spent" fill="#ef4444" name="Spent" />
          <Bar dataKey="remaining" fill="#22c55e" name="Remaining" stackId="a" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
