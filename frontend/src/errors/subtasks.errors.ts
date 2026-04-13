import { toast } from "sonner";

export const onCreateSubtaskError = () => {
  toast.error("Failed to create subtask", {
    description: "Please try again.",
  });
};

export const onUpdateSubtaskError = () => {
  toast.error("Failed to update subtask", {
    description: "Your changes may not have been saved.",
  });
};

export const onDeleteSubtaskError = () => {
  toast.error("Failed to delete subtask", {
    description: "Please try again.",
  });
};
