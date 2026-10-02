"use client";

import { useEffect, useState, useCallback } from "react";

interface BudgetIndicatorData {
  budgetAmount: number;
  totalExpense: number;
  remaining: number;
  percentage: number;
  status: "safe" | "warning" | "overbudget";
  label: string;
}

interface BudgetIndicatorProps {
  month: number;
  year: number;
  refreshKey?: number;
}

const STATUS_STYLES: Record<BudgetIndicatorData["status"], { bar: string; badge: string }> = {
  safe: { bar: "bg-income", badge: "bg-income text-surface" },
  warning: { bar: "bg-amber-500", badge: "bg-amber-500 text-surface" },
  overbudget: { bar: "bg-expense", badge: "bg-expense text-surface" },
};

export function BudgetIndicator({ month, year, refreshKey }: BudgetIndicatorProps) {
  const [data, setData] = useState<BudgetIndicatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/budget/status?month=${month}&year=${year}`);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Gagal memuat status anggaran");
      }
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }, [month, year]);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus, refreshKey]);

  if (loading) return <div className="mt-6 h-16 animate-pulse rounded-2xl bg-line/40" />;
  if (error) return <p className="mt-4 text-sm text-expense">{error}</p>;
  if (!data) return null;

  return (
    <div className="mt-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[data.status].badge}`}>
          {data.label}
        </span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full transition-all duration-500 ${STATUS_STYLES[data.status].bar}`}
          style={{ width: `${Math.min(data.percentage, 100)}%` }}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
        <span>{data.percentage}% terpakai</span>
        <span>Sisa: Rp{data.remaining.toLocaleString("id-ID")}</span>
      </div>

      {data.status === "overbudget" && (
        <p className="mt-3 rounded-2xl border border-dashed border-expense px-4 py-3 text-sm text-expense">
          Pengeluaran bulan ini sudah melebihi anggaran yang ditetapkan.
        </p>
      )}
    </div>
  );
}