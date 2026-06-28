import { create } from "zustand";

type UiState = {
  selectedBillingCycle: "monthly" | "quarterly" | "annual";
  setSelectedBillingCycle: (cycle: "monthly" | "quarterly" | "annual") => void;
  lastOtpCode: string | null;
  setLastOtpCode: (code: string | null) => void;
};

export const useUiStore = create<UiState>((set) => ({
  selectedBillingCycle: "monthly",
  setSelectedBillingCycle: (selectedBillingCycle) => set({ selectedBillingCycle }),
  lastOtpCode: null,
  setLastOtpCode: (lastOtpCode) => set({ lastOtpCode }),
}));
