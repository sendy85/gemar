"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { MonthlyChartPoint } from "@/lib/data/finance";
import { formatCurrency } from "@/lib/utils";

function CompactCurrency(value: number) {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}rb`;
  return String(value);
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-card border border-navy/10 bg-white p-5 shadow-softer">
      <p className="text-sm font-semibold text-navy">{title}</p>
      <div className="mt-4 h-64">{children}</div>
    </div>
  );
}

export function FinanceCharts({ data }: { data: MonthlyChartPoint[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Pemasukan per Bulan">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F231B10" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#5B6B63" }}
                axisLine={{ stroke: "#0F231B15" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#5B6B63" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={CompactCurrency}
                width={44}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="pemasukan" fill="#1F7A4D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Pengeluaran per Bulan">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#0F231B10" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#5B6B63" }}
                axisLine={{ stroke: "#0F231B15" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#5B6B63" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={CompactCurrency}
                width={44}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
              <Bar dataKey="pengeluaran" fill="#D6483C" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <ChartCard title="Perbandingan Pemasukan vs Pengeluaran">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0F231B10" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#5B6B63" }}
              axisLine={{ stroke: "#0F231B15" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#5B6B63" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={CompactCurrency}
              width={44}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar
              dataKey="pemasukan"
              name="Pemasukan"
              fill="#1F7A4D"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="pengeluaran"
              name="Pengeluaran"
              fill="#D6483C"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}
