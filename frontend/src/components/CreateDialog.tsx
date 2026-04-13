import React, { useState } from "react";
import { X, type LucideIcon } from "lucide-react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

interface CreateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAction: (value: string, duration?: number) => void;
  title: string;
  icon?: LucideIcon;
  inputLabel: string;
  inputPlaceholder: string;
  showDuration?: boolean;
}

export default function CreateDialog({ 
  isOpen, 
  onClose, 
  onCreateAction,
  title,
  icon: Icon,
  inputLabel,
  inputPlaceholder,
  showDuration = false,
}: CreateDialogProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState("");
  const [duration, setDuration] = useState<string>("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const parsedDuration = showDuration && duration ? parseInt(duration, 10) : undefined;
      onCreateAction(inputValue.trim(), parsedDuration);
      setInputValue("");
      setDuration("");
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm">
      <div 
        className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-2xl overflow-hidden border border-outline-variant/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h2 className="text-lg font-bold font-display text-on-surface flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-primary" />}
            {title}
          </h2>
          <button 
            onClick={onClose}
            className="p-1 text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="inputValue" className="block text-sm font-medium text-on-surface-variant mb-2">
                {inputLabel}
              </label>
              <input
                id="inputValue"
                type="text"
                autoFocus
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={inputPlaceholder}
                className="w-full px-4 py-2.5 bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg focus:border-primary/50 focus:ring-0 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-sm"
              />
            </div>

            {showDuration && (
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-on-surface-variant mb-2">
                  Duration <span className="text-on-surface-variant/40 font-normal">(minutes)</span>
                </label>
                <input
                  id="duration"
                  type="number"
                  min={1}
                  max={480}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder={t("timer.enterTaskName")}
                  className="w-full px-4 py-2.5 bg-surface-container-highest/30 border border-outline-variant/10 rounded-lg focus:border-primary/50 focus:ring-0 outline-none transition-all text-on-surface placeholder:text-on-surface-variant/30 text-sm"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-5 py-2 text-sm font-medium text-on-primary bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition-all cursor-pointer"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}