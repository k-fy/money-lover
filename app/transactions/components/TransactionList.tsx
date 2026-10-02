'use client';

import type { Transaction } from '@/app/types/transaction';

interface Props {
  transactions: Transaction[];
  isLoading: boolean;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateStr));
}

export default function TransactionList({ transactions, isLoading, onEdit, onDelete }: Props) {
  if (isLoading) {
    return <p className="py-8 text-center text-sm text-gray-500">Memuat transaksi...</p>;
  }

  if (transactions.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        Belum ada transaksi untuk filter ini.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-gray-100 rounded-lg border border-gray-100">
      {transactions.map((t) => (
        <li key={t.id} className="flex items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {t.description || t.category || 'Tanpa keterangan'}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(t.transaction_date)}
              {t.category ? ` · ${t.category}` : ''}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-sm font-semibold ${
                t.type === 'income' ? 'text-emerald-600' : 'text-red-600'
              }`}
            >
              {t.type === 'income' ? '+' : '-'}
              {formatCurrency(t.amount)}
            </span>
            <button
              onClick={() => onEdit(t)}
              className="text-xs font-medium text-indigo-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(t.id)}
              className="text-xs font-medium text-red-600 hover:underline"
            >
              Hapus
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
