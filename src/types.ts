export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  type: TransactionType;
  description: string;
}

export type Role = 'admin' | 'viewer';
export type DateFilter = 'thisMonth' | 'lastMonth' | 'last3Months' | 'all';
export type Theme = 'light' | 'dark';
