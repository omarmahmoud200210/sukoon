import {
  Link,
  useSearchParams,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useState } from "react";
import CreateDialog from "@/components/CreateDialog";
import { useTranslation } from "react-i18next";
import { useLists, useCreateList, useDeleteList } from "@/hooks/useLists";
import { useTags, useCreateTag, useDeleteTag } from "@/hooks/useTags";
import { ListItem } from "@/components/features/lists";
import { TagItem } from "@/components/features/tags";
import SidebarSkeleton from "@/components/features/layout/SidebarSkeleton";
import PrayerCountdownWidget from "@/components/features/prayer/PrayerCountdownWidget";
import type { Tag, List } from "@/types";
import { useUIStore } from "@/store/uiStore";
import logger from "@/lib/logger";

export default function Sidebar() {
  const { t } = useTranslation();
  const { data: listsData, isLoading: isLoadingLists } = useLists();
  const lists = listsData || [];
  const { mutateAsync: createList } = useCreateList();
  const { mutateAsync: deleteList } = useDeleteList();
  const { data: tagsData, isLoading: isLoadingTags } = useTags();
  const tags = tagsData || [];
  const { mutateAsync: createTag } = useCreateTag();
  const { mutateAsync: deleteTag } = useDeleteTag();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCreateListOpen, setIsCreateListOpen] = useState(false);
  const [isCreateTagOpen, setIsCreateTagOpen] = useState(false);
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useUIStore();

  const activeFilter =
    location.pathname === "/dashboard"
      ? searchParams.get("filter") || "all"
      : "";

  async function handleFilterChange(id: string) {
    navigate(`/dashboard?filter=${id}`);
  }

  const navItems = [
    { id: "all", label: t("common.all"), icon: "list" },
    { id: "today", label: t("common.today"), icon: "today" },
    { id: "next7days", label: t("common.next7days"), icon: "calendar_month" },
  ];

  return (
    <>
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}
      <aside className={`w-60 shrink-0 flex flex-col pt-8 bg-surface/30 backdrop-blur-sm transition-all duration-300 border-e border-outline-variant/10 fixed inset-y-0 left-0 z-50 transform md:relative md:transform-none ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
      <nav className="px-3 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.id}
            to={`/dashboard?filter=${item.id}`}
            onClick={(e) => {
              e.preventDefault();
              handleFilterChange(item.id);
              setIsMobileSidebarOpen(false);
            }}
            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-all duration-300 ${
              activeFilter === item.id
                ? "bg-primary text-on-primary shadow-sm"
                : "text-on-surface-variant/70 hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: activeFilter === item.id ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
            <span className="font-body text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto custom-scrollbar mt-10 px-1.5">
        {/* Lists Section */}
        <div className="px-3 flex items-center justify-between group mb-3">
          <h3 className="text-[0.6rem] font-bold text-on-surface-variant/30 tracking-[0.1em] uppercase font-label">
            {t("common.lists")}
          </h3>
          <button
            onClick={() => setIsCreateListOpen(true)}
            className="w-5 h-5 rounded-full flex items-center justify-center text-on-surface-variant/20 hover:bg-primary-container hover:text-primary transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined !text-[14px]">add</span>
          </button>
        </div>
        <div className="space-y-0.5 mb-6">
          {isLoadingLists ? (
            <SidebarSkeleton count={3} />
          ) : (
            lists.map((list: List) => (
              <ListItem
                key={list.id}
                list={list}
                isActive={activeFilter === `list-${list.id}`}
                onSelect={() => {
                  handleFilterChange(`list-${list.id}`);
                  setIsMobileSidebarOpen(false);
                }}
                onDelete={() => deleteList(list.id)}
              />
            ))
          )}
        </div>

        {/* Tags Section */}
        <div className="px-3 flex items-center justify-between group mb-3">
          <h3 className="text-[0.6rem] font-bold text-on-surface-variant/30 tracking-[0.1em] uppercase font-label">
            {t("common.tags")}
          </h3>
          <button
            className="w-5 h-5 rounded-full flex items-center justify-center text-on-surface-variant/20 hover:bg-primary-container hover:text-primary transition-all cursor-pointer"
            onClick={() => setIsCreateTagOpen(true)}
          >
            <span className="material-symbols-outlined !text-[14px]">add</span>
          </button>
        </div>
        <div className="space-y-0.5 pb-4">
          {isLoadingTags ? (
            <SidebarSkeleton count={3} />
          ) : (
            tags.map((tag: Tag) => (
              <TagItem
                key={tag.id}
                tag={tag}
                isActive={activeFilter === `tag-${tag.id}`}
                onSelect={() => {
                  handleFilterChange(`tag-${tag.id}`);
                  setIsMobileSidebarOpen(false);
                }}
                onDelete={() => deleteTag(tag.id.toString())}
              />
            ))
          )}
        </div>
      </div>

      <div className="px-3 pt-4 pb-24 md:pb-6 border-t border-outline-variant/10">
        <PrayerCountdownWidget />
        <div className="space-y-0.5">
          <Link
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
            activeFilter === "completed"
              ? "bg-secondary-container text-secondary"
              : "text-on-surface-variant/70 hover:bg-surface-container-high"
          }`}
          to="/dashboard?filter=completed"
          onClick={(e) => {
            e.preventDefault();
            handleFilterChange("completed");
            setIsMobileSidebarOpen(false);
          }}
        >
          <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: activeFilter === "completed" ? "'FILL' 1" : "'FILL' 0" }}>task_alt</span>
          <span className="font-body text-xs">{t("common.completed")}</span>
        </Link>
        <Link
          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 ${
            activeFilter === "trash"
              ? "bg-error-container/40 text-error"
              : "text-on-surface-variant/70 hover:bg-surface-container-high hover:text-error"
          }`}
          to="/dashboard?filter=trash"
          onClick={(e) => {
            e.preventDefault();
            handleFilterChange("trash");
            setIsMobileSidebarOpen(false);
          }}
        >
          <span className="material-symbols-outlined !text-[18px]" style={{ fontVariationSettings: activeFilter === "trash" ? "'FILL' 1" : "'FILL' 0" }}>delete</span>
          <span className="font-body text-xs">{t("common.trash")}</span>
        </Link>
        </div>
      </div>

      <CreateDialog
        isOpen={isCreateListOpen}
        onClose={() => setIsCreateListOpen(false)}
        onCreateAction={async (listName) => {
          try {
            await createList(listName);
          } catch (err) {
            logger.error("Error creating list:", err);
          }
        }}
        title="Create New List"
        inputLabel="Name"
        inputPlaceholder={t("sidebar.list_placeholder") || "e.g. Work, Errands, Reading..."}
      />

      <CreateDialog
        isOpen={isCreateTagOpen}
        onClose={() => setIsCreateTagOpen(false)}
        onCreateAction={async (tagName) => {
          try {
            await createTag(tagName);
          } catch (err) {
            logger.error("Error creating tag:", err);
          }
        }}
        title="Create New Tag"
        inputLabel="Name"
        inputPlaceholder={t("sidebar.tag_placeholder") || "e.g. Urgent, Frontend, Bug..."}
      />
    </aside>
    </>
  );
}
