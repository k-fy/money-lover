import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getSession();

  return (
    <main style={{ padding: "30px" }}>
      <h1>Test Supabase</h1>

      {error ? (
        <>
          <h2>Error</h2>
          <pre>{error.message}</pre>
        </>
      ) : (
        <>
          <h2>Supabase berhasil terhubung!</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </>
      )}
    </main>
  );
}