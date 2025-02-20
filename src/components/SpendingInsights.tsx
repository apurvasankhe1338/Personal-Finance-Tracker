
import { Card } from "@/components/ui/card";
import { Transaction, Budget } from "@/types/transaction";

interface SpendingInsightsProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function SpendingInsights({ transactions, budgets }: SpendingInsightsProps) {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyTransactions = transactions.filter((t) => {
    const date = new Date(t.date);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });

  const spendingByCategory = monthlyTransactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const insights = budgets.map((budget) => {
    const spent = spendingByCategory[budget.category] || 0;
    const remaining = budget.amount - spent;
    const percentage = (spent / budget.amount) * 100;

    let status: "good" | "warning" | "danger" = "good";
    let message = "";

    if (percentage >= 100) {
      status = "danger";
      message = "Over budget! Consider reducing expenses.";
    } else if (percentage >= 80) {
      status = "warning";
      message = "Close to budget limit. Monitor spending.";
    } else {
      message = "Within budget. Keep it up!";
    }

    return {
      category: budget.category,
      spent,
      remaining,
      percentage,
      status,
      message,
    };
  });

  if (insights.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Set budgets to see spending insights.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {insights.map((insight) => (
        <Card
          key={insight.category}
          className={`p-4 border-l-4 ${
            insight.status === "danger"
              ? "border-l-red-500"
              : insight.status === "warning"
              ? "border-l-yellow-500"
              : "border-l-green-500"
          }`}
        >
          <h3 className="font-semibold">{insight.category}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm">
              Spent: ${insight.spent.toFixed(2)} of ${insight.remaining + insight.spent}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  insight.status === "danger"
                    ? "bg-red-500"
                    : insight.status === "warning"
                    ? "bg-yellow-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(insight.percentage, 100)}%` }}
              ></div>
            </div>
            <p
              className={`text-sm ${
                insight.status === "danger"
                  ? "text-red-600"
                  : insight.status === "warning"
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {insight.message}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
