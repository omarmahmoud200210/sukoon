import type { StateCreator } from "zustand";
import type { Tag } from "@/types/tags";

export interface TagsUIStates {
    selectedTag: Tag | null;
    setSelectedTag: (tag: Tag | null) => void;
}

export const createTagsSlice: StateCreator<TagsUIStates> = (set) => ({
    selectedTag: null,
    setSelectedTag: (tag: Tag | null) => set({ selectedTag: tag }),
});