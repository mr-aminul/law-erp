"use client";

import { Button } from "@/components/ui/Button";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import type { DocumentCategory, DocumentLanguage } from "@/types/document";

const CATEGORIES: DocumentCategory[] = [
  "Writ Petition",
  "Plaint",
  "Affidavit",
  "Vakalatnama",
  "Legal Notice",
  "MOA",
  "Other",
];

const LANGUAGES: DocumentLanguage[] = ["English", "Bangla", "Bilingual"];

interface UploadDocumentFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

export function UploadDocumentForm({ onSubmit, onCancel }: UploadDocumentFormProps) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Document Name" required>
        <Input required placeholder="e.g. Writ petition draft v2" />
      </FormField>

      <FormField label="Category" required>
        <Select required defaultValue="Other">
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Language" required>
        <Select required defaultValue="English">
          {LANGUAGES.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="File" required>
        <Input required type="file" accept=".pdf,.doc,.docx,.jpg,.png" />
      </FormField>

      <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Upload</Button>
      </div>
    </form>
  );
}
