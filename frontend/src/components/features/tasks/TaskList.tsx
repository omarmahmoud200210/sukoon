import { useMemo } from "react";
import TaskSection from "./TaskSection";
import TaskItemSkeleton from "./TaskItemSkeleton";
import type { Task } from "@/types/tasks";
import { useTranslation } from "react-i18next";
import { useOverdueTasks } from "@/hooks/useTasks";

interface TaskListProps {
  filter: string;
  view: string | null;
  pendingTasks: Task[];
  completedTasks: Task[];
  trashTasks: Task[];
  isLoading: boolean;
  currentListId?: string;
  currentTagId?: number;
}

export default function TaskList({
  filter,
  pendingTasks,
  completedTasks,
  trashTasks,
  isLoading,
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

  const showPending = filter !== "trash" && filter !== "completed";
  const showCompleted = filter !== "trash";
  const showTrash = filter === "trash";

  if (isLoading) {
    return <TaskItemSkeleton />;
  }

  const isViewEmpty =
    (!showPending || pendingTasks.length === 0) &&
    (!showCompleted || completedTasks.length === 0) &&
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
            handleLoadMore: async () => {},
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
            handleLoadMore: async () => {},
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
    </>
  );
}
