
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { MonthlyChart } from "@/components/MonthlyChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { SummaryCards } from "@/components/SummaryCards";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetComparisonChart } from "@/components/BudgetComparisonChart";
import { SpendingInsights } from "@/components/SpendingInsights";
import { Transaction, Category, Budget } from "@/types/transaction";
import { format } from "date-fns";

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now().toString() }]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const addOrUpdateBudget = (newBudget: Budget) => {
    setBudgets((prevBudgets) => {
      const existingIndex = prevBudgets.findIndex(
        (b) => b.category === newBudget.category
      );
      if (existingIndex >= 0) {
        return prevBudgets.map((b, index) =>
          index === existingIndex ? newBudget : b
        );
      }
      return [...prevBudgets, newBudget];
    });
  };

  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = format(new Date(transaction.date), "MMMM");
    acc[month] = (acc[month] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = transactions.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<Category, number>);

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Personal Finance Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your expenses, set budgets, and get insights
          </p>
        </header>

        <SummaryCards transactions={transactions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4">Add Transaction</h2>
            <TransactionForm onSubmit={addTransaction} />
          </Card>

          <Card className="p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4">Set Monthly Budget</h2>
            <BudgetForm onSubmit={addOrUpdateBudget} existingBudgets={budgets} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4">Monthly Expenses</h2>
            <MonthlyChart data={monthlyData} />
          </Card>

          <Card className="p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4">Category Breakdown</h2>
            <CategoryPieChart data={categoryData} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4">Budget vs Actual</h2>
            <BudgetComparisonChart transactions={transactions} budgets={budgets} />
          </Card>

          <Card className="p-6 animate-slide-up">
            <h2 className="text-2xl font-semibold mb-4">Spending Insights</h2>
            <SpendingInsights transactions={transactions} budgets={budgets} />
          </Card>
        </div>

        <Card className="p-6 animate-slide-up">
          <h2 className="text-2xl font-semibold mb-4">Recent Transactions</h2>
          <TransactionList transactions={transactions} onDelete={deleteTransaction} />
        </Card>
      </div>
    </div>
  );
};

export default Index;
