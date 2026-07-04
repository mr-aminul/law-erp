import { dashboardStats } from "@/lib/mock/data";
import { graphqlClient } from "@/lib/graphql/client";
import {
  DASHBOARD_QUERY,
  type DashboardQueryResult,
} from "@/lib/graphql/queries/dashboard";

export type DashboardStatsView = typeof dashboardStats;

/** Fetch dashboard stats from GraphQL; falls back to mock if API is unavailable. */
export async function getDashboardStats(): Promise<DashboardStatsView> {
  try {
    const data = await graphqlClient.request<DashboardQueryResult>(
      DASHBOARD_QUERY
    );
    const { stats } = data.dashboard;
    return {
      hearings: stats.hearings,
      invoices: stats.invoices,
      cases: stats.cases,
      hr: stats.hr,
    };
  } catch {
    return dashboardStats;
  }
}
