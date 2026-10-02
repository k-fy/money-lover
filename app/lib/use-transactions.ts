"use client";

import useSWR, { mutate } from "swr";
import type { Transaction, TransactionInput } from "@/app/types/transaction";

type ListResponse = {
  data: Transaction[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type SummaryResponse = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  chart: {
    monthly: { month: string; income: number; expense: number }[];
    expenseByCategory: { category: string; total: number }[];
  };
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) throw new ApiError(res.status, body?.error ?? "Terjadi kesalahan, coba lagi.");
  return body as T;
}

const fetcher = <T,>(url: string) => request<T>(url);

export function useTransactions(params: URLSearchParams) {
  return useSWR<ListResponse, ApiError>(
    `/api/transactions?${params.toString()}`,
    fetcher,
    { keepPreviousData: true }
  );
}

export function useDashboardSummary() {
  return useSWR<SummaryResponse, ApiError>("/api/dashboard/summary", fetcher, {
    refreshInterval: 30_000,
    revalidateOnFocus: true,
  });
}

export const refreshAll = () =>
  Promise.all([
    mutate((key) => typeof key === "string" && key.startsWith("/api/transactions")),
    mutate("/api/dashboard/summary"),
  ]);

export async function createTransaction(input: TransactionInput) {
  await request("/api/transactions", { method: "POST", body: JSON.stringify(input) });
  await refreshAll();
}

export async function updateTransaction(id: string, input: TransactionInput) {
  await request(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(input) });
  await refreshAll();
}

export async function deleteTransaction(id: string) {
  await request(`/api/transactions/${id}`, { method: "DELETE" });
  await refreshAll();
}