import { useMemo, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useTasks,
  useCreateTask,
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
    tasks: Task[];
    trashTasks: Task[];
    todayTasks: Task[];
    upcomingTasks: Task[];
    isLoading: boolean;
    hasNextPage: boolean;
    currentListId?: string;
    currentTagId?: number;
    placeholder: string;
    pageTitle: string;
    handleAddTask: (taskData: CreateTask) => Promise<void>;
    handleLoadMore: () => Promise<void>;
  }) => ReactNode;
}

export function TaskBoard({ children }: TaskBoardProps) {
  const [searchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const { t } = useTranslation();

  const { mutateAsync: handleAddTaskAsync } = useCreateTask();

  const LIMIT = 10;

  const currentListId =
    filter.startsWith("list-") && filter.split("-")[1] !== "undefined"
      ? filter.split("-")[1]
      : undefined;

  const currentTagId =
    filter.startsWith("tag-") && filter.split("-")[1] !== "undefined"
      ? Number(filter.split("-")[1])
      : undefined;

  const { data: listsData } = useLists();

  const lists = listsData || [];

  const {
    data: allTasksData,
    isLoading: isLoadingAll,
    hasNextPage = false,
    fetchNextPage,
  } = useTasks(0, LIMIT);

  const { data: trashTasksData, isLoading: isLoadingTrash } = useTrashTasks();
  const { data: todayTasksData, isLoading: isLoadingToday } = useTodayTasks();
  const { data: upcomingTasksData, isLoading: isLoadingUpcoming } =
    useUpcomingTasks();

  const tasks = useMemo(() => {
    if (!allTasksData?.pages) return [];
    return allTasksData.pages.flatMap((page) => [
      ...(page.notCompletedTasks || []),
      ...(page.completedTasks || []),
    ]);
  }, [allTasksData]);

  const trashTasks = useMemo(
    () =>
      trashTasksData?.data ||
      (Array.isArray(trashTasksData) ? trashTasksData : []),
    [trashTasksData],
  );

  const todayTasks = useMemo(
    () =>
      todayTasksData?.data ||
      (Array.isArray(todayTasksData) ? todayTasksData : []),
    [todayTasksData],
  );

  const upcomingTasks = useMemo(
    () =>
      upcomingTasksData?.data ||
      (Array.isArray(upcomingTasksData) ? upcomingTasksData : []),
    [upcomingTasksData],
  );

  const isLoading =
    isLoadingAll || isLoadingTrash || isLoadingToday || isLoadingUpcoming;

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

    await handleAddTaskAsync(taskData);
  };

  const handleLoadMore = async () => {
    if (!hasNextPage) return;
    await fetchNextPage();
  };

  const placeholder = currentList
    ? t("tasks.addTaskTo", { name: currentList.title })
    : currentTag
      ? t("tasks.addTaskTo", { name: currentTag.name })
      : t("tasks.addTaskToInbox");

  const pageTitle = (function () {
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
        return currentList?.title || currentTag?.name || t("common.allTasks");
    }
  })();

  console.log("tasks: ", tasks);
  console.log("trashTasks: ", trashTasks);
  console.log("todayTasks: ", todayTasks);
  console.log("upcomingTasks: ", upcomingTasks);

  return children({
    filter,
    tasks,
    trashTasks,
    todayTasks,
    upcomingTasks,
    isLoading,
    hasNextPage,
    currentListId,
    currentTagId,
    placeholder,
    pageTitle,
    handleAddTask,
    handleLoadMore,
  });
}
