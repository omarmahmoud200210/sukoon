import { toast } from "sonner";

export const onCreateTafreeghError = () => {
  toast.error("Failed to create tafreegh", {
    description: "Please try again.",
  });
};

export const onUpdateTafreeghError = () => {
  toast.error("Failed to update tafreegh", {
    description: "Your changes may not have been saved.",
  });
};

export const onDeleteTafreeghError = () => {
  toast.error("Failed to delete tafreegh", {
    description: "Please try again.",
  });
};

export const onDeleteAllTafreeghError = () => {
  toast.error("Failed to delete all tafreeghs", {
    description: "Please try again.",
  });
};
