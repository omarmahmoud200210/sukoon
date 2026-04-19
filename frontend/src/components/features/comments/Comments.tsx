import { useState } from "react";
import { Send } from "lucide-react";
import { useCreateComment, useComments, useDeleteComment, useUpdateComment } from "@/hooks/useComments";
import { useTranslation } from "react-i18next";
import ItemActionsMenu from "@/components/ItemActionsMenu";

export default function Comments({ taskId}: { taskId: string; }) {
  const { t } = useTranslation();
  const [commentText, setCommentText] = useState("");
  const { mutate: createComment } = useCreateComment();
  const { data: comments } = useComments(taskId);
  const { mutate: deleteComment } = useDeleteComment(taskId);
  const { mutate: updateComment } = useUpdateComment(taskId);

  const handleDeleteComment = (commentId: number) => {
    deleteComment(commentId.toString());
  };

  const handleUpdateComment = (commentId: number, content: string) => {
    if (!content.trim()) return;
    updateComment({
      id: commentId.toString(),
      data: { content, taskId: Number(taskId) }
    });
  };

  const handleCommentSubmit = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    createComment(
      {
        taskId: Number(taskId),
        content: commentText,
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Comments List - Compact */}
      {comments && comments.length > 0 && (
        <div className="w-full space-y-3 pb-2 pt-1">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 items-start group">
              <div className="w-6 h-6 rounded-lg bg-tertiary/20 flex items-center justify-center shrink-0 mt-[2px] shadow-sm">
                <span className="text-[10px] font-bold text-tertiary">
                  {comment.user
                    ? `${comment.user.firstName[0]}${comment.user.lastName[0]}`.toUpperCase()
                    : "U"}
                </span>
              </div>
              <div className="flex-1 min-w-0 relative">
                <div className="bg-surface-container-highest/20 rounded-[10px] px-3 py-2 transition-all duration-300 group-hover:bg-surface-container-highest/40 inline-block w-full">
                  <p className="text-[0.8rem] text-on-surface leading-snug whitespace-pre-wrap wrap-break-word">
                    {comment.content}
                  </p>
                </div>
                <div className="absolute top-0.5 end-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 bg-surface-container-highest rounded-md shadow-sm">
                  <ItemActionsMenu 
                    mode="Comment"
                    currentName={comment.content}
                    onEdit={(newContent) => handleUpdateComment(comment.id, newContent)} 
                    onDelete={() => handleDeleteComment(comment.id)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Input - Compact UI */}
      <div className="w-full sticky bottom-0 pt-2 pb-1">
        <div className="flex items-end gap-2 bg-surface-container-highest/30 rounded-[14px] px-3 py-1.5 border border-outline-variant/10 focus-within:border-primary/40 focus-within:bg-surface-container-highest/50 transition-all shadow-sm">
          <textarea
            autoFocus
            rows={1}
            placeholder={(t("common.description_placeholder") || "Write a comment...") as string}
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleCommentSubmit(e);
                e.currentTarget.style.height = 'auto';
              }
            }}
            className="flex-1 max-h-[120px] bg-transparent border-none text-[0.85rem] text-on-surface placeholder:text-on-surface-variant/30 outline-none resize-none py-1.5 custom-scrollbar leading-relaxed"
            style={{ minHeight: "34px", height: "auto" }}
          />
          <button
            className={`cursor-pointer p-1.5 rounded-[10px] flex items-center justify-center transition-all shrink-0 mb-[2px] ${
              commentText.trim() ? "text-primary hover:bg-primary/10 bg-primary/5 shadow-sm" : "text-on-surface-variant/20 cursor-not-allowed"
            }`}
            onClick={(e) => {
               handleCommentSubmit(e);
               const txt = document.querySelector('textarea') as HTMLTextAreaElement;
               if (txt) txt.style.height = 'auto';
            }}
            disabled={!commentText.trim()}
            title={(t("common.add") || "Post") as string}
          >
            <Send className="w-4 h-4 ms-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

