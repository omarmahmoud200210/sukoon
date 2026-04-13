import type { StateCreator } from "zustand";

export interface LayoutUIStates {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

export const createLayoutSlice: StateCreator<LayoutUIStates> = (set) => ({
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
});
