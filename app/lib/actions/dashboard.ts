"use server";

import { createClient } from "@/utils/supabase/server";
import type { DashboardSummary, DefaultView, Transaction } from "@/app/lib/types";

const VIEWS: DefaultView[] = ["all", "income", "expense"];

/**
 * Ringkasan dashboard untuk user yang sedang login (FR-03).
 * Mengembalikan null jika tidak ada sesi aktif.
 */
export async function getDashboardSummary(
  recentType: DefaultView = "all",
): Promise<DashboardSummary | null> {
  const supabase = await createClient();

  // getUser() memverifikasi token ke Supabase Auth (lebih aman dari getSession()).
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return null;

  const view = VIEWS.includes(recentType) ? recentType : "all";

  // 5 transaksi terbaru. Filter user_id eksplisit = pertahanan lapis kedua
  // di atas RLS (RLS tetap penjaga utamanya).
  let recentQuery = supabase
    .from("transactions")
    .select("id, type, amount, category, transaction_date, transaction_note")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(5);
  if (view !== "all") recentQuery = recentQuery.eq("type", view);

  // Jalankan paralel supaya waktu muat < 2 detik (NFR-02.1)
  const [totalsRes, recentRes] = await Promise.all([
    supabase.rpc("get_dashboard_totals"),
    recentQuery,
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  const totalsRow = Array.isArray(totalsRes.data) ? totalsRes.data[0] : null;
  if (!totalsRes.error && totalsRow) {
    totalIncome = Number(totalsRow.total_income) || 0;
    totalExpense = Number(totalsRow.total_expense) || 0;
  } else {
    // Cadangan kalau fungsi SQL belum dibuat: jumlahkan di server Next.js.
    console.warn("get_dashboard_totals gagal, pakai fallback:", totalsRes.error?.message);
    const { data: rows, error } = await supabase
      .from("transactions")
      .select("type, amount")
      .eq("user_id", user.id);
    if (error) throw new Error(`Gagal memuat total transaksi: ${error.message}`);
    for (const row of rows ?? []) {
      const amount = Number(row.amount) || 0;
      if (row.type === "income") totalIncome += amount;
      else if (row.type === "expense") totalExpense += amount;
    }
  }

  if (recentRes.error) {
    throw new Error(`Gagal memuat transaksi terbaru: ${recentRes.error.message}`);
  }

  const recentTransactions: Transaction[] = (recentRes.data ?? []).map((t) => ({
    ...t,
    amount: Number(t.amount),
  }));

  const meta = user.user_metadata ?? {};
  const userName: string =
    meta.name ?? meta.full_name ?? user.email?.split("@")[0] ?? "Pengguna";

  return {
    userName,
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    recentTransactions,
  };
}
