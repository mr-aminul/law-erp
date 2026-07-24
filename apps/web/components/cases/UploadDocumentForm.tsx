"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { UserChip } from "@/components/ui/UserChip";
import { mockStaff } from "@/lib/mock";
import {
  type CreateDocumentInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import type {
  DocumentCategory,
  DocumentLanguage,
  DocumentScope,
} from "@/types/document";
import { Upload } from "lucide-react";
import { useRef, useState } from "react";

const CASE_CATEGORIES: DocumentCategory[] = [
  "Writ Petition",
  "Plaint",
  "Affidavit",
  "Vakalatnama",
  "Legal Notice",
  "MOA",
  "Other",
];

const CLIENT_CATEGORIES: DocumentCategory[] = [
  "Title Deed",
  "Property Record",
  "Identity",
  "Affidavit",
  "MOA",
  "Other",
];

const INVOICE_CATEGORIES: DocumentCategory[] = [
  "Invoice",
  "Receipt",
  "Other",
];

const LANGUAGES: DocumentLanguage[] = ["English", "Bangla", "Bilingual"];

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadDocumentFormProps {
  onSubmit: (input: CreateDocumentInput) => void;
  onCancel: () => void;
  defaultCaseId?: string;
  defaultClientId?: string;
  defaultInvoiceId?: string;
}

export function UploadDocumentForm({
  onSubmit,
  onCancel,
  defaultCaseId,
  defaultClientId,
  defaultInvoiceId,
}: UploadDocumentFormProps) {
  const cases = useDomainStore((s) => s.cases);
  const clients = useDomainStore((s) => s.clients);
  const invoices = useDomainStore((s) => s.invoices);
  const lawyers = mockStaff.filter((s) => s.role !== "Admin");
  const lockedScope: DocumentScope | null = defaultInvoiceId
    ? "invoice"
    : defaultCaseId
      ? "case"
      : defaultClientId
        ? "client"
        : null;
  const [scope, setScope] = useState<DocumentScope>(
    lockedScope ?? (defaultClientId && !defaultCaseId ? "client" : "case")
  );
  const [caseId, setCaseId] = useState(defaultCaseId ?? "");
  const [clientId, setClientId] = useState(defaultClientId ?? "");
  const [invoiceId, setInvoiceId] = useState(defaultInvoiceId ?? "");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<DocumentCategory>(
    scope === "invoice"
      ? "Invoice"
      : scope === "client"
        ? "Property Record"
        : "Other"
  );
  const [language, setLanguage] = useState<DocumentLanguage>("English");
  const [accessUserIds, setAccessUserIds] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string | undefined>();
  const [fileSize, setFileSize] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories =
    scope === "invoice"
      ? INVOICE_CATEGORIES
      : scope === "client"
        ? CLIENT_CATEGORIES
        : CASE_CATEGORIES;

  const selectedInvoice = invoices.find((i) => i.id === invoiceId);

  function changeScope(next: DocumentScope) {
    if (lockedScope) return;
    if (next === "invoice" || next === "template") return;
    setScope(next);
    setCategory(next === "client" ? "Property Record" : "Other");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || accessUserIds.length === 0) return;
    const accessUsers = accessUserIds
      .map((id) => lawyers.find((l) => l.id === id)?.name)
      .filter((n): n is string => Boolean(n));
    if (accessUsers.length === 0) return;

    if (scope === "invoice") {
      if (!invoiceId) return;
      onSubmit({
        invoiceId,
        name,
        category,
        language,
        accessUsers,
        size: fileSize,
      });
      return;
    }

    if (scope === "case") {
      if (!caseId) return;
      onSubmit({
        caseId,
        name,
        category,
        language,
        accessUsers,
        size: fileSize,
      });
      return;
    }
    if (!clientId) return;
    onSubmit({
      clientId,
      name,
      category,
      language,
      accessUsers,
      size: fileSize,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid-fields-2">
        {!lockedScope && (
          <div className="sm:col-span-2">
            <FormField label="Link to" required>
              <SegmentedControl
                fill
                size="sm"
                value={scope}
                onChange={(id) => changeScope(id as DocumentScope)}
                items={[
                  { id: "case", label: "Case" },
                  { id: "client", label: "Client profile" },
                ]}
              />
            </FormField>
          </div>
        )}

        <div className="sm:col-span-2">
          {scope === "invoice" ? (
            <FormField label="Invoice" required>
              <Select
                required
                value={invoiceId}
                onChange={(e) => setInvoiceId(e.target.value)}
                disabled={Boolean(defaultInvoiceId)}
              >
                <option value="" disabled>
                  Select invoice
                </option>
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.clientName}
                  </option>
                ))}
              </Select>
              {selectedInvoice ? (
                <p className="mt-1.5 text-xs text-text-muted">
                  {selectedInvoice.clientName} · {selectedInvoice.caseName}
                </p>
              ) : null}
            </FormField>
          ) : scope === "case" ? (
            <FormField label="Case" required>
              <Select
                required
                value={caseId}
                onChange={(e) => setCaseId(e.target.value)}
                disabled={Boolean(defaultCaseId)}
              >
                <option value="" disabled>
                  Select case
                </option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.caseId} — {c.matter}
                  </option>
                ))}
              </Select>
            </FormField>
          ) : (
            <FormField label="Client" required>
              <Select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={Boolean(defaultClientId)}
              >
                <option value="" disabled>
                  Select client
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientId} — {c.name}
                  </option>
                ))}
              </Select>
            </FormField>
          )}
        </div>

        <div className="sm:col-span-2">
          <FormField label="Document Name" required>
            <Input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={
                scope === "invoice"
                  ? "e.g. Signed invoice PDF"
                  : scope === "client"
                    ? "e.g. Property ownership schedule"
                    : "e.g. Writ petition draft v2"
              }
            />
          </FormField>
        </div>

        <FormField label="Category" required>
          <Select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Language" required>
          <Select
            required
            value={language}
            onChange={(e) => setLanguage(e.target.value as DocumentLanguage)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="sm:col-span-2">
          <FormField label="Access" required>
            <div className="flex flex-wrap items-center gap-2">
              {accessUserIds.map((id) => {
                const person = lawyers.find((s) => s.id === id);
                if (!person) return null;
                return (
                  <UserChip
                    key={id}
                    name={person.name}
                    initials={person.initials}
                    onRemove={() =>
                      setAccessUserIds((prev) =>
                        prev.filter((personId) => personId !== id)
                      )
                    }
                  />
                );
              })}
              <MultiSelectDropdown
                variant="chip"
                searchable
                searchPlaceholder="Search people…"
                placeholder="Grant access"
                options={lawyers.map((s) => ({
                  value: s.id,
                  label: s.name,
                  initials: s.initials,
                  description: s.email ? `${s.role} · ${s.email}` : s.role,
                }))}
                value={accessUserIds}
                onChange={setAccessUserIds}
              />
            </div>
            {accessUserIds.length === 0 ? (
              <p className="mt-1.5 text-xs text-text-muted">
                Select at least one person
              </p>
            ) : null}
          </FormField>
        </div>

        <div className="sm:col-span-2">
          <FormField label="File" required>
            <input
              ref={fileInputRef}
              type="file"
              required
              accept=".pdf,.doc,.docx,.jpg,.png"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setFileName(file?.name);
                setFileSize(file ? formatFileSize(file.size) : undefined);
                if (file && !name.trim()) {
                  setName(file.name.replace(/\.[^.]+$/, ""));
                }
              }}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-10 w-full items-center gap-2 rounded-input border border-gray-200 bg-surface px-3 text-left text-sm transition-colors hover:border-gray-300 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <Upload className="h-4 w-4 shrink-0 text-text-muted" />
              <span
                className={
                  fileName
                    ? "min-w-0 truncate font-medium text-text-primary"
                    : "text-text-muted"
                }
              >
                {fileName ?? "Choose PDF, Word, or image…"}
              </span>
            </button>
          </FormField>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Document</Button>
      </div>
    </form>
  );
}
