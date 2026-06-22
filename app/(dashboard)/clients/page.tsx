"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { Input } from "@/components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockClients } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Plus, Search, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function ClientsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = useMemo(() => {
    return mockClients.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.clientId.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || c.type === typeFilter;
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      return matchSearch && matchType && matchStatus;
    });
  }, [search, typeFilter, statusFilter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Link href="/clients/new">
          <Button>
            <Plus className="mr-1.5 h-4 w-4" />
            New Client
          </Button>
        </Link>
      </div>

      <div className="flex gap-3">
        <Dropdown
          label="Type"
          options={[
            { value: "all", label: "All Types" },
            { value: "Individual", label: "Individual" },
            { value: "Corporate", label: "Corporate" },
            { value: "NGO", label: "NGO" },
          ]}
          value={typeFilter}
          onChange={setTypeFilter}
        />
        <Dropdown
          label="Status"
          options={[
            { value: "all", label: "All" },
            { value: "Active", label: "Active" },
            { value: "Inactive", label: "Inactive" },
          ]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
      </div>

      <div className="rounded-card border border-divider/70 bg-white p-4 shadow-sm">
        <Table>
          <TableHeader>
            <TableHead>Client ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Active Cases</TableHead>
            <TableHead>Total Billed</TableHead>
            <TableHead>COI</TableHead>
            <TableHead>Status</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} onClick={() => router.push(`/clients/${c.id}`)}>
                <TableCell className="font-semibold">{c.clientId}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell className="text-text-sec">{c.type}</TableCell>
                <TableCell>{c.activeCases}</TableCell>
                <TableCell>{formatCurrency(c.totalBilled)}</TableCell>
                <TableCell>
                  {c.conflictChecked ? (
                    <span className="inline-flex items-center gap-1 text-xs text-green">
                      <ShieldCheck className="h-3.5 w-3.5" /> Cleared
                    </span>
                  ) : (
                    <Badge variant="amber">Pending</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={c.status === "Active" ? "green" : "muted"}>
                    {c.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
