"use client";

import { ListToolbar } from "@/components/ui/ListToolbar";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import { mockDocuments } from "@/lib/mock";
import { FileText } from "lucide-react";
import { useMemo, useState } from "react";

export default function DocumentTemplatesPage() {
  const [search, setSearch] = useState("");

  const templates = useMemo(() => {
    const q = search.toLowerCase();
    return mockDocuments.filter(
      (d) =>
        d.isTemplate &&
        (!q || d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q))
    );
  }, [search]);

  return (
    <div className="space-y-4">
      <ListToolbar
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search templates...",
        }}
      />

      <PageSection
        title="Template Library"
        description="Writ Petition, Vakalatnama, Legal Notice, Affidavit, MOA — Bangla + English support."
      >
        {templates.length === 0 ? (
          <EmptyState
            title="No templates found"
            description="Try clearing your search or create a new template."
          />
        ) : (
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>
    </div>
  );
}
