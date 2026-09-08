import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import type { Announcement } from "@/types/database";

export function AnnouncementForm({
  action,
  announcement,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  announcement?: Announcement;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {announcement && <input type="hidden" name="id" value={announcement.id} />}
      <FormError message={error} />

      <FormField label="Judul" htmlFor="title" required>
        <input
          id="title"
          name="title"
          required
          defaultValue={announcement?.title}
          className={fieldInputClass}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Tanggal" htmlFor="announcement_date" required>
          <input
            id="announcement_date"
            name="announcement_date"
            type="date"
            required
            defaultValue={announcement?.announcement_date}
            className={fieldInputClass}
          />
        </FormField>

        <FormField
          label="Penulis"
          htmlFor="author"
          hint="Kosongkan untuk memakai nama akun Anda"
        >
          <input
            id="author"
            name="author"
            defaultValue={announcement?.author ?? ""}
            className={fieldInputClass}
          />
        </FormField>
      </div>

      <FormField label="Isi Pengumuman" htmlFor="content" required>
        <textarea
          id="content"
          name="content"
          rows={7}
          required
          defaultValue={announcement?.content}
          className={fieldInputClass}
        />
      </FormField>

      <label className="flex items-center gap-2 text-sm text-navy">
        <input
          type="checkbox"
          name="featured"
          defaultChecked={announcement?.featured}
          className="h-4 w-4 rounded border-navy/25 text-brand-green focus:ring-brand-green"
        />
        Tandai sebagai pengumuman unggulan
      </label>

      <FormActions cancelHref="/dashboard/pengumuman" />
    </form>
  );
}
