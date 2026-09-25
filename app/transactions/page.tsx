import { getTransactions } from './actions';
import TransactionsClient from './components/TransactionsClient';

// Halaman ini otomatis terproteksi oleh middleware.ts (Programmer 1),
// yang meredireksi unauthenticated user ke /login sebelum sampai sini.
export default async function TransactionsPage() {
  const result = await getTransactions('all');

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Transaksi</h1>
      <TransactionsClient
        initialTransactions={result.success ? result.data ?? [] : []}
        initialError={result.success ? undefined : result.error}
      />
    </div>
  );
}
