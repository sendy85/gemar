"use client";

import { useState } from "react";
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react";
import type { TransactionRow } from "@/components/keuangan/TransactionTable";
import { formatCurrency, formatDate } from "@/lib/utils";

interface ExportButtonsProps {
  transactions: TransactionRow[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  periodeLabel: string;
  periodeSlug: string;
}

export function ExportButtons({
  transactions,
  totalIncome,
  totalExpense,
  balance,
  periodeLabel,
  periodeSlug,
}: ExportButtonsProps) {
  const [loading, setLoading] = useState<"excel" | "pdf" | null>(null);

  async function handleExportExcel() {
    setLoading("excel");
    try {
      const XLSX = await import("xlsx");

      const header = [
        ["LAPORAN KEUANGAN"],
        ["GEMARI"],
        ["Gerakan Muda Mudi Blimbingsari"],
        [`Periode: ${periodeLabel}`],
        [],
        [
          "No",
          "Tanggal",
          "Kode Transaksi",
          "Keterangan",
          "Kategori",
          "Pemasukan",
          "Pengeluaran",
          "Saldo",
        ],
      ];

      const rows = transactions.map((t, i) => [
        i + 1,
        formatDate(t.transaction_date),
        t.transaction_code,
        t.description,
        t.category,
        t.type === "pemasukan" ? Number(t.amount) : "",
        t.type === "pengeluaran" ? Number(t.amount) : "",
        t.runningBalance ?? 0,
      ]);

      const footer = [
        [],
        ["", "", "", "", "Total Pemasukan", totalIncome],
        ["", "", "", "", "Total Pengeluaran", "", totalExpense],
        ["", "", "", "", "Saldo Akhir", "", "", balance],
      ];

      const sheetData = [...header, ...rows, ...footer];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      worksheet["!cols"] = [
        { wch: 5 },
        { wch: 16 },
        { wch: 16 },
        { wch: 30 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
        { wch: 16 },
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keuangan");
      XLSX.writeFile(workbook, `Laporan-Keuangan-GEMARI-${periodeSlug}.xlsx`);
    } finally {
      setLoading(null);
    }
  }

  async function handleExportPdf() {
    setLoading("pdf");
    try {
      const { default: jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("GEMARI", 14, 18);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("Gerakan Muda Mudi Blimbingsari", 14, 24);

      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN KEUANGAN", 14, 34);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Periode: ${periodeLabel}`, 14, 40);

      autoTable(doc, {
        startY: 46,
        head: [
          [
            "No",
            "Tanggal",
            "Kode",
            "Keterangan",
            "Kategori",
            "Pemasukan",
            "Pengeluaran",
            "Saldo",
          ],
        ],
        body: transactions.map((t, i) => [
          i + 1,
          formatDate(t.transaction_date),
          t.transaction_code,
          t.description,
          t.category,
          t.type === "pemasukan" ? formatCurrency(t.amount) : "-",
          t.type === "pengeluaran" ? formatCurrency(t.amount) : "-",
          formatCurrency(t.runningBalance ?? 0),
        ]),
        headStyles: { fillColor: [31, 122, 77] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 8 } },
      });

      const finalY = (doc as any).lastAutoTable?.finalY ?? 46;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text(`Total Pemasukan: ${formatCurrency(totalIncome)}`, 14, finalY + 8);
      doc.text(`Total Pengeluaran: ${formatCurrency(totalExpense)}`, 14, finalY + 14);
      doc.text(`Saldo Akhir: ${formatCurrency(balance)}`, 14, finalY + 20);

      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Dicetak pada ${formatDate(new Date().toISOString().slice(0, 10))}`,
        14,
        finalY + 30
      );

      doc.save(`Laporan-Keuangan-GEMARI-${periodeSlug}.pdf`);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleExportExcel}
        disabled={loading !== null || transactions.length === 0}
        className="inline-flex items-center gap-2 rounded-full border border-brand-green px-4 py-2 text-sm font-medium text-brand-green transition-colors hover:bg-brand-green-light disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "excel" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileSpreadsheet size={16} />
        )}
        Export Excel
      </button>
      <button
        type="button"
        onClick={handleExportPdf}
        disabled={loading !== null || transactions.length === 0}
        className="inline-flex items-center gap-2 rounded-full border border-brand-red px-4 py-2 text-sm font-medium text-brand-red transition-colors hover:bg-brand-red/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading === "pdf" ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileText size={16} />
        )}
        Export PDF
      </button>
    </div>
  );
}
