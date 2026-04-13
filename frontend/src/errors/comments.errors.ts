import { toast } from "sonner";

export const onCreateCommentError = () => {
  toast.error("Failed to add comment", {
    description: "Please try again.",
  });
};

export const onUpdateCommentError = () => {
  toast.error("Failed to update comment", {
    description: "Your changes may not have been saved.",
  });
};

export const onDeleteCommentError = () => {
  toast.error("Failed to delete comment", {
    description: "Please try again.",
  });
};
