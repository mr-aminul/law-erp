export type StaffRole =
  | "Partner"
  | "Advocate"
  | "Associate"
  | "Junior Associate"
  | "Paralegal"
  | "Clerk"
  | "Admin";

export type StaffStatus = "Active" | "On Leave" | "Inactive";
export type EmployeeType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Intern"
  | "Consultant";
export type LeaveType = "Annual" | "Sick" | "Casual" | "Maternity";

export interface Staff {
  id: string;
  employeeId?: string;
  name: string;
  initials: string;
  /** Job designation (shown as “Designation” in UI) */
  role: StaffRole;
  employeeType: EmployeeType;
  department?: string;
  lineManager?: string;
  activeCases: number;
  attendancePercent: number;
  status: StaffStatus;
  email?: string;
  phone?: string;
  joinDate?: string;
  capacity?: number;
  barCouncilNo?: string;
  salary?: number;
  cleHours?: number;
}

export interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  status: "Present" | "Absent" | "Late" | "Leave";
}

export interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  type: LeaveType;
  from: string;
  to: string;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
}

export interface CompensationRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  grossSalary: number;
  tds: number;
  netSalary: number;
  paidAt?: string;
}
