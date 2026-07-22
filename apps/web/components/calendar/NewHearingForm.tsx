"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  type CreateHearingInput,
  useDomainStore,
} from "@/lib/store/domainStore";
import type { HearingEventType } from "@/types/hearing";
import { useState } from "react";

interface NewHearingFormProps {
  onSubmit: (input: CreateHearingInput) => void;
  onCancel: () => void;
  defaultCaseId?: string;
  defaultDate?: string;
}

const EVENT_TYPES: HearingEventType[] = [
  "Court Hearing",
  "Filing Deadline",
  "Internal Meeting",
];

export function NewHearingForm({
  onSubmit,
  onCancel,
  defaultCaseId = "",
  defaultDate = "",
}: NewHearingFormProps) {
  const cases = useDomainStore((s) => s.cases);
  const [caseId, setCaseId] = useState(defaultCaseId);
  const [date, setDate] = useState(defaultDate || new Date().toISOString().slice(0, 10));
  const [time, setTime] = useState("10:00");
  const [type, setType] = useState<HearingEventType>("Court Hearing");
  const [causeListRef, setCauseListRef] = useState("");
  const [judge, setJudge] = useState("");
  const [bench, setBench] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!caseId || !date) return;
    onSubmit({
      caseId,
      date,
      time,
      type,
      causeListRef,
      judge,
      bench,
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
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Date" required>
            <Input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </FormField>
          <FormField label="Time" required>
            <Input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </FormField>
        </div>
        <FormField label="Event Type" required>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as HearingEventType)}
          >
            {EVENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Cause List Ref">
          <Input
            value={causeListRef}
            onChange={(e) => setCauseListRef(e.target.value)}
            placeholder="CL-..."
          />
        </FormField>
        <FormField label="Bench">
          <Input value={bench} onChange={(e) => setBench(e.target.value)} />
        </FormField>
        <FormField label="Judge">
          <Input value={judge} onChange={(e) => setJudge(e.target.value)} />
        </FormField>
      </div>
      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Hearing</Button>
      </div>
    </form>
  );
}
