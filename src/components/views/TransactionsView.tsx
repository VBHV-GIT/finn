import React, { useState, useMemo } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Search, Download, Trash2, Edit, Plus } from 'lucide-react';
import clsx from 'clsx';
import { format, parseISO } from 'date-fns';

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

export const TransactionsView: React.FC = () => {
  const { filteredTransactions, role, deleteTransaction } = useFinance();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('date-desc');

  const processedTransactions = useMemo(() => {
    let result = [...filteredTransactions];
    
    // Search
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.description.toLowerCase().includes(q) || 
        t.category.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sort) {
        case 'date-asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'date-desc': return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'amount-asc': return a.amount - b.amount;
        case 'amount-desc': return b.amount - a.amount;
        default: return 0;
      }
    });

    return result;
  }, [filteredTransactions, search, sort]);

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = processedTransactions.map(t => [
      t.id, t.date, t.type, t.category, `"${t.description}"`, t.amount
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search transactions..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select 
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary flex-1 sm:flex-none"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
          
          <button 
            onClick={exportCSV}
            className="flex items-center px-3 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:opacity-90 font-medium transition-opacity"
          >
            <Download className="w-4 h-4 mr-2" />
            CSV
          </button>
          
          {role === 'admin' && (
            <button className="flex items-center px-3 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Add</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 text-secondary-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium text-right">Amount</th>
                {role === 'admin' && <th className="px-6 py-4 font-medium text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {processedTransactions.length > 0 ? (
                processedTransactions.map((t) => (
                  <tr key={t.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-muted-foreground">{format(parseISO(t.date), 'MMM dd, yyyy')}</td>
                    <td className="px-6 py-4 font-medium">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {t.category}
                      </span>
                    </td>
                    <td className={clsx(
                      "px-6 py-4 text-right font-medium",
                      t.type === 'income' ? 'text-emerald-500' : 'text-foreground'
                    )}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </td>
                    {role === 'admin' && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'admin' ? 5 : 4} className="px-6 py-8 text-center text-muted-foreground">
                    No transactions found for the selected period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
