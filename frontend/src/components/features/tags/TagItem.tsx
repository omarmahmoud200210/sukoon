import { Link } from "react-router-dom";
import { Tag as TagIcon } from "lucide-react";
import ItemActionsMenu from "@/components/ItemActionsMenu";
import type { Tag } from "@/types/tags";
import { useUpdateTag } from "@/hooks/useTags";


interface TagItemProps {
  tag: Tag;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function TagItem({ tag, isActive, onSelect, onDelete }: TagItemProps) {
  const { mutate: updateTag } = useUpdateTag();

  return (
    <div className="flex items-center group relative px-1 transition-colors">
      <Link
        className={`flex-1 flex items-center gap-4 px-4 py-2.5 text-sm rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-secondary text-on-secondary shadow-sm"
            : "hover:bg-surface-container-high text-on-surface-variant"
        }`}
        to={`/dashboard?filter=tag-${tag.id}`}
        onClick={(e) => {
          e.preventDefault();
          onSelect();
        }}
      >
        <TagIcon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-on-secondary" : "text-on-surface-variant/40"}`} />
        <span className="truncate pe-6">{tag.name}</span>
      </Link>

      <div className="absolute end-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <ItemActionsMenu
          mode="tag"
          currentName={tag.name}
          onDelete={onDelete}
          onEdit={(newName) => updateTag({ id: tag.id, name: newName })}
        />
      </div>
    </div>
  );
}