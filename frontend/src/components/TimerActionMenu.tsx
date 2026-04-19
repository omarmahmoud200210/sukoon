import { useState } from "react";
import { MoreHorizontal, Trash, Pencil, X, Archive } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TimerActionMenuProps {
  name: string;
  duration: number;
  onDelete?: () => void;
  onEdit?: (title: string, duration: number) => void;
  onArchive?: () => void;
}

export default function TimerActionMenu({
  name,
  duration,
  onDelete,
  onEdit,
  onArchive,
}: TimerActionMenuProps) {
  const { t } = useTranslation();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(name);
  const [editDuration, setEditDuration] = useState(String(duration));

  const handleEditOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(name);
    setEditDuration(String(duration));
    setIsEditOpen(true);
  };

  const handleEditConfirm = () => {
    const parsedDuration = parseInt(editDuration, 10);
    if (editTitle.trim() && !isNaN(parsedDuration) && parsedDuration > 0) {
      onEdit?.(editTitle.trim(), parsedDuration);
    }
    setIsEditOpen(false);
  };

  const handleArchiveOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    onArchive?.();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-1.5 text-on-surface-variant/40 hover:text-primary rounded-md hover:bg-surface-container-high transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-surface-container-lowest border-outline-variant/10"
        >
          {onEdit && (
            <DropdownMenuItem
              className="text-on-surface-variant focus:text-on-surface cursor-pointer"
              onClick={handleEditOpen}
            >
              <Pencil className="w-4 h-4 me-2" /> Edit Task
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem
              className="text-error focus:text-error cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
              }}
            >
              <Trash className="w-4 h-4 me-2" /> Delete
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            className="cursor-pointer text-on-surface-variant focus:text-on-surface"
            onClick={handleArchiveOpen}
          >
            <Archive className="w-4 h-4 me-2" /> Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteOpen(false);
            }}
          >
            <div
              className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                <h2 className="text-lg font-bold font-display text-on-surface">
                  Are you absolutely sure?
                </h2>
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="p-1 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-sm text-on-surface-variant">
                  This will move the task to trash.
                </p>
                <div className="mt-6 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDeleteOpen(false);
                    }}
                    className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.();
                      setIsDeleteOpen(false);
                    }}
                    className="px-5 py-2 text-sm font-medium text-on-error bg-error hover:bg-error/90 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Move to Trash
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

      {/* Edit Task Dialog */}
      {isEditOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditOpen(false);
            }}
          >
            <div
              className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
                <h2 className="text-lg font-bold font-display text-on-surface">
                  Edit Task
                </h2>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="editTaskTitle"
                    className="block text-sm font-medium text-on-surface-variant mb-2"
                  >
                    Task Title
                  </label>
                  <input
                    id="editTaskTitle"
                    autoFocus
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditConfirm();
                    }}
                    className="w-full px-4 py-2.5 bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg focus:border-primary/50 focus:ring-0 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-sm"
                    placeholder={t("timer.taskName")}
                  />
                </div>
                <div>
                  <label
                    htmlFor="editTaskDuration"
                    className="block text-sm font-medium text-on-surface-variant mb-2"
                  >
                    Duration (minutes)
                  </label>
                  <input
                    id="editTaskDuration"
                    type="number"
                    min={1}
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditConfirm();
                    }}
                    className="w-full px-4 py-2.5 bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg focus:border-primary/50 focus:ring-0 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-sm"
                    placeholder={t("timer.enterTaskName")}
                  />
                </div>
                <div className="flex items-center justify-end gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleEditConfirm}
                    className="px-5 py-2 text-sm font-medium text-on-primary bg-primary hover:bg-primary/90 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
