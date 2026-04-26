import type { StateCreator } from "zustand";
import type { PomodoroTask } from "@/types/timer";

export type TimerMode = "work" | "short_break" | "long_break";

export interface TimerUIStates {
  isActive: boolean;
  setIsActive: (isActive: boolean) => void;
  timeLeft: number;
  setTimeLeft: (timeLeft: number) => void;
  mode: TimerMode;
  setMode: (mode: TimerMode) => void;

  manualActiveTask: PomodoroTask | null | undefined;
  setManualActiveTask: (task: PomodoroTask | null | undefined) => void;
  pendingSwitchTask: PomodoroTask | null;
  setPendingSwitchTask: (task: PomodoroTask | null) => void;

  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (isOpen: boolean) => void;
  switchDialogOpen: boolean;
  setSwitchDialogOpen: (isOpen: boolean) => void;
  endDialogOpen: boolean;
  setEndDialogOpen: (isOpen: boolean) => void;

  activeTab: "active" | "archived";
  setActiveTab: (tab: "active" | "archived") => void;

  endTimestamp: number | null;
  setEndTimestamp: (ts: number | null) => void;
  isTimerFinishedNaturally: boolean;
  setIsTimerFinishedNaturally: (isFinished: boolean) => void;
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

  endTimestamp: null,
  setEndTimestamp: (ts: number | null) => set({ endTimestamp: ts }),

  isTimerFinishedNaturally: false,
  setIsTimerFinishedNaturally: (isFinished: boolean) => set({ isTimerFinishedNaturally: isFinished }),
});
