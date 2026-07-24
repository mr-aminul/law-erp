"use client";

import { CaseStatusBadge } from "@/components/cases/CaseStatusBadge";
import { AssignedLawyers } from "@/components/cases/AssignedLawyers";
import { UploadDocumentForm } from "@/components/cases/UploadDocumentForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ChipStatusSelect } from "@/components/ui/ChipStatusSelect";
import { Modal } from "@/components/ui/Modal";
import { DetailField, EmptyState, PageSection } from "@/components/ui/PageSection";
import { Tabs } from "@/components/ui/Tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockContactLogs } from "@/lib/mock";
import {
  type CreateDocumentInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import { emailError, phoneError } from "@/lib/utils/validateContact";
import type { ClientStatus, ClientType } from "@/types/client";
import { documentAccessUsers } from "@/types/document";
import { Pencil, Plus } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const CLIENT_TABS = [
  "overview",
  "cases",
  "documents",
  "invoices",
  "contacts",
  "kyc",
] as const;

function ClientDetailContent({ id }: { id: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ready = useDomainStore((s) => s.hydrated);
  const clients = useDomainStore((s) => s.clients);
  const allCases = useDomainStore((s) => s.cases);
  const allInvoices = useDomainStore((s) => s.invoices);
  const allDocuments = useDomainStore((s) => s.documents);
  const updateClient = useDomainStore((s) => s.updateClient);
  const createDocument = useDomainStore((s) => s.createDocument);
  // Filter outside the selector — inline .filter() breaks getServerSnapshot.
  const client = clients.find((c) => c.id === id);
  const cases = allCases.filter((c) => c.clientId === id);
  const tabParam = searchParams.get("tab");
  const initialTab =
    tabParam && (CLIENT_TABS as readonly string[]).includes(tabParam)
      ? tabParam
      : "overview";
  const [tab, setTab] = useState(initialTab);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [contactErrors, setContactErrors] = useState<{
    email: string | null;
    phone: string | null;
  }>({ email: null, phone: null });
  const [draft, setDraft] = useState({
    name: "",
    type: "",
    status: "",
    email: "",
    phone: "",
    nid: "",
    passport: "",
    registrationNo: "",
    address: "",
    referralSource: "",
    conflictChecked: true,
  });

  useEffect(() => {
    const nextTab = searchParams.get("tab");
    if (nextTab && (CLIENT_TABS as readonly string[]).includes(nextTab)) {
      setTab(nextTab);
    }
  }, [searchParams]);

  if (!ready) {
    return <div className="p-4 text-sm text-text-muted">Loading client…</div>;
  }

  if (!client) notFound();

  const invoices = allInvoices.filter((i) => i.clientId === client.id);
  // Client-profile docs only — case files live on the matter.
  const profileDocs = allDocuments.filter(
    (d) => d.clientId === client.id && !d.caseId && !d.isTemplate
  );
  const contacts = mockContactLogs.filter((c) => c.clientId === client.id);
  const displayStatus = (draft.status || client.status) as ClientStatus;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "cases", label: "Cases" },
    { id: "documents", label: "Documents" },
    { id: "invoices", label: "Invoices" },
    { id: "contacts", label: "Contact History" },
    { id: "kyc", label: "KYC Vault" },
  ];

  function startEditing() {
    setDraft({
      name: client!.name,
      type: client!.type,
      status: client!.status,
      email: client!.email ?? "",
      phone: client!.phone ?? "",
      nid: client!.nid ?? "",
      passport: client!.passport ?? "",
      registrationNo: client!.registrationNo ?? "",
      address: client!.address ?? "",
      referralSource: client!.referralSource ?? "",
      conflictChecked: client!.conflictChecked,
    });
    setContactErrors({ email: null, phone: null });
    setEditing(true);
  }

  function finishEditing() {
    const next = {
      email: emailError(draft.email),
      phone: phoneError(draft.phone),
    };
    setContactErrors(next);
    if (next.email || next.phone) return;
    updateClient(client!.id, {
      name: draft.name.trim() || client!.name,
      type: (draft.type as ClientType) || client!.type,
      status: (draft.status as ClientStatus) || client!.status,
      email: draft.email.trim() || undefined,
      phone: draft.phone.trim() || undefined,
      nid: draft.nid.trim() || undefined,
      passport: draft.passport.trim() || undefined,
      registrationNo: draft.registrationNo.trim() || undefined,
      address: draft.address.trim() || undefined,
      referralSource: draft.referralSource.trim() || undefined,
      conflictChecked: draft.conflictChecked,
    });
    setEditing(false);
  }

  function patchDraft(key: keyof typeof draft, value: string | boolean) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    if (key === "email" && typeof value === "string") {
      setContactErrors((prev) => ({ ...prev, email: emailError(value) }));
    }
    if (key === "phone" && typeof value === "string") {
      setContactErrors((prev) => ({ ...prev, phone: phoneError(value) }));
    }
  }

  function handleCreateDocument(input: CreateDocumentInput) {
    const created = createDocument(input);
    setUploadOpen(false);
    if (created) {
      router.push(`/documents/${created.id}`);
      return;
    }
    setTab("documents");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-card border border-gray-200 bg-surface p-3 sm:flex-row sm:items-start sm:justify-between sm:p-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {editing ? (
              <input
                type="text"
                value={draft.name}
                onChange={(e) => patchDraft("name", e.target.value)}
                className="min-w-0 flex-1 border-0 border-b border-gray-300 bg-transparent py-0.5 text-lg font-bold text-text-primary outline-none focus:border-text-primary"
              />
            ) : (
              <h2 className="text-lg font-bold text-text-primary">
                {draft.name || client.name}
              </h2>
            )}
            <Badge variant={displayStatus === "Active" ? "green" : "muted"}>
              {displayStatus}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-text-sec">
            {client.clientId} · {draft.type || client.type}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button
            variant="secondary"
            onClick={() => (editing ? finishEditing() : startEditing())}
          >
            {editing ? (
              "Done"
            ) : (
              <>
                <Pencil className="h-4 w-4" />
                Edit
              </>
            )}
          </Button>
          <Button variant="secondary" onClick={() => router.push("/clients")}>
            Back to list
          </Button>
        </div>
      </div>

      <Tabs tabs={tabs} activeTab={tab} onChange={setTab} />

      {tab === "overview" && (
        <PageSection title="Profile">
          <div className="grid-fields-3">
            <DetailField
              label="Client Type"
              value={draft.type || client.type}
              editing={editing}
              editValue={draft.type}
              onChange={(v) => patchDraft("type", v)}
              options={[
                { value: "Individual", label: "Individual" },
                { value: "Corporate", label: "Corporate" },
                { value: "NGO", label: "NGO" },
              ]}
            />
            <DetailField
              label="Status"
              value={
                <Badge variant={displayStatus === "Active" ? "green" : "muted"}>
                  {displayStatus}
                </Badge>
              }
              editing={editing}
              editSlot={
                <ChipStatusSelect
                  value={(draft.status || client.status) as "Active" | "Inactive"}
                  onChange={(v) => patchDraft("status", v)}
                  options={[
                    { value: "Active", label: "Active", variant: "green" },
                    { value: "Inactive", label: "Inactive", variant: "muted" },
                  ]}
                />
              }
            />
            <DetailField
              label="Email"
              value={draft.email || client.email || "—"}
              editing={editing}
              editValue={draft.email}
              onChange={(v) => patchDraft("email", v)}
              inputType="email"
              error={editing ? contactErrors.email : null}
            />
            <DetailField
              label="Phone"
              value={draft.phone || client.phone || "—"}
              editing={editing}
              editValue={draft.phone}
              onChange={(v) => patchDraft("phone", v)}
              inputType="tel"
              error={editing ? contactErrors.phone : null}
            />
            <DetailField
              label="NID Number"
              value={draft.nid || client.nid || "—"}
              editing={editing}
              editValue={draft.nid}
              onChange={(v) => patchDraft("nid", v)}
            />
            <DetailField
              label="Passport Number"
              value={draft.passport || client.passport || "—"}
              editing={editing}
              editValue={draft.passport}
              onChange={(v) => patchDraft("passport", v)}
            />
            <DetailField
              label="Registration No."
              value={draft.registrationNo || client.registrationNo || "—"}
              editing={editing}
              editValue={draft.registrationNo}
              onChange={(v) => patchDraft("registrationNo", v)}
            />
            <DetailField
              label="Address"
              value={draft.address || client.address || "—"}
              editing={editing}
              editValue={draft.address}
              onChange={(v) => patchDraft("address", v)}
            />
            <DetailField
              label="Referral Source"
              value={draft.referralSource || client.referralSource || "—"}
              editing={editing}
              editValue={draft.referralSource}
              onChange={(v) => patchDraft("referralSource", v)}
            />
            <DetailField label="Member Since" value={formatDate(client.createdAt)} />
            <DetailField
              label="Conflict Check"
              value={
                (editing ? draft.conflictChecked : client.conflictChecked) ? (
                  <Badge variant="green">Cleared</Badge>
                ) : (
                  <Badge variant="amber">Pending</Badge>
                )
              }
              editing={editing}
              editSlot={
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={draft.conflictChecked}
                    onChange={(e) => patchDraft("conflictChecked", e.target.checked)}
                  />
                  COI cleared
                </label>
              }
            />
            <DetailField label="Active Cases" value={client.activeCases} />
            <DetailField label="Total Billed" value={formatCurrency(client.totalBilled)} />
          </div>
        </PageSection>
      )}

      {tab === "cases" && (
        <PageSection
          title="Linked Cases"
          action={
            <Link href={`/cases?new=1&client=${client.id}`}>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                New Case
              </Button>
            </Link>
          }
        >
          {cases.length === 0 ? (
            <EmptyState
              title="No linked cases"
              description="Cases opened for this client will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
              </TableHeader>
              <TableBody>
                {cases.map((c) => (
                  <TableRow key={c.id} onClick={() => router.push(`/cases/${c.id}`)}>
                    <TableCell className="font-medium">{c.matter}</TableCell>
                    <TableCell className="text-text-sec">{c.type}</TableCell>
                    <TableCell><CaseStatusBadge status={c.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      {tab === "documents" && (
        <PageSection
          title="Client Documents"
          description="Profile records not tied to a specific case — title deeds, property schedules, and similar."
          action={
            <Button onClick={() => setUploadOpen(true)}>
              <Plus className="mr-1.5 h-4 w-4" />
              Add Document
            </Button>
          }
        >
          {profileDocs.length === 0 ? (
            <EmptyState
              title="No client documents yet"
              description="Upload title deeds, property records, and other profile files here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Access</TableHead>
                <TableHead>Uploaded</TableHead>
              </TableHeader>
              <TableBody>
                {profileDocs.map((d) => (
                  <TableRow
                    key={d.id}
                    onClick={() => router.push(`/documents/${d.id}`)}
                  >
                    <TableCell className="font-semibold">{d.name}</TableCell>
                    <TableCell>{d.category}</TableCell>
                    <TableCell className="text-text-muted">
                      v{d.version} · {d.language} · {d.size}
                    </TableCell>
                    <TableCell>
                      <AssignedLawyers lawyers={documentAccessUsers(d)} />
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {formatDate(d.uploadedAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      {tab === "invoices" && (
        <PageSection
          title="Invoices"
          action={
            <Link href={`/billing/invoices?new=1`}>
              <Button>
                <Plus className="mr-1.5 h-4 w-4" />
                New Invoice
              </Button>
            </Link>
          }
        >
          {invoices.length === 0 ? (
            <EmptyState
              title="No invoices"
              description="Invoices billed to this client will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Invoice #</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due</TableHead>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id} onClick={() => router.push(`/billing/invoices/${inv.id}`)}>
                    <TableCell className="font-semibold">{inv.invoiceNumber}</TableCell>
                    <TableCell>{inv.caseName}</TableCell>
                    <TableCell>{formatCurrency(inv.amount)}</TableCell>
                    <TableCell>
                      <Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge>
                    </TableCell>
                    <TableCell className="text-text-muted">{formatDate(inv.dueDate)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      {tab === "contacts" && (
        <PageSection title="Contact History">
          {contacts.length === 0 ? (
            <EmptyState
              title="No contact logs yet"
              description="Calls, emails, and meetings with this client will be logged here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Type</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Logged By</TableHead>
                <TableHead>Date</TableHead>
              </TableHeader>
              <TableBody>
                {contacts.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell><Badge variant="blue">{log.type}</Badge></TableCell>
                    <TableCell className="font-semibold">{log.subject}</TableCell>
                    <TableCell className="max-w-[280px] truncate text-text-sec">{log.notes}</TableCell>
                    <TableCell className="text-text-muted">{log.loggedBy}</TableCell>
                    <TableCell className="text-text-muted">{formatDate(log.loggedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      {tab === "kyc" && (
        <PageSection title="KYC Document Vault">
          {!client.kycDocuments?.length ? (
            <EmptyState
              title="No KYC documents uploaded"
              description="Identity and compliance documents for this client will appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableHead>Document Type</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableHeader>
              <TableBody>
                {client.kycDocuments.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-semibold">{doc.type}</TableCell>
                    <TableCell className="text-text-muted">
                      {doc.expiryDate ? formatDate(doc.expiryDate) : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant={doc.verified ? "green" : "amber"}>
                        {doc.verified ? "Verified" : "Pending"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </PageSection>
      )}

      <Modal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        title="Add Client Document"
        className="max-w-xl"
      >
        <UploadDocumentForm
          defaultClientId={client.id}
          onSubmit={handleCreateDocument}
          onCancel={() => setUploadOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-text-muted">Loading client…</div>}>
      <ClientDetailContent id={params.id} />
    </Suspense>
  );
}
