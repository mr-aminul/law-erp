"use client";

import { SubNav } from "@/components/layout/SubNav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { courtFilingSubNav } from "@/lib/config/navigation";
import { mockFilings } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import Link from "next/link";
import { useRouter } from "next/navigation";

const statusVariant = (s: string) =>
  s === "Accepted" ? "green" : s === "Rejected" ? "red" : s === "Submitted" ? "blue" : "muted";

export default function CourtFilingPage() {
  const router = useRouter();

  return (
    <div className="space-y-4">
      <SubNav items={courtFilingSubNav} />
      <ListToolbar
        actions={
          <Link href="/court-filing/new">
            <Button>Log New Filing</Button>
          </Link>
        }
      />
      <PageSection title="Filing Registry" description="Submission log with cause list refs, process server, and summons tracking.">
        <Table compact>
          <TableHeader>
            <TableHead>Ref</TableHead>
            <TableHead>Case</TableHead>
            <TableHead>Court</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Filed By</TableHead>
            <TableHead>Fee</TableHead>
            <TableHead>Summons</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {mockFilings.map((f) => (
              <TableRow key={f.id} onClick={() => router.push(`/cases/${f.caseId}`)}>
                <TableCell className="font-semibold">{f.filingRef}</TableCell>
                <TableCell className="max-w-[160px] truncate">{f.caseName}</TableCell>
                <TableCell className="text-text-sec">{f.court}</TableCell>
                <TableCell>{f.filingType}</TableCell>
                <TableCell>{f.filedBy}</TableCell>
                <TableCell>{formatCurrency(f.filingFee)}</TableCell>
                <TableCell>{f.summonsDispatched ? "Sent" : "—"}</TableCell>
                <TableCell><Badge variant={statusVariant(f.status)}>{f.status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </PageSection>
    </div>
  );
}
