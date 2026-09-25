"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { PreferenceKey, PreferenceMap } from "@/app/lib/types";

// Daftar preferensi yang boleh disimpan. Nilai dari client SELALU divalidasi
// terhadap whitelist ini, karena Server Action bisa dipanggil manual.
const PREFERENCES: {
  [K in PreferenceKey]: {
    cookieName: string;
    allowed: readonly PreferenceMap[K][];
    fallback: PreferenceMap[K];
  };
} = {
  theme: {
    cookieName: "moneylover_theme",
    allowed: ["light", "dark"],
    fallback: "light",
  },
  default_view: {
    cookieName: "moneylover_default_view",
    allowed: ["all", "income", "expense"],
    fallback: "all",
  },
};

const ONE_YEAR = 60 * 60 * 24 * 365;

function isAllowed<K extends PreferenceKey>(key: K, value: unknown): value is PreferenceMap[K] {
  return (PREFERENCES[key].allowed as readonly unknown[]).includes(value);
}

/**
 * Baca preferensi dari cookie. Dipanggil di Server Component (layout/page)
 * sehingga UI sudah benar sejak HTML pertama dikirim => tanpa flicker (FR-06.2).
 */
export async function getPreferenceCookie<K extends PreferenceKey>(key: K): Promise<PreferenceMap[K]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(PREFERENCES[key].cookieName)?.value;
  return isAllowed(key, raw) ? raw : PREFERENCES[key].fallback;
}

/**
 * Simpan preferensi ke cookie (FR-06.1). Hanya boleh dipanggil dari
 * Server Action / Client Component (cookies().set tidak jalan di Server Component).
 */
export async function setPreferenceCookie<K extends PreferenceKey>(
  key: K,
  value: PreferenceMap[K],
): Promise<{ ok: boolean; error?: string }> {
  if (!(key in PREFERENCES) || !isAllowed(key, value)) {
    return { ok: false, error: `Nilai "${String(value)}" tidak valid untuk ${String(key)}.` };
  }

  const cookieStore = await cookies();
  cookieStore.set(PREFERENCES[key].cookieName, value, {
    path: "/",
    maxAge: ONE_YEAR,
    sameSite: "lax",
    httpOnly: true, // cukup dibaca server; tetap terlihat di DevTools > Application > Cookies
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/", "layout");
  return { ok: true };
}
