import { toast } from "sonner";

export const onStartSessionError = () => {
  toast.error("Failed to start session", {
    description: "Please try again.",
  });
};

export const onPauseSessionError = () => {
  toast.error("Failed to pause session", {
    description: "Please try again.",
  });
};

export const onCompleteSessionError = () => {
  toast.error("Failed to complete session", {
    description: "Your progress may not have been saved.",
  });
};

export const onResetSessionError = () => {
  toast.error("Failed to reset session", {
    description: "Please try again.",
  });
};
