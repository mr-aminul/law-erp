"use client";

import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { mockCaseComments } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { MessageSquare, Send } from "lucide-react";

export default function InternalCommunicationsPage() {
  return (
    <div className="space-y-4">
      <ListToolbar
        actions={
          <Button>
            <Send className="mr-1.5 h-4 w-4" />
            New Thread Reply
          </Button>
        }
      />

      <PageSection title="Internal Case Threads">
        <div className="space-y-3">
          {mockCaseComments.map((c) => (
            <div key={c.id} className="rounded-card border border-gray-200 bg-cream-card p-3">
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
    </div>
  );
}
