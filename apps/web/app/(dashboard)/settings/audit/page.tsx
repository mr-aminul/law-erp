"use client";

import { ListToolbar } from "@/components/ui/ListToolbar";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockAuditLog } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { useMemo, useState } from "react";

export default function AuditPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return mockAuditLog.filter(
      (entry) =>
        !q ||
        entry.user.toLowerCase().includes(q) ||
        entry.action.toLowerCase().includes(q) ||
        entry.resource.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <ListToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search by user, action, or resource...",
        }}
      />
      <PageSection title="Audit Log" description="Who accessed or changed what, and when.">
        {filtered.length === 0 ? (
          <EmptyState
            title="No audit entries found"
            description="Try clearing your search."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>IP</TableHead>
            </TableHeader>
            <TableBody>
              {filtered.map((entry) => (
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
        )}
      </PageSection>
    </div>
  );
}
