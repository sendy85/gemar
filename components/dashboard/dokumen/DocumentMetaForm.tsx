import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import type { DocumentItem } from "@/types/database";

const CATEGORY_OPTIONS: { value: string; label: string }[] = [
  { value: "proposal", label: "Proposal" },
  { value: "lpj", label: "LPJ" },
  { value: "notulen", label: "Notulen" },
  { value: "ad_art", label: "AD/ART" },
  { value: "surat", label: "Surat" },
  { value: "lainnya", label: "Lainnya" },
];

export function DocumentMetaForm({
  action,
  document,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  document: DocumentItem;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      <input type="hidden" name="id" value={document.id} />
      <FormError message={error} />

      <FormField label="Nama Dokumen" htmlFor="name" required>
        <input
          id="name"
          name="name"
          required
          defaultValue={document.name}
          className={fieldInputClass}
        />
      </FormField>

      <FormField label="Kategori" htmlFor="category" required>
        <select
          id="category"
          name="category"
          required
          defaultValue={document.category}
          className={fieldInputClass}
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </FormField>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          name="is_public"
          defaultChecked={document.is_public}
          className="h-4 w-4 rounded border-navy/25 text-brand-green focus:ring-brand-green"
        />
        Tampilkan ke publik (tanpa perlu login)
      </label>

      <p className="text-xs text-muted">
        Untuk mengganti isi file, hapus dokumen ini lalu unggah ulang sebagai
        dokumen baru.
      </p>

      <FormActions cancelHref="/dashboard/dokumen" />
    </form>
  );
}
