import { Link } from "react-router-dom";
import { Folder } from "lucide-react";
import ItemActionsMenu from "@/components/ItemActionsMenu";
import type { List } from "@/types/lists";
import { useUpdateList } from "@/hooks/useLists";


interface ListItemProps {
  list: List;
  isActive: boolean;
  onSelect: (e: React.MouseEvent) => void;
  onDelete: () => void;
}

export default function ListItem({
  list,
  isActive,
  onSelect,
  onDelete,
}: ListItemProps) {
  const { mutate: updateList } = useUpdateList();

  return (
    <div className="flex items-center group relative px-1 transition-colors">
      <Link
        className={`flex-1 flex items-center gap-4 px-4 py-2.5 text-sm rounded-xl transition-all duration-300 ${
          isActive
            ? "bg-secondary text-on-secondary shadow-sm"
            : "hover:bg-surface-container-high text-on-surface-variant"
        }`}
        to={`/dashboard?view=listid=${list.id}`}
        onClick={(e) => {
          e.preventDefault();
          onSelect(e);
        }}
      >
        <Folder className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-on-secondary" : "text-on-surface-variant/40"}`} />
        <span className="truncate pe-6">{list.title}</span>
      </Link>

      <div className="absolute end-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
        <ItemActionsMenu
          mode="list"
          currentName={list.title}
          onDelete={onDelete}
          onEdit={(newName) => updateList({ id: list.id, title: newName })}
        />
      </div>
    </div>
  );
}
