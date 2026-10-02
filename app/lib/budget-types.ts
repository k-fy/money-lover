// Tipe & helper budget yang aman dipakai di server maupun client.

export type BudgetSummary = {
  month: number; // 1-12
  year: number;
  budget: number | null; // null = belum ada budget di bulan ini
  totalExpense: number;
  remaining: number | null; // budget - totalExpense
};

export const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/** Bulan & tahun saat ini menurut zona waktu Indonesia (WIB). */
export function currentPeriod(timeZone = "Asia/Jakarta") {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());
  return {
    month: Number(parts.find((p) => p.type === "month")?.value),
    year: Number(parts.find((p) => p.type === "year")?.value),
  };
}