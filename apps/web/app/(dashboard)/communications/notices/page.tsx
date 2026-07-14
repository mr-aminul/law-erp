"use client";

import { CommLogList } from "@/components/communications/CommLogList";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { mockCommunications } from "@/lib/mock";
import { Send } from "lucide-react";

const notices = mockCommunications.filter((c) => c.channel === "Legal Notice");

export default function LegalNoticesPage() {
  return (
    <div className="space-y-4">
      <ListToolbar
        actions={
          <Button>
            <Send className="mr-1.5 h-4 w-4" />
            Send Notice
          </Button>
        }
      />

      <PageSection title="Legal Notices">
        <CommLogList items={notices} />
      </PageSection>
    </div>
  );
}
