'use client';

import { useState, type FormEvent } from 'react';
import type { Transaction, TransactionInput, TransactionType } from '@/app/types/transaction';

interface Props {
  initialTransaction: Transaction | null;
  onClose: () => void;
  onSubmit: (input: TransactionInput) => Promise<string | undefined>;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TransactionFormModal({ initialTransaction, onClose, onSubmit }: Props) {
  const [type, setType] = useState<TransactionType>(initialTransaction?.type ?? 'expense');
  const [amount, setAmount] = useState(String(initialTransaction?.amount ?? ''));
  const [category, setCategory] = useState(initialTransaction?.category ?? '');
  const [description, setDescription] = useState(initialTransaction?.description ?? '');
  const [transactionDate, setTransactionDate] = useState(
    initialTransaction?.transaction_date ?? todayISO()
  );
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(undefined);

    const numericAmount = Number(amount);
    if (!amount || Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Nominal harus berupa angka lebih besar dari 0.');
      return;
    }

    setIsSubmitting(true);
    const submitError = await onSubmit({
      type,
      amount: numericAmount,
      category: category.trim() || undefined,
      description: description.trim() || undefined,
      transaction_date: transactionDate,
    });
    setIsSubmitting(false);

    if (submitError) {
      setError(submitError);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          {initialTransaction ? 'Edit Transaksi' : 'Tambah Transaksi'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {(['expense', 'income'] as TransactionType[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-medium ${
                  type === t
                    ? t === 'income'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                    : 'border-gray-200 text-gray-600'
                }`}
              >
                {t === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </button>
            ))}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nominal</label>
            <input
              type="number"
              min="0"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
            <input
              type="date"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              placeholder="Mis. Makanan, Gaji, Transport"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Keterangan</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
              rows={2}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
