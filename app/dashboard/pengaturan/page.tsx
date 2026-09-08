import { requireRole, ADMIN_ONLY } from "@/lib/auth";
import { getAllProfiles } from "@/lib/data/users";
import { updateUserRole } from "./actions";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { RoleSelectForm } from "@/components/dashboard/RoleSelectForm";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Pengaturan" };
export const dynamic = "force-dynamic";

const roleLabel: Record<string, string> = {
  admin: "Admin",
  pengurus: "Pengurus",
  anggota: "Anggota",
};

export default async function PengaturanPage() {
  const actor = await requireRole(ADMIN_ONLY);
  const profiles = await getAllProfiles();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pengaturan"
        description="Kelola role akses pengguna yang sudah mendaftar."
      />

      <div className="rounded-card border border-brand-blue/20 bg-brand-blue/5 p-4 text-sm text-navy">
        Akun baru dibuat lewat <strong>Supabase Dashboard → Authentication →
        Users</strong>. Setelah user mendaftar/dibuatkan akun, role defaultnya
        adalah <strong>anggota</strong> — naikkan ke pengurus/admin di sini
        sesuai kebutuhan.
      </div>

      <div className="overflow-x-auto rounded-card border border-navy/10 bg-white shadow-softer">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-navy/10 text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Bergabung</th>
              <th className="px-4 py-3 font-medium">Role</th>
            </tr>
          </thead>
          <tbody>
            {profiles.map((p) => (
              <tr key={p.id} className="border-b border-navy/5 last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-navy">
                    {p.full_name}
                    {p.id === actor.id && (
                      <span className="ml-2 rounded-full bg-brand-green-light px-2 py-0.5 text-[11px] font-medium text-brand-green-dark">
                        Anda
                      </span>
                    )}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted">
                  {formatDate(p.created_at)}
                </td>
                <td className="px-4 py-3">
                  <RoleSelectForm
                    userId={p.id}
                    currentRole={p.role}
                    action={updateUserRole}
                    disabled={p.id === actor.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {profiles.length === 0 && (
        <p className="text-sm text-muted">Belum ada pengguna terdaftar.</p>
      )}
      <p className="text-xs text-muted">
        {Object.entries(roleLabel)
          .map(([k, v]) => `${v}: ${profiles.filter((p) => p.role === k).length}`)
          .join(" · ")}
      </p>
    </div>
  );
}
