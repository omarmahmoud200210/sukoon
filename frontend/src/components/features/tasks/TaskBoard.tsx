import { useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  usePendingTasks,
  useCompletedTasks,
  useListTasks,
  useTagTasks,
  useCreateTask,
  useCreateTodayTask,
  useCreateUpcomingTask,
  useTrashTasks,
  useTodayTasks,
  useUpcomingTasks,
} from "@/hooks/useTasks";
import type { CreateTask, Task } from "@/types/tasks";
import type { Tag, List } from "@/types";
import { useLists } from "@/hooks/useLists";
import { useTags } from "@/hooks/useTags";
import { useTranslation } from "react-i18next";

interface TaskBoardProps {
  children: (props: {
    filter: string;
    view: string | null;
    pendingTasks: Task[];
    completedTasks: Task[];
    trashTasks: Task[];
    isLoading: boolean;
    currentListId?: string;
    currentTagId?: number;
    placeholder: string;
    pageTitle: string;
    handleAddTask: (taskData: CreateTask) => Promise<void>;
  }) => ReactNode;
}

export function TaskBoard({ children }: TaskBoardProps) {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const view = searchParams.get("view");
  const { t } = useTranslation();

  const { mutateAsync: handleAddTaskAsync } = useCreateTask();
  const { mutateAsync: handleAddTodayTaskAsync } = useCreateTodayTask();
  const { mutateAsync: handleAddUpcomingTaskAsync } = useCreateUpcomingTask();

  const currentListId = view?.startsWith("listid=") ? view.split("=")[1] : undefined;
  const currentTagId = view?.startsWith("tagid=") ? Number(view.split("=")[1]) : undefined;

  const isListView = !!currentListId;
  const isTagView = !!currentTagId;
  const isTodayView = filter === "today";
  const isUpcomingView = filter === "next7days";
  const isTrashView = filter === "trash";
  const isStandardView = filter === "all" || filter === "completed";

  const { data: listsData } = useLists();
  const lists = listsData || [];

  // Lists
  const { data: listPendingTasks, isLoading: isLoadingListP } = useListTasks(currentListId, "pending", { enabled: isListView });
  const { data: listCompletedTasks, isLoading: isLoadingListC } = useListTasks(currentListId, "completed", { enabled: isListView });

  // Tags
  const { data: tagPendingTasks, isLoading: isLoadingTagP } = useTagTasks(currentTagId, "pending", { enabled: isTagView });
  const { data: tagCompletedTasks, isLoading: isLoadingTagC } = useTagTasks(currentTagId, "completed", { enabled: isTagView });

  // Today
  const { data: todayPendingTasks, isLoading: isLoadingTodayP } = useTodayTasks("pending", { enabled: isTodayView });
  const { data: todayCompletedTasks, isLoading: isLoadingTodayC } = useTodayTasks("completed", { enabled: isTodayView });

  // Upcoming
  const { data: upcomingPendingTasks, isLoading: isLoadingUpcomingP } = useUpcomingTasks("pending", { enabled: isUpcomingView });
  const { data: upcomingCompletedTasks, isLoading: isLoadingUpcomingC } = useUpcomingTasks("completed", { enabled: isUpcomingView });

  // Standard (All/Completed)
  const { data: standardPendingTasks, isLoading: isLoadingPending } = usePendingTasks({ enabled: isStandardView });
  const { data: standardCompletedTasks, isLoading: isLoadingCompleted } = useCompletedTasks({ enabled: isStandardView });

  // Trash
  const { data: trashTasksData, isLoading: isLoadingTrash } = useTrashTasks();

  let pendingTasks: Task[] = [];
  let completedTasks: Task[] = [];
  let isLoading = false;

  if (isListView) {
    pendingTasks = listPendingTasks || [];
    completedTasks = listCompletedTasks || [];
    isLoading = isLoadingListP || isLoadingListC;
  } else if (isTagView) {
    pendingTasks = tagPendingTasks || [];
    completedTasks = tagCompletedTasks || [];
    isLoading = isLoadingTagP || isLoadingTagC;
  } else if (isTodayView) {
    pendingTasks = todayPendingTasks || [];
    completedTasks = todayCompletedTasks || [];
    isLoading = isLoadingTodayP || isLoadingTodayC;
  } else if (isUpcomingView) {
    pendingTasks = upcomingPendingTasks || [];
    completedTasks = upcomingCompletedTasks || [];
    isLoading = isLoadingUpcomingP || isLoadingUpcomingC;
  } else if (isTrashView) {
    isLoading = isLoadingTrash;
  } else if (isStandardView) {
    pendingTasks = standardPendingTasks || [];
    completedTasks = standardCompletedTasks || [];
    isLoading = isLoadingPending || isLoadingCompleted;
  }

  const trashTasks = useMemo(
    () =>
      trashTasksData?.data ||
      (Array.isArray(trashTasksData) ? trashTasksData : []),
    [trashTasksData],
  );

  const currentList = currentListId
    ? lists.find((l: List) => String(l.id) === String(currentListId))
    : null;

  const { data: tagsData } = useTags();
  const tags = tagsData || [];
  const currentTag = tags.find((tag: Tag) => tag.id === currentTagId);

  const handleAddTask = async (taskData: CreateTask) => {
    if (currentListId) taskData.listId = Number(currentListId);

    if (currentTagId) {
      if (!taskData.tagIds) {
        taskData.tagIds = [];
      }
      taskData.tagIds.push(currentTagId);
    }

    if (isTodayView) {
      await handleAddTodayTaskAsync(taskData);
    } else if (isUpcomingView) {
      await handleAddUpcomingTaskAsync(taskData);
    } else {
      await handleAddTaskAsync(taskData);
    }
  };

  const placeholder = currentList
    ? t("tasks.addTaskTo", { name: currentList.title })
    : currentTag
      ? t("tasks.addTaskTo", { name: currentTag.name })
      : t("tasks.addTaskToInbox");

  const pageTitle = (function () {
    if (isListView) return currentList?.title || t("common.allTasks");
    if (isTagView) return currentTag?.name || t("common.allTasks");

    switch (filter) {
      case "all":
        return t("common.allTasks");
      case "today":
        return t("common.today");
      case "next7days":
        return t("common.next7days");
      case "completed":
        return t("common.completed");
      case "trash":
        return t("common.trash");
      default:
        return t("common.allTasks");
    }
  })();

  return children({
    filter,
    view,
    pendingTasks,
    completedTasks,
    trashTasks,
    isLoading,
    currentListId,
    currentTagId,
    placeholder,
    pageTitle,
    handleAddTask,
  });
}
