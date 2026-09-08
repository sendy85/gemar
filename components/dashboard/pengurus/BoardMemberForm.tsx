import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import { PhotoUploadField } from "@/components/dashboard/PhotoUploadField";
import type { BoardMember, Division } from "@/types/database";

export function BoardMemberForm({
  action,
  boardMember,
  divisions,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  boardMember?: BoardMember;
  divisions: Division[];
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {boardMember && <input type="hidden" name="id" value={boardMember.id} />}
      <FormError message={error} />

      <PhotoUploadField currentUrl={boardMember?.photo_url} />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Nama Lengkap" htmlFor="full_name" required>
          <input
            id="full_name"
            name="full_name"
            required
            defaultValue={boardMember?.full_name}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Jabatan" htmlFor="position_title" required>
          <input
            id="position_title"
            name="position_title"
            required
            defaultValue={boardMember?.position_title}
            className={fieldInputClass}
            placeholder="mis. Ketua, Sekretaris"
          />
        </FormField>

        <FormField label="Divisi" htmlFor="division_id">
          <select
            id="division_id"
            name="division_id"
            defaultValue={boardMember?.division_id ?? ""}
            className={fieldInputClass}
          >
            <option value="">Tanpa Divisi</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField label="Periode" htmlFor="period" required>
          <input
            id="period"
            name="period"
            required
            defaultValue={boardMember?.period}
            className={fieldInputClass}
            placeholder="2026/2027"
          />
        </FormField>

        <FormField
          label="Urutan Tampil"
          htmlFor="order_index"
          hint="Angka lebih kecil tampil lebih dulu"
        >
          <input
            id="order_index"
            name="order_index"
            type="number"
            min={0}
            defaultValue={boardMember?.order_index ?? 0}
            className={fieldInputClass}
          />
        </FormField>
      </div>

      <FormActions cancelHref="/dashboard/pengurus" />
    </form>
  );
}
