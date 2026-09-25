'use client'

import { logout } from '@/app/login/actions'

export default function LogoutButton() {
  return (
    <button
      onClick={async () => {
        await logout()
      }}
      className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Keluar (Logout)
    </button>
  )
}