"use client";

import { SubNav } from "@/components/layout/SubNav";
import { PageSection } from "@/components/ui/PageSection";
import { settingsSubNav } from "@/lib/config/navigation";
import { mockSystemUsers } from "@/lib/mock";

const permissions = ["Cases", "Clients", "Billing", "Documents", "Staff", "Settings", "Reports"];

const roleMatrix: Record<string, boolean[]> = {
  "Managing Partner": [true, true, true, true, true, true, true],
  Partner: [true, true, true, true, true, false, true],
  Associate: [true, true, false, true, false, false, false],
  Paralegal: [true, false, false, true, false, false, false],
  Clerk: [false, true, false, false, false, false, false],
  Admin: [false, false, true, false, true, true, true],
};

export default function RolesPage() {
  const roles = Object.keys(roleMatrix);

  return (
    <div className="space-y-4">
      <SubNav items={settingsSubNav} />
      <PageSection title="Role-Based Access Control">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-divider text-left text-xs text-text-muted">
                <th className="py-2 pr-4">Role</th>
                {permissions.map((p) => (
                  <th key={p} className="px-2 py-2 text-center">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {roles.map((role) => (
                <tr key={role} className="border-b border-divider/60">
                  <td className="py-2 pr-4 font-semibold">{role}</td>
                  {roleMatrix[role].map((allowed, i) => (
                    <td key={permissions[i]} className="px-2 py-2 text-center">
                      {allowed ? (
                        <span className="text-green">✓</span>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-text-muted">
          {mockSystemUsers.length} active users. Changes apply immediately on save.
        </p>
      </PageSection>
    </div>
  );
}
