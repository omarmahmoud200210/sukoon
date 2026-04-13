import type { StateCreator } from "zustand";
import type { PomodoroTask } from "@/types/timer";

export type TimerMode = "work" | "short_break" | "long_break";

export interface TimerUIStates {
  // Timer Engine
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  timeLeft: number;
  setTimeLeft: (timeLeft: number) => void;
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;

  // Task Selection
  manualActiveTask: PomodoroTask | null | undefined;
  setManualActiveTask: (task: PomodoroTask | null | undefined) => void;
  pendingSwitchTask: PomodoroTask | null;
  setPendingSwitchTask: (task: PomodoroTask | null) => void;

  // Dialog Visibility
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (isOpen: boolean) => void;
  switchDialogOpen: boolean;
  setSwitchDialogOpen: (isOpen: boolean) => void;
  endDialogOpen: boolean;
  setEndDialogOpen: (isOpen: boolean) => void;

  // Tab
  activeTab: "active" | "archived";
  setActiveTab: (tab: "active" | "archived") => void;
}

export const createTimerSlice: StateCreator<TimerUIStates> = (set) => ({
  // Timer Engine
  isActive: false,
  setIsActive: (isActive: boolean) => set({ isActive }),
  timeLeft: 0,
  setTimeLeft: (timeLeft: number) => set({ timeLeft }),
  mode: "work",
  setMode: (mode: TimerMode) => set({ mode }),

  // Task Selection
  manualActiveTask: undefined,
  setManualActiveTask: (task: PomodoroTask | null | undefined) =>
    set({ manualActiveTask: task }),
  pendingSwitchTask: null,
  setPendingSwitchTask: (task: PomodoroTask | null) =>
    set({ pendingSwitchTask: task }),

  // Dialog Visibility
  isCreateTaskOpen: false,
  setIsCreateTaskOpen: (isOpen: boolean) => set({ isCreateTaskOpen: isOpen }),
  switchDialogOpen: false,
  setSwitchDialogOpen: (isOpen: boolean) => set({ switchDialogOpen: isOpen }),
  endDialogOpen: false,
  setEndDialogOpen: (isOpen: boolean) => set({ endDialogOpen: isOpen }),

  // Tab
  activeTab: "active",
  setActiveTab: (tab: "active" | "archived") => set({ activeTab: tab }),
});
