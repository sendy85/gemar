import { getHomeStats, getUpcomingAgendas, getRecentActivities } from "@/lib/data/home";
import { getFinanceSummary, getTransactions } from "@/lib/data/finance";
import { withRunningBalance, type TransactionRow } from "@/components/keuangan/TransactionTable";
import type { Activity, Agenda } from "@/types/database";

export interface DashboardOverview {
  totalMembers: number;
  totalActivities: number;
  totalAnnouncements: number;
  totalDocuments: number;
  balance: number;
  upcomingAgendas: Agenda[];
  recentActivities: Activity[];
  recentTransactions: TransactionRow[];
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  const [homeStats, financeSummary, upcomingAgendas, recentActivities, transactions] =
    await Promise.all([
      getHomeStats(),
      getFinanceSummary(),
      getUpcomingAgendas(5),
      getRecentActivities(5),
      getTransactions({ sort: "desc" }),
    ]);

  return {
    ...homeStats,
    balance: financeSummary.balance,
    upcomingAgendas,
    recentActivities,
    recentTransactions: withRunningBalance(transactions).slice(0, 5),
  };
}
