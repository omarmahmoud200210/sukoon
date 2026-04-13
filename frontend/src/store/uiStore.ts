import { create } from "zustand";
import { createTasksSlice, type TasksUIStates } from "./slices/taskSlice";
import { createListsSlice, type ListsUIStates } from "./slices/listSlice";
import { createTagsSlice, type TagsUIStates } from "./slices/tagSlice";
import { createSubtasksSlice, type SubtasksUIStates } from "./slices/subtaskSlice";
import { createTimerSlice, type TimerUIStates } from "./slices/timerSlice";
import { createLayoutSlice, type LayoutUIStates } from "./slices/layoutSlice";

type UIStoreState = TasksUIStates & ListsUIStates & TagsUIStates & SubtasksUIStates & TimerUIStates & LayoutUIStates;

export const useUIStore = create<UIStoreState>()((...a) => ({
  ...createTasksSlice(...a),
  ...createListsSlice(...a),
  ...createTagsSlice(...a),
  ...createSubtasksSlice(...a),
  ...createTimerSlice(...a),
  ...createLayoutSlice(...a),
}));
