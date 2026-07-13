"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { documentsSubNav } from "@/lib/config/navigation";
import { mockDocuments } from "@/lib/mock";
import { FileText, Plus } from "lucide-react";

export default function DocumentTemplatesPage() {
  const templates = mockDocuments.filter((d) => d.isTemplate);

  return (
    <div className="space-y-4">
      <SubNav items={documentsSubNav} />

      <ListToolbar
        actions={
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            New Template
          </Button>
        }
      />

      <PageSection
        title="Template Library"
        description="Writ Petition, Vakalatnama, Legal Notice, Affidavit, MOA — Bangla + English support."
      >
        <div className="grid-pair gap-3">
          {templates.map((t) => (
            <div key={t.id} className="rounded-card border border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-input bg-green-light text-green">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold">{t.name}</p>
                  <p className="text-xs text-text-muted">
                    {t.category} · {t.language}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="outline">Use Template</Button>
                    <Button variant="ghost">Preview</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
