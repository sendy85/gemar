import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import type { BoardMember, OrgStructureNode } from "@/types/database";
import type { StructureNodeFlat } from "@/lib/data/profil";

export function StructureNodeForm({
  action,
  node,
  boardMembers,
  otherNodes,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  node?: OrgStructureNode;
  boardMembers: BoardMember[];
  otherNodes: StructureNodeFlat[];
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {node && <input type="hidden" name="id" value={node.id} />}
      <FormError message={error} />

      <FormField label="Judul Jabatan" htmlFor="title" required>
        <input
          id="title"
          name="title"
          required
          defaultValue={node?.title}
          className={fieldInputClass}
          placeholder="mis. Ketua, Koordinator Divisi Humas"
        />
      </FormField>

      <FormField
        label="Dijabat oleh (Pengurus)"
        htmlFor="board_member_id"
        hint="Opsional — hubungkan ke data pengurus supaya nama tampil di struktur"
      >
        <select
          id="board_member_id"
          name="board_member_id"
          defaultValue={node?.board_member_id ?? ""}
          className={fieldInputClass}
        >
          <option value="">Tidak dihubungkan</option>
          {boardMembers.map((m) => (
            <option key={m.id} value={m.id}>
              {m.full_name} — {m.position_title}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Atasan Langsung"
        htmlFor="parent_id"
        hint="Kosongkan jika ini posisi paling atas (mis. Ketua)"
      >
        <select
          id="parent_id"
          name="parent_id"
          defaultValue={node?.parent_id ?? ""}
          className={fieldInputClass}
        >
          <option value="">Tidak ada (posisi teratas)</option>
          {otherNodes
            .filter((n) => n.id !== node?.id)
            .map((n) => (
              <option key={n.id} value={n.id}>
                {n.title}
              </option>
            ))}
        </select>
      </FormField>

      <FormField
        label="Urutan Tampil"
        htmlFor="order_index"
        hint="Angka lebih kecil tampil lebih dulu di antara posisi sejajar"
      >
        <input
          id="order_index"
          name="order_index"
          type="number"
          min={0}
          defaultValue={node?.order_index ?? 0}
          className={fieldInputClass}
        />
      </FormField>

      <FormActions cancelHref="/dashboard/struktur" />
    </form>
  );
}
