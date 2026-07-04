"use client";

import { SubNav } from "@/components/layout/SubNav";
import { PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { settingsSubNav } from "@/lib/config/navigation";
import { mockAuditLog } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";

export default function AuditPage() {
  return (
    <div className="space-y-4">
      <SubNav items={settingsSubNav} />
      <PageSection title="Audit Log" description="Who accessed or changed what, and when.">
        <Table compact>
          <TableHeader>
            <TableHead>Timestamp</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>IP</TableHead>
          </TableHeader>
          <TableBody>
            {mockAuditLog.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="text-text-muted">{formatDate(entry.timestamp)}</TableCell>
                <TableCell className="font-semibold">{entry.user}</TableCell>
                <TableCell>{entry.action}</TableCell>
                <TableCell>{entry.resource}</TableCell>
                <TableCell className="text-text-muted">{entry.ip ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
