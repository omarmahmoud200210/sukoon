export type SubtaskContextType = {
  newSubtask: string;
  isAddingSubtask: boolean;
  setNewSubtask: (value: string) => void;
  setIsAddingSubtask: (value: boolean) => void;
  handleClose: () => void;
};

export type SubtaskData = {
  taskId: string;
  title: string;
};

export type DeleteSubTask = {
  taskId: string;
  subTaskId: string;
};

export type UpdateSubTask = {
  taskId: string;
  subTaskId: string;
  isCompleted?: boolean;
  title?: string;
};
