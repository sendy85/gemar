import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

// Ambil profil (termasuk role) dari user yang sedang login di sisi server.
// Mengembalikan null jika belum login. Selalu pakai ini untuk keputusan
// akses di Server Component — jangan pernah percaya role dari client.
export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile as Profile | null;
}

// Wajibkan user sudah login. Redirect ke /login jika belum.
// Pakai di setiap halaman/server action dashboard yang butuh sesi aktif.
export async function requireProfile(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard");
  return profile;
}

// Wajibkan user login DAN memiliki salah satu role yang diizinkan.
// Ini adalah lapisan proteksi kedua di server (selain RLS di database) —
// keduanya penting: RLS mencegah akses data langsung, ini mencegah UI
// dashboard tampil ke role yang tidak berhak.
export async function requireRole(allowed: UserRole[]): Promise<Profile> {
  const profile = await requireProfile();
  if (!allowed.includes(profile.role)) {
    redirect("/dashboard?error=forbidden");
  }
  return profile;
}

export const STAFF_ROLES: UserRole[] = ["admin", "pengurus"];
export const ADMIN_ONLY: UserRole[] = ["admin"];
