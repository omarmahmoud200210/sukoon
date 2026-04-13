import { toast } from "sonner";

export const onCreatePomodoroTaskError = () => {
  toast.error("Failed to create pomodoro task", {
    description: "Please try again.",
  });
};

export const onUpdatePomodoroTaskError = () => {
  toast.error("Failed to update pomodoro task", {
    description: "Your changes may not have been saved.",
  });
};

export const onDeletePomodoroTaskError = () => {
  toast.error("Failed to delete pomodoro task", {
    description: "Please try again.",
  });
};
