"use client";

import { NewInvoiceForm } from "@/components/billing/NewInvoiceForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  type CreateInvoiceInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { invoiceStatusVariant } from "@/lib/utils/invoiceStatus";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function InvoicesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const invoices = useDomainStore((s) => s.invoices);
  const createInvoice = useDomainStore((s) => s.createInvoice);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [newInvoiceOpen, setNewInvoiceOpen] = useState(false);
  const defaultCaseId = searchParams.get("caseId") ?? "";

  useEffect(() => {
    setNewInvoiceOpen(searchParams.get("new") === "1");
  }, [searchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return invoices.filter((inv) => {
      const matchStatus = status === "all" || inv.status === status;
      const matchSearch =
        !q ||
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.caseName.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [invoices, status, search]);

  function openNewInvoiceModal() {
    setNewInvoiceOpen(true);
    if (searchParams.get("new") !== "1") {
      const qs = new URLSearchParams();
      qs.set("new", "1");
      if (defaultCaseId) qs.set("caseId", defaultCaseId);
      router.replace(`/billing/invoices?${qs.toString()}`, { scroll: false });
    }
  }

  function closeNewInvoiceModal() {
    setNewInvoiceOpen(false);
    if (searchParams.get("new") || searchParams.get("caseId")) {
      router.replace("/billing/invoices");
    }
  }

  function handleCreateInvoice(input: CreateInvoiceInput) {
    const created = createInvoice(input);
    closeNewInvoiceModal();
    if (created) router.push(`/billing/invoices/${created.id}`);
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={status !== "all" ? 1 : 0}
        onClearFilters={() => setStatus("all")}
        filters={
          <Dropdown
            label="Status"
            options={[
              { value: "all", label: "All" },
              { value: "Draft", label: "Draft" },
              { value: "Sent", label: "Sent" },
              { value: "Paid", label: "Paid" },
              { value: "Overdue", label: "Overdue" },
            ]}
            value={status}
            onChange={setStatus}
          />
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search invoices...",
        }}
        actions={
          <Button type="button" onClick={openNewInvoiceModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Invoice
          </Button>
        }
      />
      {filtered.length === 0 ? (
        <EmptyState
          title="No invoices found"
          description="Try clearing filters or create a new invoice."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((inv) => (
              <TableRow key={inv.id} onClick={() => router.push(`/billing/invoices/${inv.id}`)}>
                <TableCell className="font-semibold">{inv.invoiceNumber}</TableCell>
                <TableCell>{inv.clientName}</TableCell>
                <TableCell className="max-w-[180px] truncate text-text-sec">{inv.caseName}</TableCell>
                <TableCell>{formatCurrency(inv.amount)}</TableCell>
                <TableCell><Badge variant={invoiceStatusVariant(inv.status)}>{inv.status}</Badge></TableCell>
                <TableCell className="text-text-muted">{formatDate(inv.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal
        open={newInvoiceOpen}
        onClose={closeNewInvoiceModal}
        title="New Invoice"
        className="max-w-2xl"
      >
        <NewInvoiceForm
          onSubmit={handleCreateInvoice}
          onCancel={closeNewInvoiceModal}
          defaultCaseId={defaultCaseId}
        />
      </Modal>
    </div>
  );
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={null}>
      <InvoicesContent />
    </Suspense>
  );
}
