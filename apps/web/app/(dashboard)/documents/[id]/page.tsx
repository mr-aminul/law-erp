"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DetailField, PageSection } from "@/components/ui/PageSection";
import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { useDomainStore } from "@/lib/store/domainStore";
import { formatDate } from "@/lib/utils/formatDate";
import {
  documentAccessUsers,
  documentScope,
  type Document,
} from "@/types/document";
import { Check, Download, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useState } from "react";

function linkedHref(doc: Document) {
  if (doc.invoiceId) return `/billing/invoices/${doc.invoiceId}`;
  if (doc.caseId) return `/cases/${doc.caseId}?tab=documents`;
  if (doc.clientId) return `/clients/${doc.clientId}?tab=documents`;
  return "/documents";
}

function linkedLabel(doc: Document) {
  if (doc.invoiceId) return doc.invoiceNumber ?? "Invoice";
  if (doc.caseId) return doc.caseName ?? "Case";
  if (doc.clientId) return doc.clientName ?? "Client";
  return "—";
}

export default function DocumentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const ready = useDomainStore((s) => s.hydrated);
  const documents = useDomainStore((s) => s.documents);
  const doc = documents.find((d) => d.id === params.id);
  const [downloaded, setDownloaded] = useState(false);

  if (ready && !doc) notFound();
  if (!doc) {
    return <div className="p-4 text-sm text-text-muted">Loading document…</div>;
  }

  const scope = documentScope(doc);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-card border border-gray-200 bg-surface p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold text-text-primary">{doc.name}</h2>
            <Badge
              variant={
                scope === "case"
                  ? "blue"
                  : scope === "invoice"
                    ? "amber"
                    : scope === "template"
                      ? "amber"
                      : "muted"
              }
            >
              {scope === "case"
                ? "Case"
                : scope === "invoice"
                  ? "Invoice"
                  : scope === "template"
                    ? "Template"
                    : "Client"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-text-sec">
            {doc.category} · v{doc.version} · {doc.language} · {doc.size}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              setDownloaded(true);
              window.setTimeout(() => setDownloaded(false), 2000);
            }}
          >
            {downloaded ? (
              <>
                <Check className="mr-1.5 h-4 w-4" />
                Queued
              </>
            ) : (
              <>
                <Download className="mr-1.5 h-4 w-4" />
                Download
              </>
            )}
          </Button>
          <Link href="/documents">
            <Button variant="secondary">Back to list</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,300px)]">
        <PageSection title="Preview">
          <div className="flex min-h-[min(60dvh,520px)] flex-col items-center justify-center rounded-input border border-dashed border-gray-200 bg-cream-card/40 px-6 py-12 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-card bg-green-light text-green">
              <FileText className="h-7 w-7" />
            </div>
            <p className="text-sm font-semibold text-text-primary">{doc.name}</p>
            <p className="mt-1 max-w-sm text-xs text-text-muted">
              File preview is mocked here. Metadata and links below reflect the stored
              document record.
            </p>
            <p className="mt-4 text-xs text-text-muted">
              Uploaded {formatDate(doc.uploadedAt)} by {doc.uploadedBy}
            </p>
          </div>
        </PageSection>

        <PageSection title="Details">
          <div className="grid gap-4">
            <DetailField label="Category" value={doc.category} />
            <DetailField label="Language" value={doc.language} />
            <DetailField label="Version" value={`v${doc.version}`} />
            <DetailField label="Size" value={doc.size} />
            <DetailField
              label="Access"
              value={<AssignedLawyers lawyers={documentAccessUsers(doc)} />}
            />
            <DetailField label="Uploaded by" value={doc.uploadedBy} />
            <DetailField label="Uploaded" value={formatDate(doc.uploadedAt)} />
            <DetailField
              label={
                scope === "case"
                  ? "Case"
                  : scope === "client"
                    ? "Client"
                    : "Library"
              }
              value={
                scope === "template" ? (
                  "Template library"
                ) : (
                  <Link
                    href={linkedHref(doc)}
                    className="font-medium text-green hover:underline"
                  >
                    {linkedLabel(doc)}
                  </Link>
                )
              }
            />
            {scope === "case" && doc.clientName ? (
              <DetailField
                label="Client"
                value={
                  doc.clientId ? (
                    <Link
                      href={`/clients/${doc.clientId}?tab=documents`}
                      className="font-medium text-green hover:underline"
                    >
                      {doc.clientName}
                    </Link>
                  ) : (
                    doc.clientName
                  )
                }
              />
            ) : null}
          </div>
        </PageSection>
      </div>
    </div>
  );
}
