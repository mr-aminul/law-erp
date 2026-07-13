"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { DetailField, PageSection } from "@/components/ui/PageSection";
import { settingsSubNav } from "@/lib/config/navigation";
import { mockFirmProfile, mockSystemUsers } from "@/lib/mock";
import { emailError, phoneError } from "@/lib/utils/validateContact";
import { Download } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const firm = mockFirmProfile;
  const [phone, setPhone] = useState(firm.phone);
  const [email, setEmail] = useState(firm.email);
  const [phoneErr, setPhoneErr] = useState<string | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    const nextEmail = emailError(email);
    const nextPhone = phoneError(phone);
    setEmailErr(nextEmail);
    setPhoneErr(nextPhone);
    if (nextEmail || nextPhone) {
      setSaved(false);
      return;
    }
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <SubNav items={settingsSubNav} />

      <PageSection title="Firm Profile" description="Bar Council registration, address, and branch offices.">
        <div className="grid-pair">
          <FormField label="Firm Name"><Input defaultValue={firm.name} /></FormField>
          <FormField label="Bar Council Reg."><Input defaultValue={firm.barCouncilReg} /></FormField>
          <FormField label="Phone" error={phoneErr}>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setSaved(false);
                if (phoneErr) setPhoneErr(phoneError(e.target.value));
              }}
              onBlur={() => setPhoneErr(phoneError(phone))}
              aria-invalid={Boolean(phoneErr) || undefined}
            />
          </FormField>
          <FormField label="Email" error={emailErr}>
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setSaved(false);
                if (emailErr) setEmailErr(emailError(e.target.value));
              }}
              onBlur={() => setEmailErr(emailError(email))}
              aria-invalid={Boolean(emailErr) || undefined}
            />
          </FormField>
          <div className="col-span-2">
            <FormField label="Address"><Input defaultValue={firm.address} /></FormField>
          </div>
          <DetailField label="Branches" value={firm.branches.join(", ")} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button size="sm" type="button" onClick={handleSave}>
            Save Changes
          </Button>
          {saved ? (
            <p className="text-xs text-green">Saved</p>
          ) : null}
        </div>
      </PageSection>

      <PageSection title="Users" description="Managing Partner → Associate → Clerk role hierarchy.">
        <div className="space-y-2">
          {mockSystemUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-card border border-gray-200 px-3 py-2">
              <div>
                <p className="text-sm font-semibold">{u.name}</p>
                <p className="text-xs text-text-muted">{u.email}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="blue">{u.role}</Badge>
                <Badge variant={u.status === "Active" ? "green" : "muted"}>{u.status}</Badge>
              </div>
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection title="Data Backup & Export">
        <div className="flex gap-3">
          <Button variant="secondary" size="sm"><Download className="mr-1.5 h-4 w-4" />Export All Data (CSV)</Button>
          <Button variant="secondary" size="sm"><Download className="mr-1.5 h-4 w-4" />Backup (PDF)</Button>
        </div>
      </PageSection>
    </div>
  );
}
