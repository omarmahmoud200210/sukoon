import { TagIcon, Plus, Check } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTags, useCreateTag } from "@/hooks/useTags";
import { useTranslation } from "react-i18next";
import type { Tag } from "@/types";

interface TagSelectProps {
  selectedTagIds?: number[];
  onSelect: (tagIds: number[]) => void;
}

export default function TagSelect({
  selectedTagIds = [],
  onSelect,
}: TagSelectProps) {
  const { t } = useTranslation();
  const { data: tagsData } = useTags();
  const tags = tagsData || [];
  const { mutateAsync: createTag } = useCreateTag();
  const [newTagName, setNewTagName] = useState("");

  const handleToggleTag = (tagId: number, e: Event) => {
    e.preventDefault();
    const isSelected = selectedTagIds.includes(tagId);
    let newTagIds;
    if (isSelected) {
      newTagIds = selectedTagIds.filter((id) => id !== tagId);
    } else {
      newTagIds = [...selectedTagIds, tagId];
    }
    onSelect(newTagIds);
  };

  const handleCreateTag = async () => {
    const trimmed = newTagName.trim();
    if (!trimmed) return;
    await createTag(trimmed);
    setNewTagName("");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 label-sm px-4 py-1.5 rounded-xl border border-dashed border-on-surface-variant/20 text-on-surface-variant/40 hover:text-primary hover:border-primary/50 transition-all duration-300 w-fit cursor-pointer">
          <Plus className="w-3.5 h-3.5" />
          {t("common.tags")}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-surface-container-highest/90 backdrop-blur-xl border-none rounded-2xl shadow-xl p-2 animate-in fade-in slide-in-from-top-2"
      >
        {/* Create new tag inline - Soft Tray Style */}
        <div className="flex items-center gap-2 px-2 py-2">
          <input
            type="text"
            placeholder={t("common.new_tag_placeholder") || "New tag..."}
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") handleCreateTag();
            }}
            className="flex-1 text-xs bg-surface-container-low/50 border-none rounded-xl px-3 py-2 outline-none focus:bg-primary-fixed/30 text-on-surface placeholder:text-on-surface-variant/30 transition-all"
          />
          <button
            onClick={handleCreateTag}
            className="p-2 rounded-xl hover:bg-primary/10 text-primary transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <DropdownMenuSeparator className="bg-on-surface-variant/5 my-2" />

        <DropdownMenuLabel className="px-3 py-2 text-[10px] font-bold text-on-surface-variant/30 uppercase tracking-widest">
          {t("common.apply_tags") || "Apply Tags"}
        </DropdownMenuLabel>
        
        <div className="max-h-[240px] overflow-y-auto custom-scrollbar">
          {tags.length === 0 ? (
            <div className="px-3 py-4 text-xs text-on-surface-variant/30 italic text-center">
              No tags found.
            </div>
          ) : (
            tags.map((tag: Tag) => {
              const isSelected = selectedTagIds.includes(tag.id);
              return (
                <DropdownMenuItem
                  key={tag.id}
                  onSelect={(e) => handleToggleTag(tag.id, e)}
                  className="group/tag flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer hover:bg-white/5 focus:bg-white/5 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <TagIcon className={`w-3.5 h-3.5 transition-colors ${isSelected ? "text-primary" : "text-on-surface-variant/30"}`} />
                    <span className={`text-sm ${isSelected ? "text-primary font-medium" : "text-on-surface"}`}>{tag.name}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-primary" />}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

