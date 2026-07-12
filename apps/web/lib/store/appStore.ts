import { create } from "zustand";
import type { CaseStatus } from "@/types/case";

interface AppState {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  caseFilterStatus: CaseStatus | "All";
  alertFilter: "Today" | "This Week" | "This Month";
  toggleSidebar: () => void;
  openMobileNav: () => void;
  closeMobileNav: () => void;
  toggleMobileNav: () => void;
  setCaseFilterStatus: (status: CaseStatus | "All") => void;
  setAlertFilter: (filter: "Today" | "This Week" | "This Month") => void;
}

export const useAppStore = create<AppState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  caseFilterStatus: "All",
  alertFilter: "This Week",
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  openMobileNav: () => set({ mobileNavOpen: true }),
  closeMobileNav: () => set({ mobileNavOpen: false }),
  toggleMobileNav: () =>
    set((state) => ({ mobileNavOpen: !state.mobileNavOpen })),
  setCaseFilterStatus: (status) => set({ caseFilterStatus: status }),
  setAlertFilter: (filter) => set({ alertFilter: filter }),
}));
