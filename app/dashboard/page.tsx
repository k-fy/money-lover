import { redirect } from "next/navigation";
import { getDashboardSummary } from "@/app/lib/actions/dashboard";
import { getPreferenceCookie } from "@/app/lib/actions/preferences";
import { BalanceSummary } from "./_components/BalanceSummary";
import { RecentTransactions } from "./_components/RecentTransactions";
import { ThemeToggle } from "./_components/ThemeToggle";

export const metadata = { title: "Dashboard | MoneyLover" };

export default async function DashboardPage() {
  // Semua dibaca di server (SSR): cookie preferensi + data Supabase.
  const [theme, defaultView] = await Promise.all([
    getPreferenceCookie("theme"),
    getPreferenceCookie("default_view"),
  ]);

  const summary = await getDashboardSummary(defaultView);

  // Middleware seharusnya sudah memblokir, ini hanya jaring pengaman.
  if (!summary) redirect("/login");

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">Halo,</p>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{summary.userName}</h1>
        </div>
        <ThemeToggle initialTheme={theme} />
      </header>

      <BalanceSummary
        balance={summary.balance}
        totalIncome={summary.totalIncome}
        totalExpense={summary.totalExpense}
      />

      <RecentTransactions transactions={summary.recentTransactions} activeView={defaultView} />
    </main>
  );
}
