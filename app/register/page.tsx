import { signup } from '@/app/login/actions' // atau '@/app/actions/auth'

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-8 shadow-md">
        <h2 className="text-center text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>

        {params?.error && (
          <div className="rounded bg-red-100 p-3 text-sm text-red-600">
            {params.error}
          </div>
        )}

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
            <input
              name="fullName"
              type="text"
              required
              className="mt-1 w-full rounded-md border p-2 text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              name="email"
              type="email"
              required
              className="mt-1 w-full rounded-md border p-2 text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-md border p-2 text-gray-900 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            formAction={signup}
            type="submit"
            className="w-full rounded-md bg-green-600 py-2 text-white hover:bg-green-700 transition"
          >
            Daftar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Login di sini
          </a>
        </p>
      </div>
    </div>
  )
}