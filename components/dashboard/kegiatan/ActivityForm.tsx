import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import { PhotoUploadField } from "@/components/dashboard/PhotoUploadField";
import type { Activity } from "@/types/database";

export function ActivityForm({
  action,
  activity,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  activity?: Activity;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {activity && <input type="hidden" name="id" value={activity.id} />}
      <FormError message={error} />

      <PhotoUploadField
        currentUrl={activity?.photo_url}
        label="Foto Kegiatan"
      />

      <FormField label="Nama Kegiatan" htmlFor="name" required>
        <input
          id="name"
          name="name"
          required
          defaultValue={activity?.name}
          className={fieldInputClass}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Tanggal" htmlFor="activity_date" required>
          <input
            id="activity_date"
            name="activity_date"
            type="date"
            required
            defaultValue={activity?.activity_date}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Waktu" htmlFor="activity_time">
          <input
            id="activity_time"
            name="activity_time"
            type="time"
            defaultValue={activity?.activity_time ?? ""}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Status" htmlFor="status" required>
          <select
            id="status"
            name="status"
            defaultValue={activity?.status ?? "akan_datang"}
            className={fieldInputClass}
          >
            <option value="akan_datang">Akan Datang</option>
            <option value="berlangsung">Sedang Berlangsung</option>
            <option value="selesai">Selesai</option>
          </select>
        </FormField>
      </div>

      <FormField label="Lokasi" htmlFor="location">
        <input
          id="location"
          name="location"
          defaultValue={activity?.location ?? ""}
          className={fieldInputClass}
        />
      </FormField>

      <FormField label="Deskripsi" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={5}
          defaultValue={activity?.description ?? ""}
          className={fieldInputClass}
        />
      </FormField>

      <FormActions cancelHref="/dashboard/kegiatan" />
    </form>
  );
}
