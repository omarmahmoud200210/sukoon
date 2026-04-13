import { toast } from "sonner";

export const onCreateTagError = () => {
  toast.error("Failed to create tag", {
    description: "Please try again.",
  });
};

export const onUpdateTagError = () => {
  toast.error("Failed to update tag", {
    description: "Your changes may not have been saved.",
  });
};

export const onDeleteTagError = () => {
  toast.error("Failed to delete tag", {
    description: "Please try again.",
  });
};
