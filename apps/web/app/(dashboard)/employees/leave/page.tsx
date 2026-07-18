"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import { mockLeaveRequests, mockStaff } from "@/lib/mock";
import { formatDate } from "@/lib/utils/formatDate";
import type { LeaveRequest, LeaveType } from "@/types/staff";
import { Plus } from "lucide-react";
import { useState } from "react";

const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Casual", "Maternity"];

export default function LeavePage() {
  const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [requestOpen, setRequestOpen] = useState(false);
  const [staffId, setStaffId] = useState(mockStaff[0]?.id ?? "");
  const [type, setType] = useState<LeaveType>("Annual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  function setStatus(id: string, status: LeaveRequest["status"]) {
    setRequests((prev) =>
      prev.map((lr) => (lr.id === id ? { ...lr, status } : lr))
    );
  }

  function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    const staff = mockStaff.find((s) => s.id === staffId);
    if (!staff || !from || !to) return;
    setRequests((prev) => [
      {
        id: `lr-${Date.now()}`,
        staffId: staff.id,
        staffName: staff.name,
        type,
        from,
        to,
        status: "Pending",
        reason: reason.trim() || "—",
      },
      ...prev,
    ]);
    setRequestOpen(false);
    setReason("");
    setFrom("");
    setTo("");
  }

  return (
    <div className="space-y-4">
      <PageSection
        title="Leave Management"
        description="Track leave requests and approvals for the firm."
        action={
          <Button type="button" size="sm" onClick={() => setRequestOpen(true)}>
            <Plus className="h-4 w-4" />
            Request Leave
          </Button>
        }
      >
        {requests.length === 0 ? (
          <EmptyState
            title="No leave requests"
            description="Submit a leave request to get started."
            action={
              <Button type="button" onClick={() => setRequestOpen(true)}>
                <Plus className="h-4 w-4" />
                Request Leave
              </Button>
            }
          />
        ) : (
          <div className="space-y-2">
            {requests.map((lr) => (
              <div
                key={lr.id}
                className="flex flex-col gap-3 rounded-card border border-gray-200 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-semibold">{lr.staffName}</p>
                  <p className="text-xs text-text-muted">
                    {lr.type} leave · {formatDate(lr.from)} — {formatDate(lr.to)}
                  </p>
                  <p className="mt-1 text-xs text-text-sec">{lr.reason}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      lr.status === "Approved"
                        ? "green"
                        : lr.status === "Rejected"
                          ? "red"
                          : "amber"
                    }
                  >
                    {lr.status}
                  </Badge>
                  {lr.status === "Pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setStatus(lr.id, "Approved")}
                        className="rounded-badge bg-green-light px-2 py-1 text-xs font-semibold text-green"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatus(lr.id, "Rejected")}
                        className="rounded-badge bg-red-light px-2 py-1 text-xs font-semibold text-red"
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        )}
      </PageSection>

      <Modal
        open={requestOpen}
        onClose={() => setRequestOpen(false)}
        title="Request Leave"
        className="max-w-lg"
      >
        <form onSubmit={handleSubmitRequest} className="space-y-4">
          <div className="grid-fields-2">
            <FormField label="Employee" required>
              <Select
                required
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
              >
                {mockStaff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="Leave Type" required>
              <Select
                required
                value={type}
                onChange={(e) => setType(e.target.value as LeaveType)}
              >
                {LEAVE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField label="From" required>
              <Input
                required
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              />
            </FormField>
            <FormField label="To" required>
              <Input
                required
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              />
            </FormField>
            <div className="col-span-2">
              <FormField label="Reason">
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Optional note"
                />
              </FormField>
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setRequestOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Submit Request</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
