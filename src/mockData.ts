import { Transaction } from './types';
import { subDays, format } from 'date-fns';

const today = new Date();

export const initialTransactions: Transaction[] = [
  { id: '1', date: format(today, 'yyyy-MM-dd'), amount: 1500, category: 'Food', type: 'expense', description: 'Groceries' },
  { id: '2', date: format(today, 'yyyy-MM-dd'), amount: 50000, category: 'Salary', type: 'income', description: 'Monthly Salary' },
  { id: '3', date: format(subDays(today, 2), 'yyyy-MM-dd'), amount: 800, category: 'Transport', type: 'expense', description: 'Uber' },
  { id: '4', date: format(subDays(today, 5), 'yyyy-MM-dd'), amount: 12000, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
  { id: '5', date: format(subDays(today, 10), 'yyyy-MM-dd'), amount: 2500, category: 'Entertainment', type: 'expense', description: 'Concert Tickets' },
  { id: '6', date: format(subDays(today, 15), 'yyyy-MM-dd'), amount: 4500, category: 'Shopping', type: 'expense', description: 'New Shoes' },
  { id: '7', date: format(subDays(today, 32), 'yyyy-MM-dd'), amount: 1400, category: 'Food', type: 'expense', description: 'Dinner out' },
  { id: '8', date: format(subDays(today, 40), 'yyyy-MM-dd'), amount: 12000, category: 'Rent', type: 'expense', description: 'Apartment Rent' },
];

export const initialBudgets: Record<string, number> = {
  'Food': 10000,
  'Transport': 3000,
  'Rent': 15000,
  'Entertainment': 2000,
  'Shopping': 4000,
};
