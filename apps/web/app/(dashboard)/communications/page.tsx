"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import { mockCaseComments, mockCommunications, mockContactLogs } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { Mail, MessageSquare, Send } from "lucide-react";
import { useState } from "react";

const channelVariant = (c: string) =>
  c === "Email" ? "blue" : c === "SMS" ? "green" : c === "Legal Notice" ? "amber" : "muted";

export default function CommunicationsPage() {
  const [tab, setTab] = useState("all");

  const tabs = [
    { id: "all", label: "All" },
    { id: "internal", label: "Internal Thread" },
    { id: "email", label: "Email Log" },
    { id: "notices", label: "Legal Notices" },
  ];

  const comms =
    tab === "all"
      ? mockCommunications
      : tab === "email"
        ? mockCommunications.filter((c) => c.channel === "Email" || c.channel === "SMS")
        : tab === "notices"
          ? mockCommunications.filter((c) => c.channel === "Legal Notice")
          : [];

  return (
    <div className="space-y-4">
      <ListToolbar
        filters={<Tabs tabs={tabs} activeTab={tab} onChange={setTab} />}
        collapseFiltersOnMobile={false}
        actions={
          <Button>
            <Send className="mr-1.5 h-4 w-4" />
            Send Message
          </Button>
        }
      />

      {tab === "internal" ? (
        <PageSection title="Internal Case Threads">
          <div className="space-y-3">
            {mockCaseComments.map((c) => (
              <div key={c.id} className="rounded-card border border-divider/60 bg-cream-card p-3">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-green" />
                  <span className="text-sm font-semibold">{c.author}</span>
                  <span className="text-xs text-text-muted">{formatDate(c.createdAt)}</span>
                </div>
                <p className="mt-1.5 text-sm text-text-sec">{c.content}</p>
              </div>
            ))}
          </div>
        </PageSection>
      ) : (
        <PageSection title="Communications Log">
          <div className="space-y-2">
            {comms.map((c) => (
              <div key={c.id} className="flex items-start gap-3 rounded-card border border-divider/60 px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-input bg-blue-light text-blue">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold">{c.subject}</span>
                    <Badge variant={channelVariant(c.channel)}>{c.channel}</Badge>
                    <Badge variant={c.status === "Delivered" ? "green" : c.status === "Failed" ? "red" : "amber"}>
                      {c.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-text-sec">
                    {c.clientName ?? "—"} · {c.caseName ?? "—"}
                  </p>
                  <p className="mt-1 text-[11px] text-text-muted">
                    {formatDate(c.sentAt)} · {c.sentBy}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </PageSection>
      )}

      <PageSection title="Client Contact Log">
        <div className="space-y-2">
          {mockContactLogs.map((log) => (
            <div key={log.id} className="flex justify-between rounded-card border border-divider/60 px-3 py-2 text-sm">
              <div>
                <span className="font-semibold">{log.clientName}</span>
                <span className="mx-2 text-text-muted">·</span>
                <span className="text-text-sec">{log.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="blue">{log.type}</Badge>
                <span className="text-xs text-text-muted">{formatDate(log.loggedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
