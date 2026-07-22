"use client";

import { CommLogList } from "@/components/communications/CommLogList";
import { Badge } from "@/components/ui/Badge";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockCaseComments, mockCommunications, mockContactLogs } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { MessageSquare } from "lucide-react";
import { useMemo, useState } from "react";

const tabs = [
  { id: "all", label: "All" },
  { id: "internal", label: "Internal" },
  { id: "email", label: "Email Log" },
  { id: "notices", label: "Legal Notices" },
] as const;

type TabId = (typeof tabs)[number]["id"];

const searchPlaceholder: Record<TabId, string> = {
  all: "Search communications...",
  internal: "Search threads...",
  email: "Search email & SMS log...",
  notices: "Search legal notices...",
};

export default function CommunicationsPage() {
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");

  const emailLog = useMemo(
    () => mockCommunications.filter((c) => c.channel === "Email" || c.channel === "SMS"),
    []
  );
  const notices = useMemo(
    () => mockCommunications.filter((c) => c.channel === "Legal Notice"),
    []
  );

  const q = search.toLowerCase();
  const matchesQuery = (...values: (string | undefined)[]) =>
    !q || values.some((v) => v?.toLowerCase().includes(q));

  const filteredCommunications = mockCommunications.filter((c) =>
    matchesQuery(c.subject, c.clientName, c.caseName)
  );
  const filteredContactLogs = mockContactLogs.filter((log) =>
    matchesQuery(log.clientName, log.subject)
  );
  const filteredEmailLog = emailLog.filter((c) =>
    matchesQuery(c.subject, c.clientName, c.caseName)
  );
  const filteredNotices = notices.filter((c) =>
    matchesQuery(c.subject, c.clientName, c.caseName)
  );
  const filteredThreads = mockCaseComments.filter((c) =>
    matchesQuery(c.author, c.content)
  );

  return (
    <div className="space-y-4">
      <ListToolbar
        collapseFiltersOnMobile={false}
        filters={<SegmentedControl items={tabs.map(({ id, label }) => ({ id, label }))} value={tab} onChange={(id) => setTab(id as TabId)} />}
        search={{
          value: search,
          onChange: setSearch,
          placeholder: searchPlaceholder[tab],
        }}
      />

      {tab === "all" && (
        <>
          <PageSection title="Communications Log">
            <CommLogList items={filteredCommunications} emptyTitle="No communications found" />
          </PageSection>

          <PageSection title="Client Contact Log">
            {filteredContactLogs.length === 0 ? (
              <EmptyState title="No contact log entries found" />
            ) : (
              <Table>
                <TableHeader>
                  <TableHead>Client</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Logged</TableHead>
                </TableHeader>
                <TableBody>
                  {filteredContactLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-semibold">{log.clientName}</TableCell>
                      <TableCell className="text-text-sec">{log.subject}</TableCell>
                      <TableCell>
                        <Badge variant="blue">{log.type}</Badge>
                      </TableCell>
                      <TableCell className="text-text-muted">{formatDate(log.loggedAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </PageSection>
        </>
      )}

      {tab === "internal" && (
        <PageSection title="Internal Case Threads">
          {filteredThreads.length === 0 ? (
            <EmptyState title="No internal threads found" />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Author</TableHead>
                <TableHead>Comment</TableHead>
                <TableHead>Posted</TableHead>
              </TableHeader>
              <TableBody>
                {filteredThreads.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-semibold">
                      <span className="flex items-center gap-2">
                        <MessageSquare className="h-4 w-4 shrink-0 text-text-muted" />
                        {c.author}
                      </span>
                    </TableCell>
                    <TableCell className="text-text-sec">{c.content}</TableCell>
                    <TableCell className="text-text-muted">{formatDate(c.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      {tab === "email" && (
        <PageSection title="Email & SMS Log">
          <CommLogList items={filteredEmailLog} emptyTitle="No email or SMS messages found" />
        </PageSection>
      )}

      {tab === "notices" && (
        <PageSection title="Legal Notices">
          <CommLogList items={filteredNotices} emptyTitle="No legal notices found" />
        </PageSection>
      )}
    </div>
  );
}
