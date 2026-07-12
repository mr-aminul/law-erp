"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DetailField, PageSection } from "@/components/ui/PageSection";
import { FormField } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { settingsSubNav } from "@/lib/config/navigation";
import { mockFirmProfile, mockSystemUsers } from "@/lib/mock";
import { Download } from "lucide-react";

export default function SettingsPage() {
  const firm = mockFirmProfile;

  return (
    <div className="space-y-4">
      <SubNav items={settingsSubNav} />

      <PageSection title="Firm Profile" description="Bar Council registration, address, and branch offices.">
        <div className="grid-pair">
          <FormField label="Firm Name"><Input defaultValue={firm.name} /></FormField>
          <FormField label="Bar Council Reg."><Input defaultValue={firm.barCouncilReg} /></FormField>
          <FormField label="Phone"><Input defaultValue={firm.phone} /></FormField>
          <FormField label="Email"><Input defaultValue={firm.email} /></FormField>
          <div className="col-span-2">
            <FormField label="Address"><Input defaultValue={firm.address} /></FormField>
          </div>
          <DetailField label="Branches" value={firm.branches.join(", ")} />
        </div>
        <Button size="sm" className="mt-4">Save Changes</Button>
      </PageSection>

      <PageSection title="Users" description="Managing Partner → Associate → Clerk role hierarchy.">
        <div className="space-y-2">
          {mockSystemUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between rounded-card border border-divider/60 px-3 py-2">
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
