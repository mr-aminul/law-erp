"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { PageSection } from "@/components/ui/PageSection";
import { staffSubNav } from "@/lib/config/navigation";
import { mockLeaveRequests } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";

export default function LeavePage() {
  return (
    <div className="space-y-4">
      <SubNav items={staffSubNav} />
      <PageSection title="Leave Management" description="Bangladesh Labour Law compliant leave tracking.">
        <div className="space-y-2">
          {mockLeaveRequests.map((lr) => (
            <div key={lr.id} className="flex items-center justify-between rounded-card border border-divider/60 px-3 py-3">
              <div>
                <p className="text-sm font-semibold">{lr.staffName}</p>
                <p className="text-xs text-text-muted">
                  {lr.type} leave · {formatDate(lr.from)} — {formatDate(lr.to)}
                </p>
                <p className="mt-1 text-xs text-text-sec">{lr.reason}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={lr.status === "Approved" ? "green" : lr.status === "Rejected" ? "red" : "amber"}>
                  {lr.status}
                </Badge>
                {lr.status === "Pending" && (
                  <>
                    <button type="button" className="rounded-badge bg-green-light px-2 py-1 text-xs font-semibold text-green">Approve</button>
                    <button type="button" className="rounded-badge bg-red-light px-2 py-1 text-xs font-semibold text-red">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
