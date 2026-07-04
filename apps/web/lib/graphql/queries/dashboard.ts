import { gql } from "graphql-request";

export const DASHBOARD_QUERY = gql`
  query Dashboard {
    dashboard {
      stats {
        hearings {
          today
          thisMonth
          thisYear
        }
        invoices {
          count
          amount
          receiptCount
          receiptAmount
        }
        cases {
          new
          pending
          completed
        }
        hr {
          total
          present
          absent
        }
      }
    }
  }
`;

export interface DashboardQueryResult {
  dashboard: {
    stats: {
      hearings: { today: number; thisMonth: number; thisYear: number };
      invoices: {
        count: number;
        amount: number;
        receiptCount: number;
        receiptAmount: number;
      };
      cases: { new: number; pending: number; completed: number };
      hr: { total: number; present: number; absent: number };
    };
  };
}
