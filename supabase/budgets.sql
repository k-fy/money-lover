-- =====================================================================
-- MoneyLover - Fitur Budget Bulanan (Developer 2: Silvani)
-- Jalankan sekali di Supabase Dashboard > SQL Editor > Run.
-- =====================================================================

create table if not exists public.budgets (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  amount      numeric(14, 2) not null check (amount > 0),
  month       smallint not null check (month between 1 and 12),
  year        smallint not null check (year between 2000 and 2100),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  -- 1 user hanya punya 1 budget per bulan; dipakai juga untuk upsert
  constraint budgets_user_month_year_key unique (user_id, month, year)
);

-- Row Level Security: user hanya bisa mengakses budget miliknya sendiri
alter table public.budgets enable row level security;

drop policy if exists "budgets_select_own" on public.budgets;
create policy "budgets_select_own" on public.budgets
  for select to authenticated using (auth.uid() = user_id);

drop policy if exists "budgets_insert_own" on public.budgets;
create policy "budgets_insert_own" on public.budgets
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "budgets_update_own" on public.budgets;
create policy "budgets_update_own" on public.budgets
  for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "budgets_delete_own" on public.budgets;
create policy "budgets_delete_own" on public.budgets
  for delete to authenticated using (auth.uid() = user_id);

-- Mempercepat hitung total pengeluaran per bulan
create index if not exists transactions_user_type_date_idx
  on public.transactions (user_id, type, transaction_date);