"use client";

import { NewClientForm } from "@/components/clients/NewClientForm";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { MultiSelectDropdown } from "@/components/ui/MultiSelectDropdown";
import { UserChip } from "@/components/ui/UserChip";
import { mockClients, mockStaff } from "@/lib/mock";
import { CASE_STATUSES } from "@/lib/utils/caseStatus";
import { SERVICE_TYPES, type ServiceType } from "@/types/service";
import { useState } from "react";

const CREATE_CLIENT_VALUE = "__create_client__";
const CREATE_TYPE_VALUE = "__create_type__";

interface NewServiceFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewServiceForm({ onSubmit, onCancel }: NewServiceFormProps) {
  const [clientSelection, setClientSelection] = useState("");
  const [newClientOpen, setNewClientOpen] = useState(false);
  const [typeSelection, setTypeSelection] = useState<string>("Legal opinions");
  const [customType, setCustomType] = useState("");
  const [assignedLawyerIds, setAssignedLawyerIds] = useState<string[]>([]);

  const lawyers = mockStaff.filter((s) => s.role !== "Admin");
  const activeClients = mockClients.filter((c) => c.status === "Active");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  function handleClientChange(value: string) {
    if (value === CREATE_CLIENT_VALUE) {
      setNewClientOpen(true);
      return;
    }
    setClientSelection(value);
  }

  function handleClientCreated() {
    setNewClientOpen(false);
    const created = activeClients[0];
    if (created) setClientSelection(created.id);
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

          <FormField label="Service Type" required>
            <Select
              required={typeSelection !== CREATE_TYPE_VALUE}
              value={typeSelection}
              onChange={(e) => handleTypeChange(e.target.value)}
            >
              {SERVICE_TYPES.map((t: ServiceType) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
              <option value={CREATE_TYPE_VALUE}>+ Create new type</option>
            </Select>
          </FormField>

          {typeSelection === CREATE_TYPE_VALUE && (
            <FormField label="New Service Type" required>
              <Input
                required
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                placeholder="e.g. Trademark filing"
              />
            </FormField>
          )}

          <div className="col-span-2">
            <FormField label="Title" required>
              <Input required placeholder="e.g. Legal opinion — land acquisition risk" />
            </FormField>
          </div>

          <div className="col-span-2">
            <FormField label="Description">
              <Textarea placeholder="Optional details about the service" />
            </FormField>
          </div>

          <FormField label="Due Date">
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
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={assignedLawyerIds.length === 0}>
            Create Service
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
