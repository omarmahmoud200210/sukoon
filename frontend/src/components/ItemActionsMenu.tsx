import { MoreHorizontal, Trash, Pencil, RotateCcw, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

type ItemMode = "task" | "list" | "tag" | "trash" | "Comment" | "tafreegh" | "tafreegh-all";

interface ItemActionsMenuProps {
  mode?: ItemMode;
  currentName?: string;
  onDelete?: () => void;
  onEdit?: (newName: string) => void;
  onRestore?: () => void;
  customTrigger?: React.ReactNode;
}

export default function ItemActionsMenu({
  mode,
  currentName = "",
  onDelete,
  onEdit,
  onRestore,
  customTrigger,
}: ItemActionsMenuProps) {
  const { t } = useTranslation();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedName, setEditedName] = useState(currentName);

  let deleteMsg: string = `This action cannot be undone. This will permanently delete the ${mode} from the database.`;

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (mode) {
      setIsAlertOpen(true);
    } else {
      onDelete?.();
    }
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditedName(currentName);
    setIsEditOpen(true);
  };

  const handleEditConfirm = () => {
    if (editedName.trim() && editedName.trim() !== currentName) {
      onEdit?.(editedName.trim());
    }
    setIsEditOpen(false);
  };

  switch (mode) {
    case "task":
      deleteMsg = "This will move the task to trash.";
      break;
    case "tafreegh-all":
      deleteMsg = "This action cannot be undone. This will permanently delete all brain dumps from the database.";
      break;
    default:
      break;
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {customTrigger || (
            <button
              className="p-1.5 text-on-surface-variant/40 hover:text-primary rounded-md hover:bg-surface-container-high transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-surface-container-lowest border-outline-variant/10">
          <DropdownMenuItem
            className="text-error focus:text-error cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(e);
            }}
          >
            <Trash />{" "}
            {mode === "task"
              ? "Move to Trash"
              : mode === "tafreegh-all"
              ? "Delete All"
              : "Delete Permanently"}
          </DropdownMenuItem>
          {mode !== "task" && onEdit && (
            <DropdownMenuItem
              className="text-on-surface-variant focus:text-on-surface cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleEditClick(e);
              }}
            >
              <Pencil /> Edit Name
            </DropdownMenuItem>
          )}
          {mode === "trash" && (
            <DropdownMenuItem
              className="text-on-surface-variant focus:text-on-surface cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (onRestore) onRestore();
              }}
            >
              <RotateCcw /> Restore
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      {isAlertOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsAlertOpen(false);
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
                onClick={() => setIsAlertOpen(false)}
                className="p-1 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-on-surface-variant">
                {deleteMsg}
              </p>

              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsAlertOpen(false);
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
                    setIsAlertOpen(false);
                  }}
                  className="px-5 py-2 text-sm font-medium text-on-error bg-error hover:bg-error/90 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Edit Name Dialog */}
      {isEditOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm"
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
                Edit {mode}
              </h2>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div>
                <label htmlFor="editName" className="block text-sm font-medium text-on-surface-variant mb-2">
                  New name
                </label>
                <input
                  id="editName"
                  autoFocus
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEditConfirm();
                  }}
                  className="w-full px-4 py-2.5 bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg focus:border-primary/50 focus:ring-0 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-sm"
                  placeholder={`${mode} name`}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3">
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
                  Rename
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
