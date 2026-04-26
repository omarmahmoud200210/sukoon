import { toast } from "sonner";
import { useUIStore } from "@/store/uiStore";

export const onStartSessionError = () => {
  toast.error("Failed to start session", {
    description: "Please try again.",
  });
  useUIStore.getState().setIsActive(false);
  useUIStore.getState().setEndTimestamp(null);
};

export const onPauseSessionError = () => {
  toast.error("Failed to pause/resume session", {
    description: "The session may be out of sync. Please try again.",
  });
  useUIStore.getState().setIsActive(false);
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
