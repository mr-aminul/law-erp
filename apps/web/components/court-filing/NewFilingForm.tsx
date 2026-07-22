"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  type CreateFilingInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import type { FilingStatus } from "@/types/filing";
import { useState } from "react";

interface NewFilingFormProps {
  onSubmit: (input: CreateFilingInput) => void;
  onCancel: () => void;
  defaultCaseId?: string;
}

const FILING_TYPES = [
  "Writ Petition",
  "Plaint",
  "Appeal",
  "Review",
  "Misc. Application",
];

export function NewFilingForm({
  onSubmit,
  onCancel,
  defaultCaseId,
}: NewFilingFormProps) {
  const cases = useDomainStore((s) => s.cases);
  const [caseId, setCaseId] = useState(defaultCaseId ?? "");
  const [court, setCourt] = useState("");
  const [filingType, setFilingType] = useState("Writ Petition");
  const [submittedAt, setSubmittedAt] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [causeListRef, setCauseListRef] = useState("");
  const [processServer, setProcessServer] = useState("");
  const [filingFee, setFilingFee] = useState("");
  const [status, setStatus] = useState<FilingStatus>("Submitted");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caseId || !court.trim()) return;
    onSubmit({
      caseId,
      court,
      filingType,
      submittedAt,
      causeListRef,
      processServer,
      filingFee: filingFee ? Number(filingFee) : 0,
      status,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid max-h-[60vh] gap-4 overflow-y-auto pr-1">
        <FormField label="Case" required>
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
                {c.caseId} — {c.matter}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Court" required>
          <Input
            required
            value={court}
            onChange={(e) => setCourt(e.target.value)}
          />
        </FormField>
        <FormField label="Filing Type" required>
          <Select
            required
            value={filingType}
            onChange={(e) => setFilingType(e.target.value)}
          >
            {FILING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Status" required>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value as FilingStatus)}
          >
            {(["Draft", "Submitted", "Accepted", "Rejected"] as const).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Submission Date" required>
          <Input
            type="date"
            required
            value={submittedAt}
            onChange={(e) => setSubmittedAt(e.target.value)}
          />
        </FormField>
        <FormField label="Cause List Reference">
          <Input
            value={causeListRef}
            onChange={(e) => setCauseListRef(e.target.value)}
            placeholder="CL-YYYY-MM-DD-..."
          />
        </FormField>
        <FormField label="Process Server">
          <Input
            value={processServer}
            onChange={(e) => setProcessServer(e.target.value)}
            placeholder="Assigned process server"
          />
        </FormField>
        <FormField label="Filing Fee (BDT)">
          <Input
            type="number"
            value={filingFee}
            onChange={(e) => setFilingFee(e.target.value)}
            placeholder="2500"
          />
        </FormField>
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Submit Filing</Button>
      </div>
    </form>
  );
}
