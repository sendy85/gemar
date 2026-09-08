import { Suspense } from "react";
import { requireProfile } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { FlashToast } from "@/components/ui/FlashToast";

export const metadata = { title: { default: "Dashboard", template: "%s | Dashboard GEMARI" } };

// Layout ini membungkus SELURUH route /dashboard/**. `requireProfile()`
// sudah cukup untuk memastikan ada sesi login (proteksi lapis pertama ada
// juga di proxy.ts). Pembatasan per-role yang lebih spesifik (mis. hanya
// admin) dilakukan di masing-masing halaman lewat `requireRole()`.
//
// Catatan: daftar menu (DASHBOARD_NAV) berisi komponen ikon Lucide, yaitu
// referensi fungsi React — ini TIDAK BOLEH dihitung di sini lalu dikirim
// sebagai prop ke DashboardShell (Client Component), karena React Server
// Components tidak bisa mengirim fungsi/komponen lintas batas server→client
// ("Only plain objects can be passed..."). Karena itu DashboardShell
// menghitung sendiri menu yang sesuai role di sisi client, kita cukup
// mengirim `profile` (objek data biasa) ke sana.
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireProfile();

  return (
    <DashboardShell profile={profile}>
      <Suspense fallback={null}>
        <FlashToast />
      </Suspense>
      {children}
    </DashboardShell>
  );
}
