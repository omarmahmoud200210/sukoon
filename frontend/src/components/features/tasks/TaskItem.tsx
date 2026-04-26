
import type { Task } from "@/types/tasks";
import { useTaskEditor } from "@/hooks/useTaskEditor";
import {
  useUpdateTask,
  useDeleteTask,
  useRestoreTrashTask,
  useDeleteTrashTask,
} from "@/hooks/useTasks";
import DatePickerPopover from "@/components/DatePickerPopover";
import ItemActionsMenu from "@/components/ItemActionsMenu";
import { TagBadge } from "@/components/features/tags";
import { useTranslation } from "react-i18next";


interface TaskItemProps {
  task: Task;
  isTrashMode?: boolean;
  isOverdue?: boolean;
}

function TaskItem({ task, isTrashMode, isOverdue }: TaskItemProps) {
  const { t } = useTranslation();

  const isCompleted = task.isCompleted;
  const isHighPriority = task.priority === "HIGH" && !isCompleted;

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { setSelectedTask } = useTaskEditor();
  const { mutate: restoreTrashTask } = useRestoreTrashTask();
  const { mutate: deleteTrashTask } = useDeleteTrashTask();

  async function handleToggleTask(e: React.MouseEvent) {
    e.stopPropagation();
    updateTask({ id: task.id, data: { isCompleted: !isCompleted } });
  }

  async function handleOpenSubtasksPanel() {
    setSelectedTask(task);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenSubtasksPanel();
    }
  }

  const handleDateSelect = (taskId: string, date?: Date | null) => {
    updateTask({
      id: taskId,
      data: { dueDate: date ? date.toISOString() : null },
    });
  };

  const tagLength = 2;

  const priorityClasses = isHighPriority ? "border border-error/50 rounded-xl shadow-sm mb-1" : "border-b border-b-outline-variant/10";
  const baseClasses = `relative flex items-center gap-4 p-3 transition-all duration-200 cursor-pointer ${priorityClasses}`;

  const stateClasses = isCompleted
    ? "bg-transparent shadow-none text-on-surface-variant/50"
    : "bg-transparent hover:bg-surface-container-lowest";

  return (
    <div
      className={`${baseClasses} ${stateClasses}`}
      onClick={handleOpenSubtasksPanel}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={t("tasks.task_item", { title: task.title })}
    >


      <button
        onClick={handleToggleTask}
        className={`cursor-pointer w-5 h-5 rounded-[0.5rem] border-[1.5px] flex items-center justify-center transition-all shrink-0 ${
          isCompleted
            ? "bg-primary border-primary text-on-primary"
            : isHighPriority
            ? "border-error hover:bg-error/10"
            : "border-outline-variant/30 hover:border-primary group-hover:border-primary"
        }`}
        aria-label={isCompleted ? t("tasks.mark_incomplete") : t("tasks.mark_complete")}
      >
        {isCompleted && (
          <span className="material-symbols-outlined text-[12px]!">check</span>
        )}
      </button>

      <span
        className={`text-sm flex-1 truncate transition-all duration-200 font-body ${
          isCompleted
            ? "text-on-surface-variant/30 line-through"
            : isHighPriority
            ? "text-error font-bold"
            : "text-on-surface font-medium"
        }`}
      >
        {task.title}
      </span>

      <div className="flex items-center gap-1.5">
        {task.tags?.slice(0, tagLength).map((tag) => (
          <TagBadge key={tag.id} tag={tag} />
        ))}
        {(task.tags?.length ?? 0) > tagLength && (
          <span className="flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant/60 uppercase tracking-tighter">
            +{task.tags!.length - tagLength}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <DatePickerPopover
          selectedDate={task.dueDate ? new Date(task.dueDate) : undefined}
          onSelect={(date) => handleDateSelect(task.id, date)}
          isOverdue={isOverdue}
          alwaysVisible={true}
        />

        <ItemActionsMenu
          mode={isTrashMode ? "trash" : "task"}
          onDelete={() => {
            if (isTrashMode) {
              deleteTrashTask(task.id);
            } else {
              deleteTask(task.id);
            }
          }}
          onRestore={isTrashMode ? () => restoreTrashTask(task.id) : undefined}
        />
      </div>
    </div>
  );
}

export default TaskItem;
