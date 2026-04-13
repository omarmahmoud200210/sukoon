import type { StateCreator } from "zustand";
import type { Task } from "@/types/tasks";

export interface TasksUIStates {
  // Selection
  selectedTask: Task | null;
  setSelectedTask: (task: Task | null) => void;

  // Title Editing
  isEditingTitle: boolean;
  setIsEditingTitle: (isEditing: boolean) => void;
  editedTitle: string;
  setEditedTitle: (title: string) => void;

  // Description Editing
  isEditingDescription: boolean;
  setIsEditingDescription: (isEditing: boolean) => void;
  editedDescription: string;
  setEditedDescription: (description: string) => void;
}

export const createTasksSlice: StateCreator<TasksUIStates> = (set) => ({
  // Task Selection
  selectedTask: null,
  setSelectedTask: (task: Task | null) => set({ selectedTask: task }),

  // Title Editing
  isEditingTitle: false,
  setIsEditingTitle: (isEditing: boolean) => set({ isEditingTitle: isEditing }),
  editedTitle: "",
  setEditedTitle: (title: string) => set({ editedTitle: title }),

  // Description Editing
  isEditingDescription: false,
  setIsEditingDescription: (isEditing: boolean) =>
    set({ isEditingDescription: isEditing }),
  editedDescription: "",
  setEditedDescription: (description: string) =>
    set({ editedDescription: description }),
});
