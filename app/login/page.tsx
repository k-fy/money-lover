import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Masuk ke MoneyLover</h2>
        
        {params?.error && (
          <div className="rounded bg-red-100 p-3 text-sm text-red-600">
            {params.error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            formAction={login}
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            Masuk
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  )
}