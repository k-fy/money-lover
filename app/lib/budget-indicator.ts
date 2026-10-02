export type BudgetStatus = "safe" | "warning" | "overbudget";

export interface BudgetIndicatorResult {
  percentage: number;
  status: BudgetStatus;
  label: string;
  colorClass: string;
}

export function calculateBudgetStatus(
  budgetAmount: number,
  totalExpense: number,
): BudgetIndicatorResult {
  if (budgetAmount <= 0) {
    return {
      percentage: 0,
      status: "safe",
      label: "Belum ada anggaran",
      colorClass: "bg-gray-400",
    };
  }

  const percentage = Math.round((totalExpense / budgetAmount) * 1000) / 10;

  if (percentage < 75) {
    return { percentage, status: "safe", label: "Aman", colorClass: "bg-green-500" };
  }
  if (percentage < 100) {
    return { percentage, status: "warning", label: "Waspada", colorClass: "bg-yellow-500" };
  }
  return { percentage, status: "overbudget", label: "Melebihi Anggaran", colorClass: "bg-red-500" };
}