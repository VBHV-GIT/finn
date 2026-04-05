import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { TrendingUp, TrendingDown, AlertCircle, PiggyBank, CreditCard } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { totalIncome, totalExpenses, savingsRate, budgets, categorySpend } = useFinance();

  const totalBudget = Object.values(budgets).reduce((acc, val) => acc + val, 0);
  const remainingGlobalBudget = totalBudget - totalExpenses;

  // Find over-budget categories
  const overBudgetCategories = Object.keys(budgets).filter(cat => {
    return (categorySpend[cat] || 0) > budgets[cat];
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Income"
          amount={`₹${totalIncome.toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5 text-emerald-500" />}
        />
        <Card
          title="Total Expenses"
          amount={`₹${totalExpenses.toLocaleString()}`}
          icon={<TrendingDown className="w-5 h-5 text-rose-500" />}
        />
        <Card
          title="Remaining Budget"
          amount={`₹${remainingGlobalBudget.toLocaleString()}`}
          subtitle={`of ₹${totalBudget.toLocaleString()} total budget`}
          icon={<CreditCard className="w-5 h-5 text-indigo-500" />}
        />
        <Card
          title="Savings Rate"
          amount={`${savingsRate.toFixed(1)}%`}
          icon={<PiggyBank className="w-5 h-5 text-teal-500" />}
        />
      </div>

      {/* Alerts Section */}
      {overBudgetCategories.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="text-destructive font-medium">Budget Alerts</h3>
            <p className="text-destructive/80 text-sm mt-1">
              You have exceeded your budget in {overBudgetCategories.length} categor{overBudgetCategories.length === 1 ? 'y' : 'ies'}: <span className="font-semibold">{overBudgetCategories.join(', ')}</span>.
            </p>
          </div>
        </div>
      )}

      {/* Dashboard Charts / Extras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-card-foreground">Quick Insights</h3>
          <ul className="space-y-3">
            {Object.entries(categorySpend)
              .filter(([_, amount]) => amount > 0)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 3)
              .map(([category, amount], idx) => (
                <li key={category} className="flex justify-between items-center text-sm">
                  <span className="flex items-center text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold mr-3">{idx + 1}</span>
                    {category}
                  </span>
                  <span className="font-medium">₹{amount.toLocaleString()}</span>
                </li>
              ))}
            {Object.keys(categorySpend).length === 0 && (
              <p className="text-sm text-muted-foreground">No spending recorded for this period.</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, amount, icon, subtitle }: { title: string, amount: string, icon: React.ReactNode, subtitle?: string }) => (
  <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-4">
      <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="p-2 bg-secondary rounded-lg">
        {icon}
      </div>
    </div>
    <div>
      <p className="text-2xl font-bold text-card-foreground">{amount}</p>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  </div>
);
