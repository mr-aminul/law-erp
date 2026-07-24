"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { FormField, Select, Textarea } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { EmptyState, PageSection } from "@/components/ui/PageSection";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { mockStaff } from "@/lib/mock";
import { useStaffHrStore } from "@/lib/store/staffHrStore";
import { formatDate } from "@/lib/utils/formatDate";
import type { LeaveType } from "@/types/staff";
import { Plus } from "lucide-react";
import { useState } from "react";

const LEAVE_TYPES: LeaveType[] = ["Annual", "Sick", "Casual", "Maternity"];

export function LeaveRequestsPanel() {
  const requests = useStaffHrStore((s) => s.leaveRequests);
  const addLeaveRequest = useStaffHrStore((s) => s.addLeaveRequest);
  const setLeaveStatus = useStaffHrStore((s) => s.setLeaveStatus);
  const [requestOpen, setRequestOpen] = useState(false);
  const [staffId, setStaffId] = useState(mockStaff[0]?.id ?? "");
  const [type, setType] = useState<LeaveType>("Annual");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [reason, setReason] = useState("");

  function handleSubmitRequest(e: React.FormEvent) {
    e.preventDefault();
    const staff = mockStaff.find((s) => s.id === staffId);
    if (!staff || !from || !to) return;
    addLeaveRequest({
      staffId: staff.id,
      staffName: staff.name,
      type,
      from,
      to,
      reason: reason.trim() || "—",
    });
    setRequestOpen(false);
    setReason("");
    setFrom("");
    setTo("");
  }

  const requestButton = (
    <Button type="button" onClick={() => setRequestOpen(true)}>
      <Plus className="mr-1.5 h-4 w-4" />
      Request Leave
    </Button>
  );

  return (
    <>
      <PageSection
        title="Leave Requests"
        description="Approved leave marks those days as Leave on attendance automatically."
        action={requestButton}
      >
        {requests.length === 0 ? (
          <EmptyState
            title="No leave requests"
            description="Submit a leave request to get started."
            action={requestButton}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead />
              </TableHeader>
              <TableBody>
                {requests.map((lr) => (
                  <TableRow key={lr.id}>
                    <TableCell className="font-semibold">{lr.staffName}</TableCell>
                    <TableCell>{lr.type}</TableCell>
                    <TableCell className="text-text-sec">
                      {formatDate(lr.from)} — {formatDate(lr.to)}
                    </TableCell>
                    <TableCell className="max-w-[220px] truncate text-text-sec">
                      {lr.reason}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      {lr.status === "Pending" ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setLeaveStatus(lr.id, "Approved")}
                          >
                            Approve
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setLeaveStatus(lr.id, "Rejected")}
                          >
                            Reject
                          </Button>
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
    </>
  );
}
