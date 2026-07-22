"use client";

import { Badge } from "@/components/ui/Badge";
import { PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockSystemUsers } from "@/lib/mock";

const permissions = ["Cases", "Clients", "Billing", "Documents", "Employees", "Settings", "Reports"];

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
      <PageSection
        title="Role-Based Access Control"
        description={`${mockSystemUsers.length} active users across ${roles.length} roles.`}
      >
        <Table>
          <TableHeader>
            <TableHead>Role</TableHead>
            {permissions.map((p) => (
              <TableHead key={p} className="text-center">{p}</TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {roles.map((role) => (
              <TableRow key={role}>
                <TableCell className="font-semibold">{role}</TableCell>
                {roleMatrix[role].map((allowed, i) => (
                  <TableCell key={permissions[i]} className="text-center">
                    <Badge variant={allowed ? "green" : "muted"}>
                      {allowed ? "Allowed" : "No access"}
                    </Badge>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
