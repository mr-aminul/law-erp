"use client";

import { Badge } from "@/components/ui/Badge";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockDocuments } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import { FileText } from "lucide-react";
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
      />

      <PageSection
        title="Case-Linked Repository"
        description="Centralized storage with version control and role-based access."
      >
        {docs.length === 0 ? (
          <EmptyState
            title="No documents found"
            description="Try clearing filters or upload a new document."
          />
        ) : (
          <Table>
            <TableHeader>
              <TableHead>Document</TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-semibold">
                    <span className="flex items-center gap-2">
                      <FileText className="h-4 w-4 shrink-0 text-text-muted" />
                      {doc.name}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate text-text-sec">{doc.caseName ?? "—"}</TableCell>
                  <TableCell className="text-text-muted">v{doc.version} · {doc.language} · {doc.size}</TableCell>
                  <TableCell>
                    <Badge variant="muted">{doc.accessLevel}</Badge>
                  </TableCell>
                  <TableCell className="text-text-muted">{formatDate(doc.uploadedAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </PageSection>
    </div>
  );
}
