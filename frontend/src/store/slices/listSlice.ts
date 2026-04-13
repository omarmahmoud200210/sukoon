import type { StateCreator } from "zustand";
import type { List } from "@/types/lists";

export interface ListsUIStates {
  selectedList: List | null;
  setSelectedList: (list: List | null) => void;
}

export const createListsSlice: StateCreator<ListsUIStates> = (set) => ({
  selectedList: null,
  setSelectedList: (list: List | null) => set({ selectedList: list }),
});