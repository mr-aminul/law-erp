"use client";

import { UploadDocumentForm } from "@/components/cases/UploadDocumentForm";
import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  type CreateDocumentInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatDate } from "@/lib/utils/formatDate";
import { documentAccessUsers, documentScope } from "@/types/document";
import { FileText, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

const CATEGORY_OPTIONS = [
  "Writ Petition",
  "Plaint",
  "Affidavit",
  "Vakalatnama",
  "Legal Notice",
  "MOA",
  "Title Deed",
  "Property Record",
  "Identity",
  "Invoice",
  "Receipt",
  "Other",
];

function DocumentsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [uploadOpen, setUploadOpen] = useState(false);
  const documents = useDomainStore((s) => s.documents);
  const createDocument = useDomainStore((s) => s.createDocument);

  const prefillCaseId = searchParams.get("case") ?? undefined;
  const prefillClientId = searchParams.get("client") ?? undefined;

  useEffect(() => {
    setUploadOpen(searchParams.get("new") === "1");
  }, [searchParams]);

  const docs = useMemo(() => {
    return documents.filter((d) => {
      if (d.isTemplate) return false;
      const matchSearch =
        !search ||
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.caseName?.toLowerCase().includes(search.toLowerCase()) ||
        d.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        d.invoiceNumber?.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "all" || d.category === category;
      const scope = documentScope(d);
      const matchScope = scopeFilter === "all" || scope === scopeFilter;
      return matchSearch && matchCat && matchScope;
    });
  }, [documents, search, category, scopeFilter]);

  function openUploadModal() {
    setUploadOpen(true);
    if (searchParams.get("new") !== "1") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("new", "1");
      router.replace(`/documents?${params}`, { scroll: false });
    }
  }

  function closeUploadModal() {
    setUploadOpen(false);
    if (searchParams.get("new")) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("new");
      const qs = params.toString();
      router.replace(qs ? `/documents?${qs}` : "/documents");
    }
  }

  function handleCreateDocument(input: CreateDocumentInput) {
    const created = createDocument(input);
    closeUploadModal();
    if (created) {
      router.push(`/documents/${created.id}`);
    }
  }

  function openDocument(doc: (typeof docs)[number]) {
    router.push(`/documents/${doc.id}`);
  }

  const activeFilterCount =
    (category !== "all" ? 1 : 0) + (scopeFilter !== "all" ? 1 : 0);

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={activeFilterCount}
        onClearFilters={() => {
          setCategory("all");
          setScopeFilter("all");
        }}
        filters={
          <>
            <Dropdown
              label="Linked to"
              options={[
                { value: "all", label: "All" },
                { value: "case", label: "Cases" },
                { value: "client", label: "Client profiles" },
                { value: "invoice", label: "Invoices" },
              ]}
              value={scopeFilter}
              onChange={setScopeFilter}
            />
            <Dropdown
              label="Category"
              options={[
                { value: "all", label: "All Categories" },
                ...CATEGORY_OPTIONS.map((c) => ({ value: c, label: c })),
              ]}
              value={category}
              onChange={setCategory}
            />
          </>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search documents, cases, clients...",
        }}
        actions={
          <Button type="button" onClick={openUploadModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            Add Document
          </Button>
        }
      />

      <PageSection
        title="Document Repository"
        description="Case files and client-profile records in one place, with versioning and role-based access."
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
              <TableHead>Linked to</TableHead>
              <TableHead>Version</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Uploaded</TableHead>
            </TableHeader>
            <TableBody>
              {docs.map((doc) => {
                const scope = documentScope(doc);
                return (
                  <TableRow key={doc.id} onClick={() => openDocument(doc)}>
                    <TableCell className="font-semibold">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0 text-text-muted" />
                        {doc.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex min-w-0 flex-col gap-1">
                        <Badge
                          variant={
                            scope === "case"
                              ? "blue"
                              : scope === "invoice"
                                ? "amber"
                                : "muted"
                          }
                        >
                          {scope === "case"
                            ? "Case"
                            : scope === "invoice"
                              ? "Invoice"
                              : "Client"}
                        </Badge>
                        <span className="max-w-[200px] truncate text-text-sec">
                          {doc.invoiceId
                            ? (doc.invoiceNumber ?? "Invoice")
                            : doc.caseId
                              ? (doc.caseName ?? "Case")
                              : (doc.clientName ?? "Client")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-text-muted">
                      v{doc.version} · {doc.language} · {doc.size}
                    </TableCell>
                    <TableCell>
                      <AssignedLawyers lawyers={documentAccessUsers(doc)} />
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {formatDate(doc.uploadedAt)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </PageSection>

      <Modal
        open={uploadOpen}
        onClose={closeUploadModal}
        title="Add Document"
        className="max-w-xl"
      >
        <UploadDocumentForm
          key={`${prefillCaseId ?? ""}-${prefillClientId ?? ""}`}
          defaultCaseId={prefillCaseId}
          defaultClientId={prefillClientId}
          onSubmit={handleCreateDocument}
          onCancel={closeUploadModal}
        />
      </Modal>
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-text-muted">Loading…</div>}>
      <DocumentsContent />
    </Suspense>
  );
}
