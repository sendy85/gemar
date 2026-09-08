"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Agenda } from "@/types/database";
import { cn } from "@/lib/utils";

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const DAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

export function AgendaCalendarView({ agendas }: { agendas: Agenda[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const agendaByDate = useMemo(() => {
    const map = new Map<string, Agenda[]>();
    for (const a of agendas) {
      const list = map.get(a.agenda_date) ?? [];
      list.push(a);
      map.set(a.agenda_date, list);
    }
    return map;
  }, [agendas]);

  const { year, month } = cursor;
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = new Date().toISOString().slice(0, 10);

  const cells: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function toKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  return (
    <div className="rounded-card border border-navy/10 bg-white p-4 shadow-softer sm:p-6">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() =>
            setCursor((c) =>
              c.month === 0
                ? { year: c.year - 1, month: 11 }
                : { year: c.year, month: c.month - 1 }
            )
          }
          className="rounded-lg p-1.5 text-muted hover:bg-navy/5 hover:text-navy"
          aria-label="Bulan sebelumnya"
        >
          <ChevronLeft size={18} />
        </button>
        <p className="text-sm font-semibold text-navy">
          {MONTH_NAMES[month]} {year}
        </p>
        <button
          type="button"
          onClick={() =>
            setCursor((c) =>
              c.month === 11
                ? { year: c.year + 1, month: 0 }
                : { year: c.year, month: c.month + 1 }
            )
          }
          className="rounded-lg p-1.5 text-muted hover:bg-navy/5 hover:text-navy"
          aria-label="Bulan berikutnya"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted">
        {DAY_NAMES.map((d) => (
          <div key={d} className="py-1.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;
          const key = toKey(day);
          const dayAgendas = agendaByDate.get(key) ?? [];
          const isToday = key === todayKey;

          return (
            <div
              key={key}
              className={cn(
                "flex min-h-16 flex-col items-center gap-1 rounded-lg border border-transparent p-1.5 text-xs",
                isToday && "border-brand-green/40 bg-brand-green-light"
              )}
            >
              <span
                className={cn(
                  "font-medium text-navy",
                  isToday && "text-brand-green-dark"
                )}
              >
                {day}
              </span>
              {dayAgendas.slice(0, 2).map((a) => (
                <span
                  key={a.id}
                  title={a.title}
                  className="w-full truncate rounded bg-brand-green/15 px-1 py-0.5 text-[10px] text-brand-green-dark"
                >
                  {a.title}
                </span>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
