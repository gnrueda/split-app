export type UserName = string;

export interface Expense {
  id: string;
  payer: UserName;
  amount: number;
  desc: string;
  timestamp: string;
}

export interface Transaction {
  from: UserName;
  to: UserName;
  amount: number;
}

export interface SplitResult {
  transactions: Transaction[];
  totalExpenses: number;
}

export interface StorageSchema {
  users: UserName[];
  expenses: Expense[];
}

export type StorageKey = keyof StorageSchema;
