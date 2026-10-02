export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number;
  category: string | null;
  description: string | null;
  transaction_date: string; // format: YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export type FilterType = 'all' | 'income' | 'expense';

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  category?: string;
  description?: string;
  transaction_date: string;
}
