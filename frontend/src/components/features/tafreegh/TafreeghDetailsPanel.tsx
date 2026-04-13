import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import ItemActionsMenu from "@/components/ItemActionsMenu";
import { useTafreeghs, useUpdateTafreegh, useDeleteTafreegh } from "@/hooks/useTafreegh";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import type { TafreeghItem } from "@/types/tafreegh";
import { useState, useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import logger from "@/lib/logger";

export default function TafreeghDetailsPanel() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeId = searchParams.get("preview");
  const { data: tafreeghsData } = useTafreeghs();
  const { mutateAsync: updateTafreegh, isPending } = useUpdateTafreegh();
  const { mutateAsync: deleteTafreegh } = useDeleteTafreegh();
  const { i18n } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [prevActiveId, setPrevActiveId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRtl = i18n.language === "ar";
  const dateLocale = isRtl ? ar : enUS;

  const handleClose = () => {
    searchParams.delete("preview");
    setSearchParams(searchParams);
    setIsEditing(false);
  };

  const tafreeghList = (tafreeghsData || []) as TafreeghItem[];
  const activeTafreegh = activeId
    ? tafreeghList.find((t: TafreeghItem) => String(t.id) === activeId)
    : null;

  if (activeId !== prevActiveId) {
    setPrevActiveId(activeId);
    if (activeTafreegh) {
      setEditContent(activeTafreegh.content);
      setIsEditing(false);
    }
  }

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleSave = async () => {
    if (!activeTafreegh || !editContent.trim()) return;

    try {
      await updateTafreegh({
        id: String(activeTafreegh.id),
        content: editContent.trim(),
      });
      setIsEditing(false);
      toast.success("Brain dump updated successfully");
    } catch (error) {
      logger.error("Failed to update tafreegh:", error);
      toast.error("Failed to save your changes.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleDelete = async () => {
    if (!activeTafreegh) return;

    try {
      await deleteTafreegh({ id: String(activeTafreegh.id) });
      toast.success("Brain dump deleted successfully");
      handleClose();
    } catch (error) {
      logger.error("Failed to delete tafreegh:", error);
      toast.error("Failed to delete the brain dump.");
    }
  };

  return (
    <AnimatePresence mode="wait">
      {activeTafreegh ? (
        <motion.aside
          key="tafreegh-details"
          initial={{ opacity: 0, x: 50, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.98 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full fixed inset-0 z-50 xl:static xl:w-[420px] xl:z-20 shrink-0 flex flex-col bg-surface-container-lowest border-s border-outline-variant/10 shadow-2xl"
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Header */}
          <header className="px-6 py-5 border-b border-outline-variant/5 flex items-center justify-between sticky top-0 bg-surface-container-lowest/80 backdrop-blur-md z-10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]! text-primary">
                psychology
              </span>
              <h2 className="text-base font-bold font-display text-on-surface truncate pr-4">
                Tafreegh({activeTafreegh.id})
              </h2>
            </div>
            <div className="flex items-center gap-1">
              <ItemActionsMenu
                mode="tafreegh"
                onDelete={handleDelete}
              />
              <button
                onClick={handleClose}
                className="p-2 -mr-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-full transition-colors shrink-0"
                title="Close Details"
              >
                <span className="material-symbols-outlined text-[20px]!">
                  close
                </span>
              </button>
            </div>
          </header>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar space-y-6">
            <div className="flex flex-col gap-1">
              <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest font-label">
                Date
              </p>
              <p className="text-sm font-medium text-on-surface-variant">
                {format(new Date(activeTafreegh.createdAt), "PP", {
                  locale: dateLocale,
                })}
              </p>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <p className="text-xs font-bold text-on-surface-variant/40 uppercase tracking-widest font-label">
                Raw Content
              </p>

              {isEditing ? (
                <div className="flex-1 flex flex-col gap-3">
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <textarea
                      ref={textareaRef}
                      value={editContent}
                      onChange={handleInput}
                      onKeyDown={handleKeyDown}
                      className="w-full min-h-[200px] text-sm md:text-base bg-transparent border-none outline-none resize-none text-on-surface font-body leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-auto pb-4">
                    <span className="text-xs text-on-surface-variant/40 mr-auto hidden sm:block">
                      Press Ctrl + Enter to save
                    </span>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:bg-surface-container-high rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={
                        isPending ||
                        !editContent.trim() ||
                        editContent === activeTafreegh.content
                      }
                      className="px-5 py-2 text-sm font-medium text-on-primary bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl shadow-sm cursor-pointer transition-colors flex items-center justify-center min-w-[80px]"
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  className="p-4 bg-primary/5 rounded-2xl border border-primary/10 hover:border-primary/30 hover:bg-primary/10 transition-colors cursor-pointer group relative"
                  onClick={() => setIsEditing(true)}
                  title="Click to edit"
                >
                  <p className="text-sm md:text-base whitespace-pre-wrap leading-relaxed text-on-surface font-body overflow-clip">
                    {activeTafreegh.content}
                  </p>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[16px]! text-primary">
                      edit
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.aside>
      ) : (
        <motion.div
          key="tafreegh-empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="hidden xl:flex xl:w-[420px] shrink-0 flex-col items-center justify-center p-8 bg-surface/50 border-s border-outline-variant/10 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-surface-container-high/50 flex items-center justify-center mb-6 text-on-surface-variant/30">
            <span className="material-symbols-outlined !text-[32px]">
              psychology
            </span>
          </div>
          <h3 className="text-base font-bold font-display text-on-surface-variant mb-2">
            No Brain Dump Selected
          </h3>
          <p className="text-sm text-on-surface-variant/50 max-w-[200px]">
            Select a Tafreegh from the dashboard to preview your raw notes here.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
