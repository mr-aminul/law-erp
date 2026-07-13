"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { mockCases } from "@/lib/mock";

interface NewFilingFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const FILING_TYPES = [
  "Writ Petition",
  "Plaint",
  "Appeal",
  "Review",
  "Misc. Application",
];

export function NewFilingForm({ onSubmit, onCancel }: NewFilingFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 max-h-[60vh] overflow-y-auto pr-1">
        <FormField label="Case" required>
          <Select required defaultValue="">
            <option value="" disabled>
              Select case
            </option>
            {mockCases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseId} — {c.matter}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Court" required>
          <Input required />
        </FormField>
        <FormField label="Filing Type" required>
          <Select required defaultValue="Writ Petition">
            {FILING_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Submission Date" required>
          <Input type="date" required />
        </FormField>
        <FormField label="Cause List Reference">
          <Input placeholder="CL-YYYY-MM-DD-..." />
        </FormField>
        <FormField label="Process Server">
          <Input placeholder="Assigned process server" />
        </FormField>
        <FormField label="Filing Fee (BDT)">
          <Input type="number" placeholder="2500" />
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
