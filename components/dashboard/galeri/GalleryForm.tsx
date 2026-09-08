import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import { PhotoUploadField } from "@/components/dashboard/PhotoUploadField";
import type { Activity, GalleryItem } from "@/types/database";

export function GalleryForm({
  action,
  item,
  activities,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  item?: GalleryItem;
  activities: Activity[];
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {item && <input type="hidden" name="id" value={item.id} />}
      <FormError message={error} />

      <PhotoUploadField
        currentUrl={item?.photo_url}
        hint={
          item
            ? "Biarkan kosong jika tidak ingin mengganti foto. JPG, PNG, atau WebP, maksimal 5MB."
            : "Wajib diisi. JPG, PNG, atau WebP, maksimal 5MB."
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="Judul" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={item?.title}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Tanggal" htmlFor="photo_date" required>
          <input
            id="photo_date"
            name="photo_date"
            type="date"
            required
            defaultValue={item?.photo_date}
            className={fieldInputClass}
          />
        </FormField>
      </div>

      <FormField
        label="Kaitkan dengan Kegiatan"
        htmlFor="activity_id"
        hint="Opsional"
      >
        <select
          id="activity_id"
          name="activity_id"
          defaultValue={item?.activity_id ?? ""}
          className={fieldInputClass}
        >
          <option value="">Tidak dikaitkan</option>
          {activities.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Deskripsi" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={item?.description ?? ""}
          className={fieldInputClass}
        />
      </FormField>

      <FormActions cancelHref="/dashboard/galeri" />
    </form>
  );
}
