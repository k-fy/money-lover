'use client';

import { useState, useTransition } from 'react';
import type { FilterType, Transaction, TransactionInput } from '@/app/types/transaction';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../actions';
import FilterTabs from './FilterTabs';
import TransactionList from './TransactionList';
import TransactionFormModal from './TransactionFormModal';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface Props {
  initialTransactions: Transaction[];
  initialError?: string;
}

export default function TransactionsClient({ initialTransactions, initialError }: Props) {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [error, setError] = useState<string | undefined>(initialError);
  const [isPending, startTransition] = useTransition();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function refresh(nextFilter: FilterType) {
    startTransition(async () => {
      const result = await getTransactions(nextFilter);
      if (result.success) {
        setTransactions(result.data ?? []);
        setError(undefined);
      } else {
        setError(result.error);
      }
    });
  }

  function handleFilterChange(nextFilter: FilterType) {
    setFilter(nextFilter);
    refresh(nextFilter);
  }

  function openCreateModal() {
    setEditingTransaction(null);
    setIsModalOpen(true);
  }

  function openEditModal(transaction: Transaction) {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  }

  async function handleSubmit(input: TransactionInput): Promise<string | undefined> {
    const result = editingTransaction
      ? await updateTransaction(editingTransaction.id, input)
      : await createTransaction(input);

    if (!result.success) {
      return result.error;
    }

    setIsModalOpen(false);
    setEditingTransaction(null);
    refresh(filter);
    return undefined;
  }

  async function handleConfirmDelete() {
    if (!deletingId) return;
    const result = await deleteTransaction(deletingId);
    setDeletingId(null);
    if (!result.success) {
      setError(result.error);
      return;
    }
    refresh(filter);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterTabs value={filter} onChange={handleFilterChange} />
        <button
          onClick={openCreateModal}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Tambah Transaksi
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <TransactionList
        transactions={transactions}
        isLoading={isPending}
        onEdit={openEditModal}
        onDelete={(id) => setDeletingId(id)}
      />

      {isModalOpen && (
        <TransactionFormModal
          initialTransaction={editingTransaction}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}

      {deletingId && (
        <DeleteConfirmDialog
          onCancel={() => setDeletingId(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
