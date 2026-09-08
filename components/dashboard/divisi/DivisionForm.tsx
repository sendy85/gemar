import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import type { Division } from "@/types/database";

export function DivisionForm({
  action,
  division,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  division?: Division;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {division && <input type="hidden" name="id" value={division.id} />}
      <FormError message={error} />

      <FormField label="Nama Divisi" htmlFor="name" required>
        <input
          id="name"
          name="name"
          required
          defaultValue={division?.name}
          className={fieldInputClass}
          placeholder="mis. Divisi Humas"
        />
      </FormField>

      <FormField label="Deskripsi" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={division?.description ?? ""}
          className={fieldInputClass}
          placeholder="Tugas dan fokus divisi ini"
        />
      </FormField>

      <FormField label="Ketua Divisi" htmlFor="head_name">
        <input
          id="head_name"
          name="head_name"
          defaultValue={division?.head_name ?? ""}
          className={fieldInputClass}
          placeholder="Nama ketua divisi"
        />
      </FormField>

      <FormActions cancelHref="/dashboard/divisi" />
    </form>
  );
}
