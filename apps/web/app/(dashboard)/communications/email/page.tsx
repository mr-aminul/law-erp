"use client";

import { CommLogList } from "@/components/communications/CommLogList";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { mockCommunications } from "@/lib/mock";
import { Send } from "lucide-react";

const emailLog = mockCommunications.filter(
  (c) => c.channel === "Email" || c.channel === "SMS"
);

export default function EmailLogPage() {
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

      <PageSection title="Email & SMS Log">
        <CommLogList items={emailLog} />
      </PageSection>
    </div>
  );
}
