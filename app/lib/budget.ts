// Logika bisnis budget. Hanya dipakai di server (Route Handler).
import type { SupabaseClient } from "@supabase/supabase-js";
import type { BudgetSummary } from "@/app/lib/budget-types";

const pad = (n: number) => String(n).padStart(2, "0");
const round2 = (n: number) => Math.round(n * 100) / 100;

/** Validasi bulan & tahun dari query string / body. null jika tidak valid. */
export function parseMonthYear(monthRaw: unknown, yearRaw: unknown) {
  const month = Number(monthRaw);
  const year = Number(yearRaw);
  if (!Number.isInteger(month) || month < 1 || month > 12) return null;
  if (!Number.isInteger(year) || year < 2000 || year > 2100) return null;
  return { month, year };
}

/** Rentang tanggal [awal bulan, awal bulan berikutnya). */
function monthRange(month: number, year: number) {
  const start = `${year}-${pad(month)}-01`;
  const end = month === 12 ? `${year + 1}-01-01` : `${year}-${pad(month + 1)}-01`;
  return { start, end };
}

/**
 * Fitur 2 & 4: ambil budget bulan terpilih, hitung total pengeluaran
 * di bulan itu, lalu sisa = budget - total_pengeluaran.
 */
export async function getBudgetSummary(
  supabase: SupabaseClient,
  userId: string,
  month: number,
  year: number,
): Promise<BudgetSummary> {
  const { start, end } = monthRange(month, year);

  // WHERE user_id = current_user_id ditulis eksplisit, ditambah RLS di database.
  const [budgetRes, expenseRes] = await Promise.all([
    supabase
      .from("budgets")
      .select("amount")
      .eq("user_id", userId)
      .eq("month", month)
      .eq("year", year)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("amount")
      .eq("user_id", userId)
      .eq("type", "expense")
      .gte("transaction_date", start)
      .lt("transaction_date", end),
  ]);

  if (budgetRes.error) throw new Error(`Gagal membaca budget: ${budgetRes.error.message}`);
  if (expenseRes.error) throw new Error(`Gagal membaca transaksi: ${expenseRes.error.message}`);

  const budget = budgetRes.data ? Number(budgetRes.data.amount) : null;
  const totalExpense = round2(
    (expenseRes.data ?? []).reduce((sum, row) => sum + (Number(row.amount) || 0), 0),
  );

  return {
    month,
    year,
    budget,
    totalExpense,
    remaining: budget === null ? null : round2(budget - totalExpense),
  };
}