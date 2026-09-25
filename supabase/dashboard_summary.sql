-- =====================================================================
-- MoneyLover - Dashboard summary (Silvani)
-- Jalankan di Supabase Dashboard > SQL Editor SETELAH tabel `transactions`
-- dan policy RLS dari Programmer 3 sudah dibuat.
--
-- Asumsi kolom tabel transactions:
--   id, user_id (uuid), type ('income' | 'expense'), amount (numeric),
--   category (text), date (date), note (text), created_at (timestamptz)
-- Kalau nilai `type` di skema tim berbeda (mis. 'pemasukan'), sesuaikan di bawah.
-- =====================================================================

-- SUM dihitung langsung di PostgreSQL (1 baris hasil), jadi dashboard tetap
-- cepat walau transaksi banyak (NFR-02.1).
-- SECURITY INVOKER => fungsi berjalan sebagai user yang login, jadi RLS tetap berlaku.
create or replace function public.get_dashboard_totals()
returns table (total_income numeric, total_expense numeric)
language sql
stable
security invoker
set search_path = public
as $$
  select
    coalesce(sum(amount) filter (where type = 'income'), 0)  as total_income,
    coalesce(sum(amount) filter (where type = 'expense'), 0) as total_expense
  from public.transactions
  where user_id = auth.uid();
$$;

revoke all on function public.get_dashboard_totals() from public, anon;
grant execute on function public.get_dashboard_totals() to authenticated;

-- Index untuk query agregat & "5 transaksi terbaru"
create index if not exists transactions_user_date_idx
  on public.transactions (user_id, date desc, created_at desc);
