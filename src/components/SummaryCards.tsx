
import { Card } from "@/components/ui/card";
import { Transaction, Category } from "@/types/transaction";

interface SummaryCardsProps {
  transactions: Transaction[];
}

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const totalExpenses = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const categoryTotals = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<Category, number>);

  const topCategory = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  )[0];

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Total Expenses
        </h3>
        <p className="text-2xl font-bold mt-2">
          ${totalExpenses.toFixed(2)}
        </p>
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Top Category
        </h3>
        <p className="text-2xl font-bold mt-2">
          {topCategory ? topCategory[0] : "N/A"}
        </p>
        {topCategory && (
          <p className="text-sm text-muted-foreground mt-1">
            ${topCategory[1].toFixed(2)}
          </p>
        )}
      </Card>
      <Card className="p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          Recent Activity
        </h3>
        <div className="mt-2 space-y-2">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center text-sm"
            >
              <span className="truncate">{transaction.description}</span>
              <span className="font-medium">
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
