import { useUIStore } from "@/store/uiStore";
import { useTaskEditor } from "@/hooks/useTaskEditor";

export function useSubtaskEditor() {
  const { deselectTask } = useTaskEditor();
  
  const newSubtask = useUIStore((state) => state.newSubtask);
  const setNewSubtask = useUIStore((state) => state.setNewSubtask);
  
  const isAddingSubtask = useUIStore((state) => state.isAddingSubtask);
  const setIsAddingSubtask = useUIStore((state) => state.setIsAddingSubtask);

  function handleClose() {
    deselectTask();
  }

  return {
    newSubtask,
    setNewSubtask,
    isAddingSubtask,
    setIsAddingSubtask,
    handleClose,
  };
}
