"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { emailError, phoneError } from "@/lib/utils/validateContact";
import { useState } from "react";

interface NewClientFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function NewClientForm({ onSubmit, onCancel }: NewClientFormProps) {
  const [coiChecked, setCoiChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [triedSubmit, setTriedSubmit] = useState(false);

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
          <p className="text-sm font-bold text-text-primary">Client Registration</p>
          <p className="mt-0.5 text-xs text-text-muted">
            NID/passport verification and conflict of interest check required before
            onboarding.
          </p>
          <div className="mt-3 grid-fields-2">
            <FormField label="Full Name / Organization" required>
              <Input required placeholder="Client name" />
            </FormField>
            <FormField label="Client Type" required>
              <Select required defaultValue="Individual">
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="NGO">NGO</option>
              </Select>
            </FormField>
            <FormField label="NID Number">
              <Input placeholder="1234567890123" />
            </FormField>
            <FormField label="Passport Number">
              <Input placeholder="Optional for individuals" />
            </FormField>
            <FormField label="Registration No.">
              <Input placeholder="For corporate / NGO" />
            </FormField>
            <FormField label="Referral Source">
              <Input placeholder="How did they find the firm?" />
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
                placeholder="client@email.com"
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
            <div className="col-span-2">
              <FormField label="Address">
                <Textarea placeholder="Full address" />
              </FormField>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-text-primary">Conflict of Interest Check</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Run conflict check against existing clients and opposing parties.
          </p>
          <label className="mt-3 flex items-start gap-3 rounded-card border border-gray-200 bg-cream-card p-4">
            <input
              type="checkbox"
              checked={coiChecked}
              onChange={(e) => setCoiChecked(e.target.checked)}
              className="mt-1"
              required
            />
            <div>
              <p className="text-sm font-semibold text-text-primary">
                I confirm conflict of interest check is complete
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                No conflicts found with existing firm clients or active matters.
              </p>
            </div>
          </label>
          {coiChecked && (
            <Badge variant="green" className="mt-3">
              COI Cleared
            </Badge>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!coiChecked}>
          Register Client
        </Button>
      </div>
    </form>
  );
}
