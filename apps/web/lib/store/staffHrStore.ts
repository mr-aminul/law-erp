"use client";

import { mockAttendance, mockLeaveRequests } from "@/lib/mock";
import {
  attendanceKey,
  approvedLeaveKeys,
  effectiveAttendance,
  type AttendanceMark,
} from "@/lib/staff/attendanceLeave";
import type { LeaveRequest, LeaveType } from "@/types/staff";
import { create } from "zustand";

function buildInitialMarks(): Record<string, AttendanceMark> {
  const marks: Record<string, AttendanceMark> = {};
  for (const a of mockAttendance) {
    marks[attendanceKey(a.staffId, a.date)] = a.status;
  }
  return marks;
}

interface StaffHrState {
  marks: Record<string, AttendanceMark>;
  leaveRequests: LeaveRequest[];
  setMark: (staffId: string, date: string, status: AttendanceMark) => void;
  addLeaveRequest: (input: {
    staffId: string;
    staffName: string;
    type: LeaveType;
    from: string;
    to: string;
    reason: string;
  }) => void;
  setLeaveStatus: (id: string, status: LeaveRequest["status"]) => void;
  getStatus: (staffId: string, date: string) => AttendanceMark;
  isOnApprovedLeave: (staffId: string, date: string) => boolean;
}

export const useStaffHrStore = create<StaffHrState>((set, get) => ({
  marks: buildInitialMarks(),
  leaveRequests: mockLeaveRequests,

  setMark(staffId, date, status) {
    if (get().isOnApprovedLeave(staffId, date)) return;
    set((state) => ({
      marks: { ...state.marks, [attendanceKey(staffId, date)]: status },
    }));
  },

  addLeaveRequest(input) {
    set((state) => ({
      leaveRequests: [
        {
          id: `lr-${Date.now()}`,
          staffId: input.staffId,
          staffName: input.staffName,
          type: input.type,
          from: input.from,
          to: input.to,
          status: "Pending",
          reason: input.reason,
        },
        ...state.leaveRequests,
      ],
    }));
  },

  setLeaveStatus(id, status) {
    set((state) => ({
      leaveRequests: state.leaveRequests.map((lr) =>
        lr.id === id ? { ...lr, status } : lr
      ),
    }));
  },

  getStatus(staffId, date) {
    const { marks, leaveRequests } = get();
    return effectiveAttendance(
      marks,
      approvedLeaveKeys(leaveRequests),
      staffId,
      date
    );
  },

  isOnApprovedLeave(staffId, date) {
    return approvedLeaveKeys(get().leaveRequests).has(
      attendanceKey(staffId, date)
    );
  },
}));
