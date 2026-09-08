import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { getActivities } from "@/lib/data/activities";
import { ActivityCard } from "@/components/kegiatan/ActivityCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import type { ActivityStatus } from "@/types/database";

export const metadata: Metadata = { title: "Kegiatan" };
export const dynamic = "force-dynamic";

const FILTERS: { label: string; value?: ActivityStatus }[] = [
  { label: "Semua" },
  { label: "Akan Datang", value: "akan_datang" },
  { label: "Berlangsung", value: "berlangsung" },
  { label: "Selesai", value: "selesai" },
];

export default async function KegiatanPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as ActivityStatus | undefined) ?? undefined;
  const activities = await getActivities(activeStatus);

  return (
    <div className="container-app py-12">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">Kegiatan</h1>
      <p className="mt-2 max-w-xl text-sm text-muted sm:text-base">
        Dokumentasi kegiatan GEMARI — dari yang akan datang hingga yang sudah
        terlaksana.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const isActive = activeStatus === f.value;
          const href = f.value ? `/kegiatan?status=${f.value}` : "/kegiatan";
          return (
            <Link
              key={f.label}
              href={href}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-brand-green bg-brand-green text-white"
                  : "border-navy/15 text-muted hover:border-brand-green hover:text-brand-green"
              )}
            >
              {f.label}
            </Link>
          );
        })}
      </div>

      {activities.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            icon={CalendarDays}
            title="Belum ada kegiatan pada kategori ini"
            description="Coba pilih kategori lain, atau tunggu kegiatan baru dari pengurus."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {activities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      )}
    </div>
  );
}
