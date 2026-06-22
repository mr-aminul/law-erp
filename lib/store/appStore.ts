import { create } from "zustand";
import type { CaseStatus } from "@/types/case";

interface AppState {
  sidebarCollapsed: boolean;
  caseFilterStatus: CaseStatus | "All";
  alertFilter: "Today" | "This Week" | "This Month";
  toggleSidebar: () => void;
  setCaseFilterStatus: (status: CaseStatus | "All") => void;
  setAlertFilter: (filter: "Today" | "This Week" | "This Month") => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  caseFilterStatus: "All",
  alertFilter: "This Week",
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setCaseFilterStatus: (status) => set({ caseFilterStatus: status }),
  setAlertFilter: (filter) => set({ alertFilter: filter }),
}));
