"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import { PageSection } from "@/components/ui/PageSection";
import { documentsSubNav } from "@/lib/config/navigation";
import { mockDocuments } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { FileText, Search, Upload } from "lucide-react";
import { useMemo, useState } from "react";

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const docs = useMemo(() => {
    return mockDocuments.filter((d) => {
      if (d.isTemplate) return false;
      const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || d.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  return (
    <div className="space-y-4">
      <SubNav items={documentsSubNav} />

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button><Upload className="mr-1.5 h-4 w-4" />Upload Document</Button>
      </div>

      <Dropdown
        label="Category"
        options={[
          { value: "all", label: "All Categories" },
          ...["Writ Petition", "Plaint", "Affidavit", "Vakalatnama", "Legal Notice", "MOA", "Other"].map((c) => ({
            value: c,
            label: c,
          })),
        ]}
        value={category}
        onChange={setCategory}
      />

      <PageSection title="Case-Linked Repository" description="Centralized storage with version control and role-based access.">
        <div className="space-y-2">
          {docs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 rounded-card border border-divider/60 px-3 py-2.5 hover:bg-cream-card">
              <div className="flex h-9 w-9 items-center justify-center rounded-input bg-blue-light text-blue">
                <FileText className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{doc.name}</p>
                <p className="text-xs text-text-muted">
                  {doc.caseName ?? "—"} · v{doc.version} · {doc.language} · {doc.size}
                </p>
              </div>
              <Badge variant="muted">{doc.accessLevel}</Badge>
              <span className="text-xs text-text-muted">{formatDate(doc.uploadedAt)}</span>
              <Button variant="ghost" size="sm">Download</Button>
            </div>
          ))}
        </div>
      </PageSection>
    </div>
  );
}
