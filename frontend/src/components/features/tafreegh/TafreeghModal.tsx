import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Loader2 } from "lucide-react";
import { useCreateTafreegh } from "@/hooks/useTafreegh";
import { useAuth } from "@/contexts/auth/useAuth";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import logger from "@/lib/logger";

interface TafreeghModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TafreeghModal({ isOpen, onClose }: TafreeghModalProps) {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuth();
  const { mutateAsync: createTafreegh, isPending } = useCreateTafreegh();
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      if (textareaRef.current) {
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    } else document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 400)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!content.trim() || !user) return;

    try {
      await createTafreegh({ content: content.trim(), userId: user.id });
      toast.success(
        t("common.tafreegh_success") ||
          "Brain dump captured! AI is organizing your thoughts.",
        {
          icon: "✨",
        },
      );
      setContent("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      onClose();
    } catch (error) {
      logger.error("Error creating tafreegh:", error);
      toast.error("Failed to capture your brain dump. Please try again.");
    }
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
          dir="auto"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-on-surface/30 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-surface-container-lowest rounded-3xl shadow-2xl overflow-hidden border border-outline-variant/10 flex flex-col max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined !text-[20px]">
                    psychology
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold font-display text-on-surface leading-tight">
                    {t("common.tafreegh") || "Tafreegh (Brain Dump)"}
                  </h2>
                  <p className="text-xs text-on-surface-variant/60">
                    {t("tafreegh.modal_subtitle") || "Type everything on your mind. We'll organize it."}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center rounded-xl text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={t("common.tafreegh_placeholder") || "I feel overwhelmed and I need to get things off my chest..."}
                className="w-full min-h-[160px] max-h-[400px] text-lg md:text-xl font-body leading-relaxed bg-transparent border-none outline-none text-on-surface placeholder:text-on-surface-variant/30 resize-none"
              />
            </div>

            <footer className="px-6 py-5 bg-surface-container-low/30 border-t border-outline-variant/5 flex items-center justify-between gap-4">
                <div className="text-xs font-label text-on-surface-variant/40 hidden sm:block">
                  {t("tafreegh.modal_submit_hint") || 'Press'}{" "}
                  <kbd className="px-1.5 py-0.5 rounded-md border border-outline-variant/20 bg-surface-container-high">
                    Ctrl
                  </kbd>{" "}
                  +{" "}
                  <kbd className="px-1.5 py-0.5 rounded-md border border-outline-variant/20 bg-surface-container-high">
                    Enter
                  </kbd>{" "}
                  {t("tafreegh.modal_submit_hint_suffix") || "to submit"}
                </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-xl transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!content.trim() || isPending}
                  className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-bold text-on-primary bg-primary hover:bg-primary/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed rounded-xl shadow-sm shadow-primary/20 transition-all flex items-center justify-center gap-2 group editorial-shadow"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
                  )}
                  {isPending ? t("tafreegh.processing") || "Processing..." : t("tafreegh.extract_tasks") || "Extract Tasks"}
                </button>
              </div>
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
