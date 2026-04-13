import { TagIcon, X } from "lucide-react";
import type { Tag } from "@/types/tags";

interface TagBadgeProps {
  tag: Tag;
  onRemove?: () => void;
}

export default function TagBadge({ tag, onRemove }: TagBadgeProps) {
  return (
    <span className="group/badge relative flex items-center gap-2 text-[10px] font-bold px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant uppercase tracking-wider w-fit transition-all hover:bg-surface-container-highest">
      <TagIcon className="w-3 h-3 opacity-40 ms-1" />
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-1 -end-1 hidden group-hover/badge:flex items-center justify-center w-4 h-4 rounded-full bg-error text-on-error transition-all cursor-pointer shadow-sm hover:scale-110"
        >
          <X className="w-2.5 h-2.5 font-bold" />
        </button>
      )}
    </span>
  );
}
