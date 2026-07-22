"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { CreateClientInput } from "@/lib/store/domainStore";
import { emailError, phoneError } from "@/lib/utils/validateContact";
import type { ClientType } from "@/types/client";
import { useState } from "react";

interface NewClientFormProps {
  onSubmit: (input: CreateClientInput) => void;
  onCancel: () => void;
}

export function NewClientForm({ onSubmit, onCancel }: NewClientFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ClientType>("Individual");
  const [nid, setNid] = useState("");
  const [passport, setPassport] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [address, setAddress] = useState("");
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
    return !nextEmail && !nextPhone && name.trim().length > 0 && coiChecked;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTriedSubmit(true);
    if (!validate()) return;
    onSubmit({
      name,
      type,
      email,
      phone,
      address,
      nid,
      passport,
      registrationNo,
      referralSource,
      conflictChecked: coiChecked,
    });
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
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Client name"
              />
            </FormField>
            <FormField label="Client Type" required>
              <Select
                required
                value={type}
                onChange={(e) => setType(e.target.value as ClientType)}
              >
                <option value="Individual">Individual</option>
                <option value="Corporate">Corporate</option>
                <option value="NGO">NGO</option>
              </Select>
            </FormField>
            <FormField label="NID Number">
              <Input
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                placeholder="1234567890123"
              />
            </FormField>
            <FormField label="Passport Number">
              <Input
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                placeholder="Optional for individuals"
              />
            </FormField>
            <FormField label="Registration No.">
              <Input
                value={registrationNo}
                onChange={(e) => setRegistrationNo(e.target.value)}
                placeholder="For corporate / NGO"
              />
            </FormField>
            <FormField label="Referral Source">
              <Input
                value={referralSource}
                onChange={(e) => setReferralSource(e.target.value)}
                placeholder="How did they find the firm?"
              />
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
                <Textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Full address"
                />
              </FormField>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-text-primary">Conflict of Interest Check</p>
          <p className="mt-0.5 text-xs text-text-muted">
            Confirm conflict check against existing clients and opposing parties.
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
        <Button type="submit" disabled={!coiChecked || !name.trim()}>
          Register Client
        </Button>
      </div>
    </form>
  );
}
