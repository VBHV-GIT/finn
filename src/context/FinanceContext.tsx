import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Transaction, Role, DateFilter, Theme } from '../types';
import { initialTransactions, initialBudgets } from '../mockData';
import { isThisMonth, isWithinInterval, subMonths, startOfMonth, parseISO, isSameMonth } from 'date-fns';

interface FinanceContextType {
  transactions: Transaction[];
  filteredTransactions: Transaction[];
  budgets: Record<string, number>;
  role: Role;
  dateFilter: DateFilter;
  theme: Theme;
  setRole: (role: Role) => void;
  setDateFilter: (filter: DateFilter) => void;
  toggleTheme: () => void;
  addTransaction: (t: Transaction) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateBudget: (category: string, amount: number) => void;
  categorySpend: Record<string, number>;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [budgets, setBudgets] = useState<Record<string, number>>(initialBudgets);
  const [role, setRole] = useState<Role>('viewer');
  const [dateFilter, setDateFilter] = useState<DateFilter>('thisMonth');
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const filteredTransactions = useMemo(() => {
    const today = new Date();
    return transactions.filter(t => {
      const d = parseISO(t.date);
      if (dateFilter === 'thisMonth') return isThisMonth(d);
      if (dateFilter === 'lastMonth') {
        const lastMonth = subMonths(new Date(), 1);
        return isSameMonth(d, lastMonth);
      }
      if (dateFilter === 'last3Months') {
        const start = startOfMonth(subMonths(today, 2));
        return isWithinInterval(d, { start, end: today });
      }
      return true;
    });
  }, [transactions, dateFilter]);

  const { categorySpend, totalIncome, totalExpenses } = useMemo(() => {
    const defaultSpend = Object.keys(budgets).reduce((acc, cat) => ({...acc, [cat]: 0}), {} as Record<string, number>);
    
    let income = 0;
    let expenses = 0;

    const spend = filteredTransactions.reduce((acc, t) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        expenses += t.amount;
      } else {
        income += t.amount;
      }
      return acc;
    }, defaultSpend);

    return { categorySpend: spend, totalIncome: income, totalExpenses: expenses };
  }, [filteredTransactions, budgets]);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const addTransaction = (t: Transaction) => setTransactions(prev => [...prev, t]);
  const updateTransaction = (t: Transaction) => setTransactions(prev => prev.map(p => p.id === t.id ? t : p));
  const deleteTransaction = (id: string) => setTransactions(prev => prev.filter(p => p.id !== id));
  const updateBudget = (category: string, amount: number) => setBudgets(prev => ({...prev, [category]: amount}));
  

  return (
    <FinanceContext.Provider value={{
      transactions, filteredTransactions, budgets, role, dateFilter, theme,
      setRole, setDateFilter, toggleTheme, addTransaction, updateTransaction,
      deleteTransaction, updateBudget, categorySpend, totalIncome, totalExpenses, savingsRate
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};
