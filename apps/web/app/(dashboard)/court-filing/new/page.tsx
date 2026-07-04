"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { PageSection } from "@/components/ui/PageSection";
import { courtFilingSubNav } from "@/lib/config/navigation";
import { mockCases } from "@/lib/mock";
import { useRouter } from "next/navigation";

export default function NewFilingPage() {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); router.push("/court-filing"); }}
      className="mx-auto max-w-xl space-y-4"
    >
      <SubNav items={courtFilingSubNav} />
      <PageSection title="Log Court Filing">
        <div className="grid gap-4">
          <FormField label="Case" required>
            <Select required defaultValue="">
              <option value="" disabled>Select case</option>
              {mockCases.map((c) => (
                <option key={c.id} value={c.id}>{c.caseId} — {c.matter}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Court" required><Input required /></FormField>
          <FormField label="Filing Type" required>
            <Select required defaultValue="Writ Petition">
              {["Writ Petition", "Plaint", "Appeal", "Review", "Misc. Application"].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Submission Date" required><Input type="date" required /></FormField>
          <FormField label="Cause List Reference"><Input placeholder="CL-YYYY-MM-DD-..." /></FormField>
          <FormField label="Process Server"><Input placeholder="Assigned process server" /></FormField>
          <FormField label="Filing Fee (BDT)"><Input type="number" placeholder="2500" /></FormField>
        </div>
      </PageSection>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        <Button type="submit">Submit Filing</Button>
      </div>
    </form>
  );
}
