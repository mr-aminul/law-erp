export interface HealthResponse {
  status: string;
  service: string;
  env: string;
}

export interface DashboardStatsResponse {
  hearings: {
    today: number;
    thisMonth: number;
    thisYear: number;
  };
  invoices: {
    count: number;
    amount: number;
    collected: number;
    overdue: number;
  };
  cases: {
    active: number;
    newThisMonth: number;
    closedThisYear: number;
  };
  hr: {
    totalStaff: number;
    onLeaveToday: number;
    openRoles: number;
  };
}
