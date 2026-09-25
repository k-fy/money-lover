'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/utils/supabase/server';
import type { FilterType, Transaction, TransactionInput } from '@/app/types/transaction';

interface ActionResult<T = null> {
  success: boolean;
  data?: T;
  error?: string;
}

function validateInput(input: TransactionInput): string | null {
  if (!input.type || !['income', 'expense'].includes(input.type)) {
    return 'Jenis transaksi tidak valid.';
  }
  if (!input.amount || input.amount <= 0) {
    return 'Nominal harus lebih besar dari 0.';
  }
  if (!input.transaction_date) {
    return 'Tanggal transaksi wajib diisi.';
  }
  return null;
}

/**
 * FR-05 — Mengambil daftar transaksi milik user yang sedang login,
 * opsional difilter berdasarkan jenis (income/expense).
 * RLS di database tetap membatasi hasil hanya ke user_id yang cocok,
 * .eq('user_id', ...) di sini adalah lapisan pertahanan tambahan
 * di sisi aplikasi (defense in depth), bukan pengganti RLS.
 */
export async function getTransactions(
  filterType: FilterType = 'all'
): Promise<ActionResult<Transaction[]>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  let query = supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false });

  if (filterType !== 'all') {
    query = query.eq('type', filterType);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getTransactions error:', error.message);
    return { success: false, error: 'Gagal mengambil data transaksi.' };
  }

  return { success: true, data: data as Transaction[] };
}

/** FR-04 — Menambahkan transaksi baru untuk user yang sedang login. */
export async function createTransaction(
  input: TransactionInput
): Promise<ActionResult<Transaction>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: user.id,
      type: input.type,
      amount: input.amount,
      category: input.category ?? null,
      description: input.description ?? null,
      transaction_date: input.transaction_date,
    })
    .select()
    .single();

  if (error) {
    console.error('createTransaction error:', error.message);
    return { success: false, error: 'Gagal menambahkan transaksi.' };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard'); // ringkasan dashboard (Programmer 2) ikut ter-update

  return { success: true, data: data as Transaction };
}

/**
 * FR-04 / FR-07 — Mengubah transaksi milik user yang sedang login.
 * Filter .eq('user_id', user.id) + RLS memastikan user tidak bisa
 * mengedit transaksi milik user lain meski tahu id-nya.
 */
export async function updateTransaction(
  id: string,
  input: TransactionInput
): Promise<ActionResult<Transaction>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const validationError = validateInput(input);
  if (validationError) {
    return { success: false, error: validationError };
  }

  const { data, error } = await supabase
    .from('transactions')
    .update({
      type: input.type,
      amount: input.amount,
      category: input.category ?? null,
      description: input.description ?? null,
      transaction_date: input.transaction_date,
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) {
    console.error('updateTransaction error:', error.message);
    return { success: false, error: 'Gagal memperbarui transaksi.' };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true, data: data as Transaction };
}

/** FR-04 / FR-07 — Menghapus transaksi milik user yang sedang login. */
export async function deleteTransaction(id: string): Promise<ActionResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: 'Anda harus login terlebih dahulu.' };
  }

  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) {
    console.error('deleteTransaction error:', error.message);
    return { success: false, error: 'Gagal menghapus transaksi.' };
  }

  revalidatePath('/transactions');
  revalidatePath('/dashboard');

  return { success: true };
}