import { createBrowserClient } from '@supabase/ssr';

// Dipakai hanya jika ada Client Component yang butuh akses langsung
// ke Supabase (mis. realtime subscription). Untuk modul transaksi ini,
// semua akses data lewat Server Actions di app/transactions/actions.ts,
// jadi file ini opsional tapi disediakan untuk konsistensi.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}