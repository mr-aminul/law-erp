import { AlertPanel } from "@/components/dashboard/AlertPanel";
import { CasesTable } from "@/components/dashboard/CasesTable";
import { FYTable } from "@/components/dashboard/FYTable";
import { MonthlyCasesChart } from "@/components/dashboard/MonthlyCasesChart";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusDonut } from "@/components/dashboard/StatusDonut";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { getDashboardStats } from "@/lib/graphql/getDashboard";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Briefcase, Gavel, Receipt, Users } from "lucide-react";

export default async function DashboardPage() {
  const { hearings, invoices, cases, hr } = await getDashboardStats();

  return (
    <div className="space-y-4">
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
          title="HR / Staff"
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
        <div className="min-w-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-text-primary">
                Recent Case Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CasesTable />
            </CardContent>
          </Card>

          <div className="grid-pair">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-text-primary">
                  Case Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <StatusDonut />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-bold text-text-primary">
                  Monthly Cases Due
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MonthlyCasesChart />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-bold text-text-primary">
                FY Wise Case Status Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FYTable />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent>
            <AlertPanel />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
