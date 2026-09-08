import Link from "next/link";
import { Users, CalendarDays, Megaphone, FileText, Wallet, CalendarClock } from "lucide-react";
import { getDashboardOverview } from "@/lib/data/dashboard-stats";
import { StatCard } from "@/components/dashboard/StatCard";
import { TransactionTable } from "@/components/keuangan/TransactionTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardHomePage() {
  const data = await getDashboardOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-bold text-navy sm:text-2xl">
          Ringkasan
        </h1>
        <p className="mt-1 text-sm text-muted">
          Gambaran umum kondisi organisasi GEMARI saat ini.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard
          label="Anggota Aktif"
          value={String(data.totalMembers)}
          icon={Users}
          accent="text-brand-green bg-brand-green-light"
        />
        <StatCard
          label="Kegiatan"
          value={String(data.totalActivities)}
          icon={CalendarDays}
          accent="text-brand-blue bg-brand-blue/10"
        />
        <StatCard
          label="Pengumuman"
          value={String(data.totalAnnouncements)}
          icon={Megaphone}
          accent="text-brand-yellow bg-brand-yellow/10"
        />
        <StatCard
          label="Dokumen"
          value={String(data.totalDocuments)}
          icon={FileText}
          accent="text-navy bg-navy/5"
        />
        <StatCard
          label="Saldo Kas"
          value={formatCurrency(data.balance)}
          icon={Wallet}
          accent="text-brand-red bg-brand-red/10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-card border border-navy/10 bg-white p-5 shadow-softer">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
              <CalendarClock size={16} />
              Agenda Terdekat
            </h2>
            <Link
              href="/dashboard/agenda"
              className="text-xs font-medium text-brand-green hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-4">
            {data.upcomingAgendas.length === 0 ? (
              <EmptyState
                icon={CalendarClock}
                title="Belum ada agenda"
                description="Agenda mendatang akan tampil di sini."
              />
            ) : (
              <ul className="space-y-3">
                {data.upcomingAgendas.map((a) => (
                  <li key={a.id} className="flex items-start gap-3">
                    <div className="rounded-lg bg-brand-green-light px-2.5 py-1.5 text-center text-brand-green-dark">
                      <p className="text-xs font-bold leading-none">
                        {formatDate(a.agenda_date).split(" ")[0]}
                      </p>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy">
                        {a.title}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(a.agenda_date)}
                        {a.location ? ` · ${a.location}` : ""}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rounded-card border border-navy/10 bg-white p-5 shadow-softer">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
              <CalendarDays size={16} />
              Kegiatan Terbaru
            </h2>
            <Link
              href="/dashboard/kegiatan"
              className="text-xs font-medium text-brand-green hover:underline"
            >
              Lihat semua
            </Link>
          </div>
          <div className="mt-4">
            {data.recentActivities.length === 0 ? (
              <EmptyState
                icon={CalendarDays}
                title="Belum ada kegiatan"
                description="Kegiatan yang ditambahkan akan tampil di sini."
              />
            ) : (
              <ul className="space-y-3">
                {data.recentActivities.map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy">
                        {a.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatDate(a.activity_date)}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-navy/5 px-2.5 py-1 text-[11px] font-medium text-muted">
                      {a.status.replace("_", " ")}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-card border border-navy/10 bg-white p-5 shadow-softer">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
            <Wallet size={16} />
            Transaksi Terbaru
          </h2>
          <Link
            href="/dashboard/keuangan"
            className="text-xs font-medium text-brand-green hover:underline"
          >
            Lihat semua
          </Link>
        </div>
        <div className="mt-4">
          {data.recentTransactions.length === 0 ? (
            <EmptyState
              icon={Wallet}
              title="Belum ada transaksi"
              description="Transaksi keuangan yang dicatat akan tampil di sini."
            />
          ) : (
            <TransactionTable transactions={data.recentTransactions} />
          )}
        </div>
      </div>
    </div>
  );
}