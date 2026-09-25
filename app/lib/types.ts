export type Theme = "light" | "dark";
export type DefaultView = "all" | "income" | "expense";

export type PreferenceMap = {
  theme: Theme;
  default_view: DefaultView;
};
export type PreferenceKey = keyof PreferenceMap;

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  note: string | null;
};

export type DashboardSummary = {
  userName: string;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Transaction[];
};