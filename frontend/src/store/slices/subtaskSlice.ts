import type { StateCreator } from "zustand";

export interface SubtasksUIStates {
  newSubtask: string;
  setNewSubtask: (subtask: string) => void;
  isAddingSubtask: boolean;
  setIsAddingSubtask: (isAdding: boolean) => void;
}

export const createSubtasksSlice: StateCreator<SubtasksUIStates> = (set) => ({
  newSubtask: "",
  setNewSubtask: (subtask: string) => set({ newSubtask: subtask }),
  
  isAddingSubtask: false,
  setIsAddingSubtask: (isAdding: boolean) => set({ isAddingSubtask: isAdding }),
});
