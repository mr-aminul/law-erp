"use client";

import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import { FormField, Select } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { ListToolbar } from "@/components/ui/ListToolbar";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockCompensation, mockStaff } from "@/lib/mock";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import type { CompensationRecord } from "@/types/staff";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

function currentMonthLabel() {
  return new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function CompensationPage() {
  const router = useRouter();
  const [records, setRecords] = useState<CompensationRecord[]>(mockCompensation);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [paidFilter, setPaidFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [staffId, setStaffId] = useState(mockStaff[0]?.id ?? "");
  const [month, setMonth] = useState(currentMonthLabel);
  const [gross, setGross] = useState(String(mockStaff[0]?.salary ?? ""));
  const [net, setNet] = useState(String(mockStaff[0]?.salary ?? ""));
  const [paidAt, setPaidAt] = useState(todayISO);

  const monthOptions = useMemo(() => {
    const months = Array.from(new Set(records.map((r) => r.month))).sort();
    return [
      { value: "all", label: "All Months" },
      ...months.map((m) => ({ value: m, label: m })),
    ];
  }, [records]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return records.filter((r) => {
      const matchSearch =
        !q ||
        r.staffName.toLowerCase().includes(q) ||
        r.month.toLowerCase().includes(q);
      const matchMonth = monthFilter === "all" || r.month === monthFilter;
      const isPaid = Boolean(r.paidAt);
      const matchPaid =
        paidFilter === "all" ||
        (paidFilter === "paid" && isPaid) ||
        (paidFilter === "pending" && !isPaid);
      return matchSearch && matchMonth && matchPaid;
    });
  }, [records, search, monthFilter, paidFilter]);

  const activeFilterCount =
    (monthFilter !== "all" ? 1 : 0) + (paidFilter !== "all" ? 1 : 0);

  function selectStaff(id: string) {
    setStaffId(id);
    const salary = mockStaff.find((s) => s.id === id)?.salary;
    if (salary != null) {
      setGross(String(salary));
      setNet(String(salary));
    }
  }

  function openModal() {
    selectStaff(staffId || mockStaff[0]?.id || "");
    setMonth(currentMonthLabel());
    setPaidAt(todayISO());
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const staff = mockStaff.find((s) => s.id === staffId);
    const grossValue = Number(gross);
    const netValue = Number(net);
    if (!staff || !month.trim() || !(grossValue > 0) || !(netValue > 0)) return;
    setRecords((prev) => [
      {
        id: `cr-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        month: month.trim(),
        grossSalary: grossValue,
        netSalary: netValue,
        paidAt: paidAt || undefined,
      },
      ...prev,
    ]);
    setOpen(false);
  }

  return (
    <div className="space-y-4">
      <ListToolbar
        activeFilterCount={activeFilterCount}
        onClearFilters={() => {
          setMonthFilter("all");
          setPaidFilter("all");
        }}
        filters={
          <>
            <Dropdown
              label="Month"
              options={monthOptions}
              value={monthFilter}
              onChange={setMonthFilter}
            />
            <Dropdown
              label="Status"
              options={[
                { value: "all", label: "All" },
                { value: "paid", label: "Paid" },
                { value: "pending", label: "Pending" },
              ]}
              value={paidFilter}
              onChange={setPaidFilter}
            />
          </>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search employee, month…",
        }}
        actions={
          <Button type="button" onClick={openModal}>
            <Plus className="mr-1.5 h-4 w-4" />
            Record Payroll
          </Button>
        }
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="No payroll records"
          description={
            records.length === 0
              ? "Record a payroll payment to get started."
              : "Try clearing filters or searching a different term."
          }
          action={
            records.length === 0 ? (
              <Button type="button" onClick={openModal}>
                <Plus className="mr-1.5 h-4 w-4" />
                Record Payroll
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Employee</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Gross</TableHead>
            <TableHead>Net Pay</TableHead>
            <TableHead>Paid</TableHead>
          </TableHeader>
          <TableBody>
            {filtered.map((c) => (
              <TableRow key={c.id} onClick={() => router.push(`/employees/${c.staffId}`)}>
                <TableCell className="font-semibold">{c.staffName}</TableCell>
                <TableCell>{c.month}</TableCell>
                <TableCell>{formatCurrency(c.grossSalary)}</TableCell>
                <TableCell className="font-bold text-green">{formatCurrency(c.netSalary)}</TableCell>
                <TableCell className="text-text-muted">
                  {c.paidAt ? formatDate(c.paidAt) : "Pending"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Record Payroll" className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid-fields-2">
            <FormField label="Employee" required>
              <Select required value={staffId} onChange={(e) => selectStaff(e.target.value)}>
                {mockStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Month" required>
              <Input
                required
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                placeholder="e.g. June 2026"
              />
            </FormField>
            <FormField label="Gross (BDT)" required>
              <Input
                required
                type="number"
                min={1}
                step={1}
                value={gross}
                onChange={(e) => setGross(e.target.value)}
              />
            </FormField>
            <FormField label="Net Pay (BDT)" required>
              <Input
                required
                type="number"
                min={1}
                step={1}
                value={net}
                onChange={(e) => setNet(e.target.value)}
              />
            </FormField>
            <FormField label="Paid On">
              <Input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} />
            </FormField>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Payroll</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
