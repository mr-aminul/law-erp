"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { mockStaff } from "@/lib/mock";
import { emailError, phoneError } from "@/lib/utils/validateContact";
import type { EmployeeType, StaffRole, StaffStatus } from "@/types/staff";
import { useState } from "react";

export const STAFF_DESIGNATIONS: StaffRole[] = [
  "Partner",
  "Advocate",
  "Associate",
  "Junior Associate",
  "Paralegal",
  "Clerk",
  "Admin",
];

export const STAFF_EMPLOYEE_TYPES: EmployeeType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
  "Consultant",
];

export const STAFF_DEPARTMENTS = [
  "Litigation",
  "Corporate",
  "Operations",
  "Administration",
] as const;

interface NewEmployeeFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewEmployeeForm({ onSubmit, onCancel }: NewEmployeeFormProps) {
  const [designation, setDesignation] = useState<StaffRole>("Associate");
  const [employeeType, setEmployeeType] = useState<EmployeeType>("Full-time");
  const [status, setStatus] = useState<StaffStatus>("Active");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const managers = mockStaff.filter((s) => s.role !== "Admin");

  function validate() {
    const nextEmail = emailError(email);
    const nextPhone = phoneError(phone);
    setEmailErr(nextEmail);
    setPhoneErr(nextPhone);
    return !nextEmail && !nextPhone;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTriedSubmit(true);
    if (!validate()) return;
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-1">
        <div>
          <p className="text-sm font-bold text-text-primary">Employee details</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Add a new team member to the firm directory.
          </p>
          <div className="mt-3 grid-fields-2">
            <FormField label="Full Name" required>
              <Input required placeholder="e.g. Adv. Sara Ahmed" />
            </FormField>
            <FormField label="Employee ID">
              <Input placeholder="Auto e.g. EMP-005" />
            </FormField>
            <FormField label="Designation" required>
              <Select
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value as StaffRole)}
              >
                {STAFF_DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Employee Type" required>
              <Select
                required
                value={employeeType}
                onChange={(e) => setEmployeeType(e.target.value as EmployeeType)}
              >
                {STAFF_EMPLOYEE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Department" required>
              <Select required defaultValue="Litigation">
                {STAFF_DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Line Manager">
              <Select defaultValue="">
                <option value="">None</option>
                {managers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Status" required>
              <Select
                required
                value={status}
                onChange={(e) => setStatus(e.target.value as StaffStatus)}
              >
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </FormField>
            <FormField label="Email" error={triedSubmit || emailErr ? emailErr : null}>
              <Input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (triedSubmit || emailErr) setEmailErr(emailError(e.target.value));
                }}
                onBlur={() => setEmailErr(emailError(email))}
                placeholder="name@ukil.ai"
                aria-invalid={Boolean(emailErr) || undefined}
              />
            </FormField>
            <FormField label="Phone" error={triedSubmit || phoneErr ? phoneErr : null}>
              <Input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (triedSubmit || phoneErr) setPhoneErr(phoneError(e.target.value));
                }}
                onBlur={() => setPhoneErr(phoneError(phone))}
                placeholder="+880 1XXX-XXXXXX"
                aria-invalid={Boolean(phoneErr) || undefined}
              />
            </FormField>
            <FormField label="Join Date" required>
              <Input required type="date" />
            </FormField>
            <FormField label="Bar Council No.">
              <Input placeholder="For advocates" />
            </FormField>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Employee</Button>
      </div>
    </form>
  );
}
