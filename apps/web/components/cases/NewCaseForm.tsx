"use client";

import { NewClientForm } from "@/components/clients/NewClientForm";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { UserChip } from "@/components/ui/UserChip";
import { mockStaff } from "@/lib/mock";
import {
  type CreateCaseInput,
  type CreateClientInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import { CASE_STATUSES } from "@/lib/utils/caseStatus";
import type { CaseStatus, CaseType } from "@/types/case";
import type { CourtLevel } from "@/types/hearing";
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
  onSubmit: (input: CreateCaseInput) => void;
  onCancel: () => void;
  defaultClientId?: string;
}

export function NewCaseForm({
  onSubmit,
  onCancel,
  defaultClientId = "",
}: NewCaseFormProps) {
  const clients = useDomainStore((s) => s.clients);
  const createClient = useDomainStore((s) => s.createClient);

  const [clientSelection, setClientSelection] = useState(defaultClientId);
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [typeSelection, setTypeSelection] = useState("Civil");
  const [customType, setCustomType] = useState("");
  const [matter, setMatter] = useState("");
  const [description, setDescription] = useState("");
  const [court, setCourt] = useState<CourtLevel>("District Court");
  const [courtName, setCourtName] = useState("");
  const [caseNumber, setCaseNumber] = useState("");
  const [nextHearing, setNextHearing] = useState("");
  const [limitationDate, setLimitationDate] = useState("");
  const [status, setStatus] = useState<CaseStatus>("Pending");
  const [opposingParty, setOpposingParty] = useState("");
  const [opposingCounsel, setOpposingCounsel] = useState("");
  const [assignedLawyerIds, setAssignedLawyerIds] = useState<string[]>([]);

  const lawyers = mockStaff.filter((s) => s.role !== "Admin");
  const activeClients = clients.filter((c) => c.status === "Active");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientSelection || !matter.trim() || assignedLawyerIds.length === 0) return;
    onSubmit({
      matter,
      clientId: clientSelection,
      type: typeSelection === CREATE_TYPE_VALUE ? customType.trim() || "Civil" : typeSelection,
      court,
      courtName,
      caseNumber,
      description,
      status,
      assignedLawyers: assignedLawyerIds
        .map((id) => lawyers.find((l) => l.id === id)?.name)
        .filter((name): name is string => Boolean(name)),
      opposingParty: opposingParty.trim()
        ? { name: opposingParty, counsel: opposingCounsel }
        : undefined,
      nextHearing: nextHearing || undefined,
      limitationDate: limitationDate || undefined,
    });
  }

  function handleClientChange(value: string) {
    if (value === CREATE_CLIENT_VALUE) {
      setNewClientOpen(true);
      return;
    }
    setClientSelection(value);
  }

  function handleClientCreated(input: CreateClientInput) {
    const created = createClient(input);
    setNewClientOpen(false);
    setClientSelection(created.id);
  }

  function handleTypeChange(value: string) {
    setTypeSelection(value);
    if (value !== CREATE_TYPE_VALUE) setCustomType("");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid-fields-2 max-h-[60vh] overflow-y-auto pr-1">
          <FormField label="Client" required>
            <Select
              required
              value={clientSelection}
              onChange={(e) => handleClientChange(e.target.value)}
            >
              <option value="" disabled>
                Select client
              </option>
              {activeClients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
              <option value={CREATE_CLIENT_VALUE}>+ Create new client</option>
            </Select>
          </FormField>

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

          <div className="col-span-2">
            <FormField label="Title" required>
              <Input
                required
                value={matter}
                onChange={(e) => setMatter(e.target.value)}
                placeholder="e.g. Land dispute — Gulshan Block C"
              />
            </FormField>
          </div>

          <div className="col-span-2">
            <FormField label="Description">
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional details about the case"
              />
            </FormField>
          </div>

          <FormField label="Court Level" required>
            <Select
              required
              value={court}
              onChange={(e) => setCourt(e.target.value as CourtLevel)}
            >
              {(["Supreme Court", "High Court Division", "District Court", "Tribunal"] as const).map(
                (c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                )
              )}
            </Select>
          </FormField>

          <FormField label="Court Name" required>
            <Input
              required
              value={courtName}
              onChange={(e) => setCourtName(e.target.value)}
              placeholder="e.g. 1st Court of Joint District Judge, Dhaka"
            />
          </FormField>

          <FormField label="Case Number">
            <Input
              value={caseNumber}
              onChange={(e) => setCaseNumber(e.target.value)}
              placeholder="Court-assigned number"
            />
          </FormField>

          <FormField label="First Hearing Date">
            <Input
              type="date"
              value={nextHearing}
              onChange={(e) => setNextHearing(e.target.value)}
            />
          </FormField>

          <FormField label="Deadline">
            <Input
              type="date"
              value={limitationDate}
              onChange={(e) => setLimitationDate(e.target.value)}
            />
          </FormField>

          <FormField label="Status">
            <Select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
            >
              {CASE_STATUSES.filter((s) => s !== "Completed").map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </FormField>

          <div className="col-span-2">
            <FormField label="Assign Lawyers" required>
              <div className="flex flex-wrap items-center gap-2">
                {assignedLawyerIds.map((id) => {
                  const lawyer = lawyers.find((s) => s.id === id);
                  if (!lawyer) return null;
                  return (
                    <UserChip
                      key={id}
                      name={lawyer.name}
                      initials={lawyer.initials}
                      onRemove={() =>
                        setAssignedLawyerIds((prev) =>
                          prev.filter((lawyerId) => lawyerId !== id)
                        )
                      }
                    />
                  );
                })}
                <MultiSelectDropdown
                  variant="chip"
                  searchable
                  searchPlaceholder="Search lawyers…"
                  placeholder="Assignee"
                  options={lawyers.map((s) => ({
                    value: s.id,
                    label: s.name,
                    initials: s.initials,
                    description: s.email ? `${s.role} · ${s.email}` : s.role,
                  }))}
                  value={assignedLawyerIds}
                  onChange={setAssignedLawyerIds}
                />
              </div>
              {assignedLawyerIds.length === 0 ? (
                <p className="mt-1.5 text-xs text-text-muted">
                  Select at least one lawyer
                </p>
              ) : null}
            </FormField>
          </div>

          <FormField label="Opposite Party">
            <Input
              value={opposingParty}
              onChange={(e) => setOpposingParty(e.target.value)}
              placeholder="Name of opposing party"
            />
          </FormField>

          <FormField label="Opposing Counsel">
            <Input
              value={opposingCounsel}
              onChange={(e) => setOpposingCounsel(e.target.value)}
              placeholder="Advocate name"
            />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={assignedLawyerIds.length === 0}>
            Create Case
          </Button>
        </div>
      </form>

      <Modal
        open={newClientOpen}
        onClose={() => setNewClientOpen(false)}
        title="New Client"
        className="max-w-2xl"
        layer={1}
      >
        <NewClientForm
          onSubmit={handleClientCreated}
          onCancel={() => setNewClientOpen(false)}
        />
      </Modal>
    </>
  );
}
