import { useRef, useState } from "react";
import type { Subtasks } from "@/types/tasks";
import { useSubtaskEditor } from "@/hooks/useSubtaskEditor";
import { useTaskEditor } from "@/hooks/useTaskEditor";
import { useTranslation } from "react-i18next";
import {
  useSubtasks,
  useCreateSubtask,
  useUpdateSubtask,
  useDeleteSubtask,
} from "@/hooks/useSubtasks";

export default function SubTaskItem() {
  const { t } = useTranslation();
  const { newSubtask, isAddingSubtask, setNewSubtask, setIsAddingSubtask } =
    useSubtaskEditor();

  const { selectedTask } = useTaskEditor();

  const { data: subTasksData } = useSubtasks(selectedTask?.id || "");
  const subTasks: Subtasks[] = subTasksData || [];

  const completedCount = subTasks.filter((s: Subtasks) => s.isCompleted).length;
  const progress =
    subTasks.length > 0 ? (completedCount / subTasks.length) * 100 : 0;

  const { mutateAsync: createSubtaskMutation } = useCreateSubtask();
  const { mutateAsync: updateSubtaskMutation } = useUpdateSubtask();
  const { mutateAsync: deleteSubtaskMutation } = useDeleteSubtask();

  const [editingTitles, setEditingTitles] = useState<Record<string, string>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddSubtask = async () => {
    if (!newSubtask.trim() || !selectedTask) return;

    await createSubtaskMutation({
      taskId: selectedTask.id,
      title: newSubtask,
    });

    setNewSubtask("");
    setIsAddingSubtask(false);
  };

  const handleToggleStatusSubtask = async (
    subTaskId: string,
    isCompleted: boolean
  ) => {
    if (selectedTask) {
      await updateSubtaskMutation({
        taskId: selectedTask.id,
        subTaskId,
        isCompleted,
      });
    }
  };

  const handleChangeSubtaskTitle = (
    title: string,
    subTaskId: string,
    isCompleted: boolean
  ) => {
    setEditingTitles(prev => ({ ...prev, [subTaskId]: title }));

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      if (selectedTask) {
        await updateSubtaskMutation({
          taskId: selectedTask.id,
          subTaskId,
          title,
          isCompleted,
        });
      }
    }, 1500);
  };

  const handleBlurSubtaskTitle = (subTaskId: string) => {
    setEditingTitles(prev => {
      const newState = { ...prev };
      delete newState[subTaskId];
      return newState;
    });
  };

  const handleDeleteSubtask = async (subTaskId: string) => {
    if (selectedTask) {
      await deleteSubtaskMutation({
        taskId: selectedTask.id,
        subTaskId,
      });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-[0.6rem] font-bold text-on-surface-variant/30 tracking-[0.05em] font-label">
            {completedCount} / {subTasks.length}
          </span>
        </div>
      </div>

      {subTasks.length > 0 && (
        <div className="h-0.5 bg-surface-container-highest rounded-full mb-3 overflow-hidden">
          <div
            className="h-full bg-primary/60 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="space-y-0.5">
        {subTasks.map((subTask) => (
          <div
            key={subTask.id}
            className="group flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-surface-container-highest/10 transition-all duration-300"
          >
            <button
              onClick={() =>
                handleToggleStatusSubtask(subTask.id, !subTask.isCompleted)
              }
              className={`cursor-pointer w-4 h-4 rounded-[0.4rem] border flex items-center justify-center transition-all shrink-0 ${
                subTask.isCompleted
                  ? "bg-primary border-primary text-on-primary"
                  : "border-outline-variant/30 hover:border-primary"
              }`}
            >
              {subTask.isCompleted && (
                <span className="material-symbols-outlined text-[11px]!">
                  check
                </span>
              )}
            </button>
            <textarea
              rows={1}
              className={`text-xs flex-1 bg-transparent outline-none transition-all duration-500 font-body resize-none overflow-hidden py-1 ${
                subTask.isCompleted
                  ? "text-on-surface-variant/30 line-through"
                  : "text-on-surface"
              }`}
              value={editingTitles[subTask.id] ?? subTask.title}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
              }}
              onChange={(e) =>
                handleChangeSubtaskTitle(
                  e.target.value,
                  subTask.id,
                  subTask.isCompleted,
                )
              }
              onBlur={() => handleBlurSubtaskTitle(subTask.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.blur();
                  setIsAddingSubtask(true);
                }
              }}
            />
            <button
              onClick={() => handleDeleteSubtask(subTask.id)}
              className="cursor-pointer opacity-100 md:opacity-0 md:group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded-lg text-on-surface-variant/10 hover:text-error hover:bg-error/5 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[14px]!">
                close
              </span>
            </button>
          </div>
        ))}
      </div>

      {isAddingSubtask ? (
        <div className="mt-3 flex items-center gap-2 animate-fade-in">
          <input
            autoFocus
            type="text"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddSubtask();
              if (e.key === "Escape") {
                setIsAddingSubtask(false);
                setNewSubtask("");
              }
            }}
            placeholder={t("common.subtask_placeholder") || "Subtask title..."}
            className="flex-1 px-2.5 py-1.5 bg-surface-container-highest/15 border-none focus:bg-surface-container-highest focus:ring-0 rounded-md text-xs placeholder:text-on-surface-variant/20 transition-all duration-500 font-body text-start"
          />
          <button
            onClick={handleAddSubtask}
            className="cursor-pointer px-2.5 py-1.5 bg-primary text-on-primary text-[10px] font-bold rounded-md hover:shadow-sm transition-all duration-300"
          >
            {t("common.add")}
          </button>
          <button
            onClick={() => {
              setIsAddingSubtask(false);
              setNewSubtask("");
            }}
            className="cursor-pointer px-2.5 py-1.5 text-on-surface-variant/30 hover:text-error hover:bg-error/5 text-[10px] font-bold rounded-md hover:shadow-sm transition-all duration-300"
          >
            {t("common.cancel")}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAddingSubtask(true)}
          className="cursor-pointer mt-3 flex items-center gap-2 px-1 py-1.5 text-xs text-on-surface-variant/30 hover:text-primary transition-all duration-300 w-full group text-start"
        >
          <span className="material-symbols-outlined text-[18px]! group-hover:scale-110 transition-transform">
            add_circle
          </span>
          <span className="font-body">{t("common.add_subtask")}</span>
        </button>
      )}
    </div>
  );
}
