import { toast } from "sonner";

export const onCreateListError = () => {
  toast.error("Failed to create list", {
    description: "Please try again.",
  });
};

export const onUpdateListError = () => {
  toast.error("Failed to update list", {
    description: "Your changes may not have been saved.",
  });
};

export const onDeleteListError = () => {
  toast.error("Failed to delete list", {
    description: "Please try again.",
  });
};
