"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { PageSection } from "@/components/ui/PageSection";
import { mockClients, mockStaff } from "@/lib/mock";
import { useRouter } from "next/navigation";

export default function NewCasePage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.push("/cases/1");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-4">
      <PageSection title="New Case" description="Create a matter with court assignment and lawyer allocation.">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Client" required>
            <Select required defaultValue="">
              <option value="" disabled>Select client</option>
              {mockClients.filter((c) => c.status === "Active").map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Case Type" required>
            <Select required defaultValue="Civil">
              {["Civil", "Criminal", "Family", "Corporate", "Labour", "Property"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Court Level" required>
            <Select required defaultValue="District Court">
              {["Supreme Court", "High Court Division", "District Court", "Tribunal"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
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
          <FormField label="Limitation / Filing Deadline">
            <Input type="date" />
          </FormField>
          <FormField label="Status">
            <Select defaultValue="New">
              {["New", "In-Progress", "Pending", "On-Hold"].map((s) => (
                <option key={s} value={s}>{s}</option>
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
              <Select required multiple className="h-24">
                {mockStaff.filter((s) => s.role !== "Admin").map((s) => (
                  <option key={s.id} value={s.name}>{s.name} — {s.role}</option>
                ))}
              </Select>
            </FormField>
          </div>
          <FormField label="Opposite Party">
            <Input placeholder="Name of opposing party" />
          </FormField>
          <FormField label="Opposing Counsel">
            <Input placeholder="Advocate name" />
          </FormField>
        </div>
      </PageSection>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">Create Case</Button>
      </div>
    </form>
  );
}
