import React from "react";
import { useUpdateTask } from "@/hooks/useTasks";
import { useUIStore } from "@/store/uiStore";

export function useTaskEditor() {
  const { mutateAsync: updateTaskMutation } = useUpdateTask();

  const selectedTask = useUIStore((state) => state.selectedTask);
  const setSelectedTask = useUIStore((state) => state.setSelectedTask);

  const isEditingTitle = useUIStore((state) => state.isEditingTitle);
  const setIsEditingTitle = useUIStore((state) => state.setIsEditingTitle);
  const editedTitle = useUIStore((state) => state.editedTitle);
  const setEditedTitle = useUIStore((state) => state.setEditedTitle);

  const isEditingDescription = useUIStore((state) => state.isEditingDescription);
  const setIsEditingDescription = useUIStore((state) => state.setIsEditingDescription);
  const editedDescription = useUIStore((state) => state.editedDescription);
  const setEditedDescription = useUIStore((state) => state.setEditedDescription);

  const titleDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const descDebounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStartEditingTitle = () => {
    setEditedTitle(selectedTask?.title || "");
    setIsEditingTitle(true);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") setIsEditingTitle(false);
    if (e.key === "Escape") {
      setIsEditingTitle(false);
      setEditedTitle(selectedTask?.title || "");
    }
  };

  const handleBlurTitle = () => {
    setIsEditingTitle(false);
  };

  const handleStartEditingDescription = () => {
    setEditedDescription(selectedTask?.description || "");
    setIsEditingDescription(true);
  };

  const handleBlurDescription = () => {
    setIsEditingDescription(false);
  };

  const handleTitleChangeDebounced = (title: string) => {
    setEditedTitle(title);
    if (titleDebounceRef.current) clearTimeout(titleDebounceRef.current);
    titleDebounceRef.current = setTimeout(async () => {
      if (selectedTask) {
        await updateTaskMutation({ id: selectedTask.id, data: { title } });
      }
    }, 1000);
  };

  const handleDescriptionChangeDebounced = (description: string) => {
    setEditedDescription(description);
    if (descDebounceRef.current) clearTimeout(descDebounceRef.current);
    descDebounceRef.current = setTimeout(async () => {
      if (selectedTask) {
        await updateTaskMutation({ id: selectedTask.id, data: { description } });
      }
    }, 1000);
  };

  const deselectTask = () => setSelectedTask(null);

  return {
    selectedTask,
    setSelectedTask,
    deselectTask,
    isEditingTitle,
    editedTitle,
    setEditedTitle,
    handleStartEditingTitle,
    handleTitleKeyDown,
    handleBlurTitle,
    isEditingDescription,
    editedDescription,
    setEditedDescription,
    handleStartEditingDescription,
    handleBlurDescription,
    handleTitleChangeDebounced,
    handleDescriptionChangeDebounced,
  };
}
