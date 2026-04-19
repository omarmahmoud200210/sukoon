import { useMemo } from "react";
import TaskSection from "./TaskSection";
import TaskItemSkeleton from "./TaskItemSkeleton";
import type { Task } from "@/types/tasks";
import { useTranslation } from "react-i18next";
import { useOverdueTasks } from "@/hooks/useTasks";

interface TaskListProps {
  filter: string;
  tasks: Task[];
  trashTasks: Task[];
  todayTasks: Task[];
  upcomingTasks: Task[];
  isLoading: boolean;
  hasNextPage: boolean;
  currentListId?: string;
  currentTagId?: number;
  onLoadMore: () => Promise<void>;
}

export default function TaskList({
  filter,
  tasks,
  trashTasks,
  todayTasks,
  upcomingTasks,
  isLoading,
  hasNextPage,
  currentListId,
  currentTagId,
  onLoadMore,
}: TaskListProps) {
  const { t } = useTranslation();

  const { data: overdueTasksData } = useOverdueTasks();
  const overdueIds = useMemo(
    () =>
      new Set(
        (Array.isArray(overdueTasksData) ? overdueTasksData : []).map(
          (t) => t.id,
        ),
      ),
    [overdueTasksData],
  );

  const pendingTasks = useMemo(
    () =>
      (tasks || [])
        .filter((t) => t.isCompleted !== true)
        .filter((t) => {
          if (currentListId) return String(t.listId) === String(currentListId);
          if (currentTagId)
            return t.tags && t.tags.some((tag) => tag.id === currentTagId);
          if (
            filter === "all" ||
            filter === "today" ||
            filter === "next7days"
          ) {
            return !t.listId;
          }
          return true;
        }),
    [tasks, filter, currentListId, currentTagId],
  );

  const completedTasks = useMemo(
    () =>
      (tasks || [])
        .filter((t) => t.isCompleted === true)
        .filter((t) => {
          if (currentListId) return String(t.listId) === String(currentListId);
          if (currentTagId)
            return t.tags && t.tags.some((tag) => tag.id === currentTagId);
          if (filter === "all" || filter === "completed") {
            return !t.listId;
          }
          return true;
        }),
    [tasks, filter, currentListId, currentTagId],
  );

  const showPending = useMemo(
    () => filter === "all" || !!currentListId || filter.startsWith("tag-"),
    [filter, currentListId],
  );

  const showCompleted = useMemo(
    () =>
      filter === "all" ||
      filter === "completed" ||
      !!currentListId ||
      filter.startsWith("tag-"),
    [filter, currentListId],
  );

  const showTrash = filter === "trash";

  const showTodayTasks = filter === "today";
  const showUpcomingTasks = filter === "next7days";

  const filteredTodayTasks = useMemo(
    () => (todayTasks || []).filter((t) => !t.listId),
    [todayTasks],
  );
  const filteredUpcomingTasks = useMemo(
    () => (upcomingTasks || []).filter((t) => !t.listId),
    [upcomingTasks],
  );

  if (isLoading) {
    return <TaskItemSkeleton />;
  }

  const isViewEmpty =
    (!showPending || pendingTasks.length === 0) &&
    (!showCompleted || completedTasks.length === 0) &&
    (!showTodayTasks || filteredTodayTasks.length === 0) &&
    (!showUpcomingTasks || filteredUpcomingTasks.length === 0) &&
    (!showTrash || !trashTasks || trashTasks.length === 0);

  if (isViewEmpty) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[40vh] w-full animate-in fade-in duration-500">
        <div className="w-16 h-16 mb-4 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant/30">
          <span className="material-symbols-outlined text-3xl">task</span>
        </div>
        <p className="text-on-surface-variant/60 font-medium text-sm">
          {t("tasks.noTasksFound")}
        </p>
      </div>
    );
  }

  return (
    <>
      {showPending && (
        <TaskSection
          taskSection={{
            title: t("tasks.pendingTasks"),
            tasks: pendingTasks,
            count: pendingTasks.length,
            defaultExpanded: true,
            mode: "task",
            handleLoadMore: onLoadMore,
          }}
          overdueIds={overdueIds}
        />
      )}

      {showCompleted && (
        <TaskSection
          taskSection={{
            title: t("tasks.completed"),
            tasks: completedTasks,
            count: completedTasks.length,
            isCompleted: true,
            defaultExpanded: true,
            mode: "completed",
            handleLoadMore: hasNextPage ? onLoadMore : async () => {},
          }}
          overdueIds={overdueIds}
        />
      )}

      {showTrash && (
        <TaskSection
          taskSection={{
            title: t("tasks.trash"),
            tasks: trashTasks || [],
            count: (trashTasks || []).length,
            defaultExpanded: true,
            mode: "trash",
            handleLoadMore: async () => {},
          }}
          overdueIds={overdueIds}
        />
      )}

      {showTodayTasks && (
        <TaskSection
          taskSection={{
            title: t("tasks.today"),
            tasks: filteredTodayTasks,
            count: filteredTodayTasks.length,
            defaultExpanded: true,
            mode: "today",
            handleLoadMore: async () => {},
          }}
          overdueIds={overdueIds}
        />
      )}

      {showUpcomingTasks && (
        <TaskSection
          taskSection={{
            title: t("tasks.next7Days"),
            tasks: filteredUpcomingTasks,
            count: filteredUpcomingTasks.length,
            defaultExpanded: true,
            mode: "next7days",
            handleLoadMore: async () => {},
          }}
          overdueIds={overdueIds}
        />
      )}
    </>
  );
}
