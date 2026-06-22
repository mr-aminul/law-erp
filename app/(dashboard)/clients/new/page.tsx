"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { PageSection } from "@/components/ui/PageSection";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewClientPage() {
  const router = useRouter();
  const [coiChecked, setCoiChecked] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/clients/1");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
      <PageSection title="Client Registration" description="NID/passport verification and conflict of interest check required before onboarding.">
        <div className="grid grid-cols-2 gap-4">
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
          <FormField label="Email">
            <Input type="email" placeholder="client@email.com" />
          </FormField>
          <FormField label="Phone">
            <Input placeholder="+880 1XXX-XXXXXX" />
          </FormField>
          <div className="col-span-2">
            <FormField label="Address">
              <Textarea placeholder="Full address" />
            </FormField>
          </div>
        </div>
      </PageSection>

      <PageSection title="Conflict of Interest Check" description="Run conflict check against existing clients and opposing parties.">
        <label className="flex items-start gap-3 rounded-card border border-divider bg-cream-card p-4">
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
        {coiChecked && <Badge variant="green" className="mt-3">COI Cleared</Badge>}
      </PageSection>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={!coiChecked}>
          Register Client
        </Button>
      </div>
    </form>
  );
}
