"use client";

import { NewClientForm } from "@/components/clients/NewClientForm";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { Modal } from "@/components/ui/Modal";
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
import { Plus, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";

function ClientsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [newClientOpen, setNewClientOpen] = useState(false);

  useEffect(() => {
    setNewClientOpen(searchParams.get("new") === "1");
  }, [searchParams]);

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

  function openNewClientModal() {
    setNewClientOpen(true);
    if (searchParams.get("new") !== "1") {
      router.replace("/clients?new=1", { scroll: false });
    }
  }

  function closeNewClientModal() {
    setNewClientOpen(false);
    if (searchParams.get("new")) {
      router.replace("/clients");
    }
  }

  function handleCreateClient() {
    closeNewClientModal();
    router.push("/clients/1");
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={
          (typeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)
        }
        onClearFilters={() => {
          setTypeFilter("all");
          setStatusFilter("all");
        }}
        filters={
          <>
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
          </>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search clients...",
        }}
        actions={
          <Button type="button" onClick={openNewClientModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            New Client
          </Button>
        }
      />

      <div className="overflow-hidden rounded-card border border-divider/70 bg-surface shadow-sm">
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

      <Modal
        open={newClientOpen}
        onClose={closeNewClientModal}
        title="New Client"
        className="max-w-2xl"
      >
        <NewClientForm onSubmit={handleCreateClient} onCancel={closeNewClientModal} />
      </Modal>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense fallback={null}>
      <ClientsContent />
    </Suspense>
  );
}
