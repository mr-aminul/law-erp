"use client";

import { CommLogList } from "@/components/communications/CommLogList";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { mockCommunications, mockContactLogs } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { Send } from "lucide-react";

export default function CommunicationsPage() {
  return (
    <div className="space-y-4">
      <ListToolbar
        actions={
          <Button>
            <Send className="mr-1.5 h-4 w-4" />
            Send Message
          </Button>
        }
      />

      <PageSection title="Communications Log">
        <CommLogList items={mockCommunications} />
      </PageSection>

      <PageSection title="Client Contact Log">
        <div className="space-y-2">
          {mockContactLogs.map((log) => (
            <div key={log.id} className="flex justify-between rounded-card border border-gray-200 px-3 py-2 text-sm">
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
