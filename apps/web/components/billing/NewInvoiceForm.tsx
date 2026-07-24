"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  type CreateInvoiceInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import type { InvoiceStatus } from "@/types/invoice";
import { useMemo, useState } from "react";

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

interface NewInvoiceFormProps {
  onSubmit: (input: CreateInvoiceInput) => void;
  onCancel: () => void;
  defaultCaseId?: string;
}

export function NewInvoiceForm({
  onSubmit,
  onCancel,
  defaultCaseId = "",
}: NewInvoiceFormProps) {
  const cases = useDomainStore((s) => s.cases);
  const [caseId, setCaseId] = useState(defaultCaseId);
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState(defaultDueDate);
  const [status, setStatus] = useState<InvoiceStatus>("Draft");

  const selected = useMemo(
    () => cases.find((c) => c.id === caseId),
    [cases, caseId]
  );

  const amountValue = Number(amount);
  const canSubmit =
    Boolean(caseId) && Number.isFinite(amountValue) && amountValue > 0 && Boolean(dueDate);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      caseId,
      amount: amountValue,
      dueDate,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid-fields-2 max-h-[60vh] overflow-y-auto pr-1">
        <FormField label="Case / Matter" required>
          <Select
            required
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          >
            <option value="" disabled>
              Select case
            </option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.matter} — {c.clientName}
              </option>
            ))}
          </Select>
        </FormField>

        <FormField label="Client">
          <Input value={selected?.clientName ?? ""} readOnly placeholder="Select a case" />
        </FormField>

        <FormField label="Amount (BDT)" required>
          <Input
            required
            type="number"
            min={1}
            step={1}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 50000"
          />
        </FormField>

        <FormField label="Due Date" required>
          <Input
            required
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </FormField>

        <FormField label="Status">
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
          </Select>
        </FormField>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!canSubmit}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
