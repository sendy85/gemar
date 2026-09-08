import {
  FormField,
  FormError,
  FormActions,
  fieldInputClass,
} from "@/components/dashboard/FormField";
import type { Agenda } from "@/types/database";

export function AgendaForm({
  action,
  agenda,
  error,
}: {
  action: (formData: FormData) => void | Promise<void>;
  agenda?: Agenda;
  error?: string;
}) {
  return (
    <form
      action={action}
      className="space-y-5 rounded-card border border-navy/10 bg-white p-6 shadow-softer"
    >
      {agenda && <input type="hidden" name="id" value={agenda.id} />}
      <FormError message={error} />

      <FormField label="Judul Agenda" htmlFor="title" required>
        <input
          id="title"
          name="title"
          required
          defaultValue={agenda?.title}
          className={fieldInputClass}
        />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-3">
        <FormField label="Tanggal" htmlFor="agenda_date" required>
          <input
            id="agenda_date"
            name="agenda_date"
            type="date"
            required
            defaultValue={agenda?.agenda_date}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Waktu" htmlFor="agenda_time">
          <input
            id="agenda_time"
            name="agenda_time"
            type="time"
            defaultValue={agenda?.agenda_time ?? ""}
            className={fieldInputClass}
          />
        </FormField>

        <FormField label="Status" htmlFor="status" required>
          <select
            id="status"
            name="status"
            defaultValue={agenda?.status ?? "akan_datang"}
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
          defaultValue={agenda?.location ?? ""}
          className={fieldInputClass}
        />
      </FormField>

      <FormField label="Deskripsi" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={agenda?.description ?? ""}
          className={fieldInputClass}
        />
      </FormField>

      <FormActions cancelHref="/dashboard/agenda" />
    </form>
  );
}
