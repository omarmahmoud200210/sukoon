import { toast } from "sonner";

export const onCreateTaskError = () => {
  toast.error("Failed to create task", {
    description: "Please try again.",
  });
};

export const onUpdateTaskError = () => {
  toast.error("Failed to update task", {
    description: "Your changes may not have been saved.",
  });
};

export const onRestoreTaskError = () => {
  toast.error("Failed to restore task", {
    description: "Please try again.",
  });
};

export const onDeleteTaskError = () => {
  toast.error("Failed to delete task", {
    description: "Please try again.",
  });
};
