import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

export const BudgetsView: React.FC = () => {
  const { budgets, categorySpend, role, updateBudget } = useFinance();

  const handleBudgetChange = (category: string, value: string) => {
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      updateBudget(category, num);
    }
  };

  const categories = Object.keys(budgets);

  const chartData = categories.map(cat => ({
    name: cat,
    Budget: budgets[cat],
    Spent: categorySpend[cat] || 0
  }));

  const getProgressColor = (percent: number) => {
    if (percent < 70) return 'bg-emerald-500';
    if (percent >= 70 && percent <= 90) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Bars */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Category Budgets</h2>
            {role === 'admin' && <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">Edit Mode Active</span>}
          </div>

          {categories.map(cat => {
            const spent = categorySpend[cat] || 0;
            const budget = budgets[cat];
            const percent = budget > 0 ? (spent / budget) * 100 : 0;
            const displayPercent = Math.min(percent, 100);

            return (
              <div key={cat} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{cat}</span>
                  <div className="flex items-center space-x-2">
                    <span className={clsx(
                      "font-semibold", 
                      percent > 100 ? "text-rose-500" : percent >= 70 ? "text-amber-500" : "text-emerald-500"
                    )}>
                      ₹{spent.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">/</span>
                    {role === 'admin' ? (
                      <div className="relative flex items-center max-w-[100px]">
                        <span className="absolute left-2 text-muted-foreground text-xs">₹</span>
                        <input 
                          type="number"
                          value={budget}
                          onChange={(e) => handleBudgetChange(cat, e.target.value)}
                          className="w-full pl-5 pr-2 py-1 text-right text-xs bg-muted border border-border rounded focus:outline-none focus:border-primary"
                        />
                      </div>
                    ) : (
                      <span className="text-muted-foreground">₹{budget.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <div className="h-2.5 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={clsx("h-full transition-all duration-500", getProgressColor(percent))}
                    style={{ width: `${displayPercent}%` }}
                  ></div>
                </div>
                {percent > 100 && (
                  <p className="text-xs text-rose-500 mt-1">Overspent by ₹{(spent - budget).toLocaleString()}</p>
                )}
                {percent >= 70 && percent <= 90 && (
                  <p className="text-xs text-amber-500 mt-1">{(percent).toFixed(1)}% of budget used</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Budget vs Actual Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-6">Budget vs Actual</h2>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                <Tooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 20 }} />
                <Bar dataKey="Budget" fill="var(--primary)" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="Spent" fill="var(--destructive)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
