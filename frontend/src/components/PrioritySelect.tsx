import { useState, useRef, useEffect } from "react";
import { Flag, Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";

type Props = {
  selectedPriority?: string;
  onSelect: (priority?: string) => void;
};


export default function PrioritySelect({ selectedPriority, onSelect }: Props) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const priorityStyles: Record<
    string,
    { label: string; color: string; bg: string }
  > = {
    LOW: {
      label: t("common.low"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    MEDIUM: {
      label: t("common.medium"),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    HIGH: {
      label: t("common.high"),
      color: "text-error",
      bg: "bg-error/10",
    },
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const style = selectedPriority ? priorityStyles[selectedPriority] : null;

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl label-sm transition-all duration-300 ${
          style
            ? `${style.color} ${style.bg}`
            : "text-on-surface-variant/40 hover:bg-surface-container-high"
        }`}
      >
        <Flag className="w-3.5 h-3.5" />
        {style?.label || t("common.priority")}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute start-0 top-full mt-4 z-50 bg-surface-container-highest/90 backdrop-blur-xl rounded-2xl shadow-xl py-2 min-w-[160px] transition-all animate-in fade-in slide-in-from-top-2">
          {(["LOW", "MEDIUM", "HIGH"] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                onSelect(level);
                setIsOpen(false);
              }}
              className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all hover:bg-white/5 ${priorityStyles[level].color}`}
            >
              <Flag className="w-4 h-4" />
              {priorityStyles[level].label}
              {selectedPriority === level && (
                <Check className="w-4 h-4 ms-auto" />
              )}
            </button>
          ))}

          {/* Clear */}
          {selectedPriority && (
            <button
              onClick={() => {
                onSelect(undefined);
                setIsOpen(false);
              }}
              className="cursor-pointer w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all border-t border-on-surface-variant/5 mt-2 pt-2"
            >
              <X className="w-4 h-4" />
              {t("common.clear")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

