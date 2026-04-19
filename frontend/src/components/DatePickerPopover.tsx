import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

type Props = {
  selectedDate?: Date;
  onSelect: (date?: Date) => void;
  position?: "left" | "right";
  alwaysVisible?: boolean;
  isOverdue?: boolean;
};

export default function DatePickerPopover({
  selectedDate,
  onSelect,
  position = "right",
  alwaysVisible = false,
  isOverdue = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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

  const formattedDate = selectedDate
    ? selectedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "Inbox";

  return (
    <div className="relative" ref={popoverRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
        }}
        className={`cursor-pointer flex items-center gap-2 px-3 py-1.5 rounded-xl label-sm transition-all duration-300 ${
          isOverdue
            ? "text-error bg-error/10 hover:bg-error/20"
            : selectedDate
              ? "text-primary bg-primary/10 hover:bg-primary/20"
              : alwaysVisible
                ? "text-on-surface-variant/60 hover:text-primary hover:bg-surface-container-high"
                : "text-on-surface-variant/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:text-primary hover:bg-surface-container-high"
        }`}
      >
        <Calendar className="w-3.5 h-3.5" />
        <span>{selectedDate ? formattedDate : "Inbox"}</span>
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className={`absolute ${position === "left" ? "start-0" : "end-0"} top-full mt-4 z-50 bg-surface-container-highest/90 backdrop-blur-xl rounded-2xl shadow-xl p-4 transition-all animate-in fade-in slide-in-from-top-2`}
          onClick={(e) => e.stopPropagation()}
        >
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onSelect(date ?? undefined);
              setIsOpen(false);
            }}
            disabled={{ before: new Date() }}
            className="rdp-custom"
          />

          {/* Clear button */}
          {selectedDate && (
            <button
              type="button"
              onClick={() => {
                onSelect(undefined);
                setIsOpen(false);
              }}
              className="cursor-pointer w-full mt-4 label-sm text-center py-2.5 rounded-xl text-on-surface-variant/40 hover:text-error hover:bg-error/10 transition-all"
            >
              Clear due date
            </button>
          )}
        </div>
      )}

    </div>
  );
}
