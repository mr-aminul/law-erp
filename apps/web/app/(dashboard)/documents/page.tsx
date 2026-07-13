"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import { mockDocuments } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { FileText, Upload } from "lucide-react";
import { useMemo, useState } from "react";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const docs = useMemo(() => {
    return mockDocuments.filter((d) => {
      if (d.isTemplate) return false;
      const matchSearch =
        !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || d.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={category !== "all" ? 1 : 0}
        onClearFilters={() => setCategory("all")}
        filters={
          <Dropdown
            label="Category"
            options={[
              { value: "all", label: "All Categories" },
              ...[
                "Writ Petition",
                "Plaint",
                "Affidavit",
                "Vakalatnama",
                "Legal Notice",
                "MOA",
                "Other",
              ].map((c) => ({
                value: c,
                label: c,
              })),
            ]}
            value={category}
            onChange={setCategory}
          />
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search documents...",
        }}
        actions={
          <Button>
            <Upload className="mr-1.5 h-4 w-4" />
            Upload Document
          </Button>
        }
      />

      <PageSection
        title="Case-Linked Repository"
        description="Centralized storage with version control and role-based access."
      >
        <div className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 rounded-card border border-gray-200 px-3 py-2.5 hover:bg-cream-card"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-input bg-blue-light text-blue">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{doc.name}</p>
                <p className="text-xs text-text-muted">
                  {doc.caseName ?? "—"} · v{doc.version} · {doc.language} ·{" "}
                  {doc.size}
                </p>
              </div>
              <Badge variant="muted">{doc.accessLevel}</Badge>
              <span className="text-xs text-text-muted">
                {formatDate(doc.uploadedAt)}
              </span>
              <Button variant="ghost">Download</Button>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
