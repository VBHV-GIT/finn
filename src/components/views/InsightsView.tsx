import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Lightbulb, TrendingUp, TrendingDown, RefreshCcw } from 'lucide-react';
import clsx from 'clsx';

export const InsightsView: React.FC = () => {
  const { categorySpend, budgets, savingsRate } = useFinance();

  // Fake AI Insights Generation
  const generateInsights = () => {
    const insights = [];
    const categories = Object.keys(categorySpend);
    
    // Check overspending
    for (const cat of categories) {
      if (categorySpend[cat] > (budgets[cat] || 0)) {
        const over = categorySpend[cat] - (budgets[cat] || 0);
        insights.push({
          type: 'warning',
          text: `You are overspending on ${cat} by ₹${over.toLocaleString()}. Consider reducing expenses here.`
        });
      }
    }

    // Check savings opportunities
    if (savingsRate > 20) {
      insights.push({
        type: 'success',
        text: `Great job! Your savings rate is ${savingsRate.toFixed(1)}%. You are doing excellent this period.`
      });
    } else if (savingsRate < 10 && savingsRate > 0) {
      insights.push({
        type: 'warning',
        text: `Your savings rate is a bit low (${savingsRate.toFixed(1)}%). Look for categories where you can cut back.`
      });
    } else if (savingsRate <= 0) {
      insights.push({
        type: 'danger',
        text: `You have spent more than you earned this period. Review your budgets immediately.`
      });
    }

    if (categorySpend['Entertainment'] && budgets['Entertainment'] && categorySpend['Entertainment'] < budgets['Entertainment']) {
        insights.push({
            type: 'default',
            text: `You can save ₹${(budgets['Entertainment'] - categorySpend['Entertainment']).toLocaleString()} by continuing your current trend in Entertainment.`
        });
    }

    return insights.length > 0 ? insights : [{ type: 'default', text: 'No significant insights generated for this period.' }];
  };

  const insights = generateInsights();

  // Mock trend data logic
  const mockTrends = Object.keys(categorySpend).slice(0, 4).map(cat => ({
    category: cat,
    amount: categorySpend[cat],
    trend: Math.random() > 0.5 ? 'up' : 'down',
    percent: Math.floor(Math.random() * 40) + 1
  }));

  const getInsightIconColor = (type: string) => {
    switch(type) {
      case 'warning': return 'text-amber-500 bg-amber-500/10';
      case 'danger': return 'text-rose-500 bg-rose-500/10';
      case 'success': return 'text-emerald-500 bg-emerald-500/10';
      default: return 'text-primary bg-primary/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Insights */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Lightbulb className="w-6 h-6 mr-2 text-amber-400" /> 
              Smart Insights
            </h2>
            <button className="text-sm font-medium text-muted-foreground flex items-center hover:text-foreground transition-colors">
              <RefreshCcw className="w-4 h-4 mr-1" />
              Refresh
            </button>
         </div>

         <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start p-4 rounded-lg bg-secondary/50 border border-border">
                <div className={clsx("p-2 rounded-full mr-4 shrink-0", getInsightIconColor(insight.type))}>
                   <Lightbulb className="w-5 h-5" />
                </div>
                <p className="text-sm leading-relaxed text-card-foreground pt-1">{insight.text}</p>
              </div>
            ))}
         </div>
      </div>

      {/* Spending Trends */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
         <h2 className="text-lg font-semibold mb-6 text-card-foreground">Spending Trends (vs previous period)</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockTrends.map((trend, idx) => (
              <div key={idx} className="p-4 border border-border rounded-lg bg-background">
                <h3 className="text-sm font-medium text-muted-foreground mb-1">{trend.category}</h3>
                <div className="flex items-end justify-between">
                  <span className="text-xl font-bold">₹{trend.amount.toLocaleString()}</span>
                  <div className={clsx(
                    "flex items-center text-xs font-semibold px-2 py-1 rounded-full",
                    trend.trend === 'up' ? 'text-rose-500 bg-rose-500/10' : 'text-emerald-500 bg-emerald-500/10'
                  )}>
                    {trend.trend === 'up' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1"/>}
                    {trend.percent}%
                  </div>
                </div>
              </div>
            ))}
         </div>
         {mockTrends.length === 0 && (
           <p className="text-muted-foreground text-sm">Not enough data to calculate trends.</p>
         )}
      </div>
    </div>
  );
};
