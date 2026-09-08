import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import type { Profile } from "@/types/database";

// Dipakai di setiap halaman/server action dashboard yang butuh proteksi.
// TIDAK PERNAH mempercayai role dari client — selalu ambil ulang dari
// tabel `profiles` di server. RLS di database adalah lapisan pertahanan
// utama; fungsi ini hanya untuk UX (redirect awal, sembunyikan aksi).
export async function requireStaff(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard");
  if (profile.role !== "admin" && profile.role !== "pengurus") {
    redirect("/dashboard?error=" + encodeURIComponent("Kamu tidak punya akses ke halaman ini."));
  }
  return profile;
}

export async function requireAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login?redirect=/dashboard");
  if (profile.role !== "admin") {
    redirect("/dashboard?error=" + encodeURIComponent("Hanya admin yang bisa mengakses halaman ini."));
  }
  return profile;
}
