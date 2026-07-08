"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { UserSearchPicker } from "@/components/ui/UserSearchPicker";
import { mockClients, mockStaff } from "@/lib/mock";
import { CASE_STATUSES } from "@/lib/utils/caseStatus";
import type { CaseType } from "@/types/case";
import { useState } from "react";

const DEFAULT_CASE_TYPES: CaseType[] = [
  "Civil",
  "Criminal",
  "Family",
  "Corporate",
  "Labour",
  "Property",
];

const CREATE_CLIENT_VALUE = "__create_client__";
const CREATE_TYPE_VALUE = "__create_type__";

interface NewCaseFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewCaseForm({ onSubmit, onCancel }: NewCaseFormProps) {
  const [clientSelection, setClientSelection] = useState("");
  const [newClientName, setNewClientName] = useState("");
  const [typeSelection, setTypeSelection] = useState("Civil");
  const [customType, setCustomType] = useState("");
  const [assignedLawyerIds, setAssignedLawyerIds] = useState<string[]>([]);

  const lawyers = mockStaff.filter((s) => s.role !== "Admin");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  function handleTypeChange(value: string) {
    setTypeSelection(value);
    if (value !== CREATE_TYPE_VALUE) setCustomType("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid max-h-[60vh] grid-cols-2 gap-4 overflow-y-auto pr-1">
        <FormField label="Client" required>
          <Select
            required={clientSelection !== CREATE_CLIENT_VALUE}
            value={clientSelection}
            onChange={(e) => setClientSelection(e.target.value)}
          >
            <option value="" disabled>
              Select client
            </option>
            {mockClients
              .filter((c) => c.status === "Active")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            <option value={CREATE_CLIENT_VALUE}>+ Create new client</option>
          </Select>
        </FormField>

        {clientSelection === CREATE_CLIENT_VALUE && (
          <FormField label="New Client Name" required>
            <Input
              required
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="Full name or company"
            />
          </FormField>
        )}

        <FormField label="Case Type" required>
          <Select
            required={typeSelection !== CREATE_TYPE_VALUE}
            value={typeSelection}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            {DEFAULT_CASE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
            <option value={CREATE_TYPE_VALUE}>+ Create new type</option>
          </Select>
        </FormField>

        {typeSelection === CREATE_TYPE_VALUE && (
          <FormField label="New Case Type" required>
            <Input
              required
              value={customType}
              onChange={(e) => setCustomType(e.target.value)}
              placeholder="e.g. Tax, Immigration"
            />
          </FormField>
        )}

        <FormField label="Court Level" required>
          <Select required defaultValue="District Court">
            {["Supreme Court", "High Court Division", "District Court", "Tribunal"].map(
              (c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              )
            )}
          </Select>
        </FormField>

        <FormField label="Court Name" required>
          <Input required placeholder="e.g. 1st Court of Joint District Judge, Dhaka" />
        </FormField>

        <FormField label="Case Number">
          <Input placeholder="Court-assigned number" />
        </FormField>

        <FormField label="First Hearing Date">
          <Input type="date" />
        </FormField>

        <FormField label="Deadline">
          <Input type="date" />
        </FormField>

        <FormField label="Status">
          <Select defaultValue="Pending">
            {CASE_STATUSES.filter((s) => s !== "Completed").map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </FormField>

        <div className="col-span-2">
          <FormField label="Matter / Description" required>
            <Textarea required placeholder="Brief description of the matter" />
          </FormField>
        </div>

        <div className="col-span-2">
          <FormField label="Assign Lawyers" required>
            <UserSearchPicker
              users={lawyers.map((s) => ({
                id: s.id,
                name: s.name,
                role: s.role,
                initials: s.initials,
                email: s.email,
              }))}
              selectedIds={assignedLawyerIds}
              onChange={setAssignedLawyerIds}
              placeholder="Search lawyers by name, role, or email…"
              hint="Type to search firm users — select at least one lawyer"
            />
          </FormField>
        </div>

        <FormField label="Opposite Party">
          <Input placeholder="Name of opposing party" />
        </FormField>

        <FormField label="Opposing Counsel">
          <Input placeholder="Advocate name" />
        </FormField>
      </div>

      <div className="flex justify-end gap-3 border-t border-divider pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={assignedLawyerIds.length === 0}>
          Create Case
        </Button>
      </div>
    </form>
  );
}
