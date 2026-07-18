import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { CasesTable } from "@/components/dashboard/CasesTable";
import { FYTable } from "@/components/dashboard/FYTable";
import { MonthlyCasesChart } from "@/components/dashboard/MonthlyCasesChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusDonut } from "@/components/dashboard/StatusDonut";
import { PageSection } from "@/components/ui/PageSection";
import { getDashboardStats } from "@/lib/graphql/getDashboard";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Briefcase, Gavel, Receipt, Users } from "lucide-react";

export default async function DashboardPage() {
  const { hearings, invoices, cases, hr } = await getDashboardStats();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid-stats">
        <StatCard
          title="Hearings"
          icon={Gavel}
          accent="green"
          primaryValue={hearings.today}
          primaryLabel="Scheduled today"
          metrics={[
            { label: "This month", value: hearings.thisMonth },
            { label: "This year", value: hearings.thisYear },
          ]}
        />

        <StatCard
          title="Invoices"
          icon={Receipt}
          accent="blue"
          primaryValue={formatCurrency(invoices.amount)}
          primaryLabel={`${invoices.count} invoices issued`}
          metrics={[
            {
              label: "Collected",
              value: formatCurrency(invoices.receiptAmount),
              highlight: true,
            },
            { label: "Receipts", value: invoices.receiptCount },
          ]}
        />

        <StatCard
          title="Cases"
          icon={Briefcase}
          accent="sidebar"
          primaryValue={cases.pending}
          primaryLabel="Active matters"
          metrics={[
            { label: "Pending", value: cases.pending, highlight: true },
            { label: "Completed", value: cases.completed },
          ]}
        />

        <StatCard
          title="HR / Employees"
          icon={Users}
          accent="amber"
          primaryValue={`${hr.present}/${hr.total}`}
          primaryLabel="Present today"
          metrics={[
            { label: "Present", value: hr.present, highlight: true },
            { label: "Absent", value: hr.absent },
          ]}
        />
      </div>

      <div className="grid-split">
        <div className="flex min-w-0 flex-col gap-4">
          <PageSection title="Recent Case Activity">
            <CasesTable />
          </PageSection>

          <div className="grid-pair">
            <PageSection title="Case Status">
              <StatusDonut />
            </PageSection>

            <PageSection title="Monthly Cases Due">
              <MonthlyCasesChart />
            </PageSection>
          </div>

          <PageSection title="FY Wise Case Status Report">
            <FYTable />
          </PageSection>
        </div>

        <AlertPanel />
      </div>
    </div>
  );
}
