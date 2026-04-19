import { Check } from "lucide-react";
import { useState } from "react";
import { useTaskEditor } from "@/hooks/useTaskEditor";
import { useSubtaskEditor } from "@/hooks/useSubtaskEditor";
import { useTranslation } from "react-i18next";
import {
  useUpdateTask,
  useDeleteTask,
  useDeleteTrashTask,
  useOverdueTasks,
  useTask,
} from "@/hooks/useTasks";
import PrioritySelect from "@/components/PrioritySelect";
import DatePickerPopover from "@/components/DatePickerPopover";
import NoSelectedTask from "./NoSelectedTask";
import type { Task } from "@/types/tasks";
import type { Tag } from "@/types";
import ItemActionsMenu from "@/components/ItemActionsMenu";
import SubTaskItem from "./SubTaskItem";
import { TagBadge, TagSelect } from "@/components/features/tags";
import Comments from "../comments/Comments";
import { motion, AnimatePresence } from "framer-motion";

export default function SubTaskPanel() {
  const [showComments, setShowComments] = useState(false);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const { handleClose } = useSubtaskEditor();
  const {
    selectedTask,
    isEditingTitle,
    handleStartEditingTitle,
    handleTitleKeyDown,
    handleBlurTitle,
    isEditingDescription,
    handleStartEditingDescription,
    handleBlurDescription,
    handleTitleChangeDebounced,
    handleDescriptionChangeDebounced,
  } = useTaskEditor();

  const { mutate: updateTask } = useUpdateTask();
  const { mutate: deleteTask } = useDeleteTask();
  const { mutate: deleteTrashTask } = useDeleteTrashTask();

  const { data: overdueTasksData } = useOverdueTasks();
  const overdueTasks = Array.isArray(overdueTasksData) ? overdueTasksData : [];

  const { data: fullTaskData } = useTask(selectedTask?.id || "");
  const currentTaskDetails = fullTaskData || selectedTask;

  const isOverdue =
    overdueTasks?.some((t: Task) => t.id === currentTaskDetails?.id) || false;

  const handleDateSelect = (taskId: string, date?: Date) => {
    updateTask({
      id: taskId,
      data: { dueDate: date ? date.toISOString() : undefined },
    });
  };

  const [localTitle, setLocalTitle] = useState(currentTaskDetails?.title || "");
  const [localDescription, setLocalDescription] = useState(
    currentTaskDetails?.description || "",
  );

  const [prevDetails, setPrevDetails] = useState({
    id: currentTaskDetails?.id,
    title: currentTaskDetails?.title,
    description: currentTaskDetails?.description,
  });

  if (
    currentTaskDetails?.id !== prevDetails.id ||
    currentTaskDetails?.title !== prevDetails.title ||
    currentTaskDetails?.description !== prevDetails.description
  ) {
    setPrevDetails({
      id: currentTaskDetails?.id,
      title: currentTaskDetails?.title,
      description: currentTaskDetails?.description,
    });

    if (currentTaskDetails?.id !== prevDetails.id) {
      setLocalTitle(currentTaskDetails?.title || "");
      setLocalDescription(currentTaskDetails?.description || "");
    } else {
      if (!isEditingTitle) setLocalTitle(currentTaskDetails?.title || "");
      if (!isEditingDescription) setLocalDescription(currentTaskDetails?.description || "");
    }
  }

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    handleTitleChangeDebounced(e.target.value);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDescription(e.target.value);
    handleDescriptionChangeDebounced(e.target.value);
  };

  const handleChangeProirity = (taskId: string, priority: string) => {
    updateTask({ id: taskId, data: { priority } });
  };

  const handleToggleSelectedTask = () => {
    if (currentTaskDetails) {
      updateTask({
        id: currentTaskDetails.id,
        data: { isCompleted: !currentTaskDetails.isCompleted },
      });
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedTask ? (
        <motion.div
          key="empty-state"
          initial={{ opacity: 0, x: isRtl ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden xl:block h-full"
        >
          <NoSelectedTask task={selectedTask} />
        </motion.div>
      ) : (
        <motion.aside
          key={selectedTask.id}
          initial={{ opacity: 0, x: isRtl ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{
            opacity: 0,
            x: isRtl ? 30 : -30,
            transition: { duration: 0.2 },
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="w-full fixed inset-0 z-50 xl:static xl:w-[420px] xl:z-20 shrink-0 bg-surface-container-lowest/95 backdrop-blur-2xl flex flex-col h-[100dvh] xl:h-full border-s border-outline-variant/10"
          style={{
            boxShadow: isRtl
              ? "8px 0 30px -15px rgba(0,0,0,0.12)"
              : "-8px 0 30px -15px rgba(0,0,0,0.12)",
          }}
        >
          {/* TickTick Style Header */}
          <header className="min-h-[3.25rem] pt-[env(safe-area-inset-top)] flex items-center justify-between px-5 shrink-0 border-b border-outline-variant/5">
            <div className="flex items-center">
              <button
                onClick={handleClose}
                className="cursor-pointer p-1.5 flex items-center justify-center rounded-lg text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-high transition-all"
                title="Close panel"
              >
                <span className="material-symbols-outlined text-[20px]! rtl:-scale-x-100">
                  last_page
                </span>
              </button>
            </div>
            <div className="flex items-center gap-1">
              <ItemActionsMenu
                mode="task"
                currentName={currentTaskDetails?.title}
                onDelete={() => {
                  deleteTrashTask(currentTaskDetails.id);
                  handleClose();
                }}
              />
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5 space-y-6">
            {/* Task Title & Completion Toggle */}
            <div className="flex items-start gap-3 group">
              <button
                className="cursor-pointer -ms-2 -mt-2 p-2 flex items-center justify-center shrink-0 group/btn"
                onClick={handleToggleSelectedTask}
              >
                <div
                  className={`w-[1.15rem] h-[1.15rem] rounded-sm border-[1.5px] flex items-center justify-center transition-all ${
                    currentTaskDetails?.isCompleted
                      ? "bg-primary border-primary text-on-primary shadow-sm"
                      : "border-outline-variant/40 group-hover/btn:border-primary"
                  }`}
                >
                  {currentTaskDetails?.isCompleted && (
                    <Check className="w-3 h-3" strokeWidth={3} />
                  )}
                </div>
              </button>

              <div className="flex-1">
                {isEditingTitle ? (
                  <input
                    autoFocus
                    type="text"
                    value={localTitle}
                    onChange={onTitleChange}
                    onBlur={handleBlurTitle}
                    onKeyDown={handleTitleKeyDown}
                    className="text-[1.05rem] font-display font-medium leading-snug bg-transparent border-none outline-none text-on-surface w-full p-0"
                  />
                ) : (
                  <h3
                    className={`text-[1.05rem] font-display font-medium leading-snug cursor-text transition-all duration-300 w-full min-h-6 break-words whitespace-normal ${
                      currentTaskDetails?.isCompleted
                        ? "text-on-surface-variant/40 line-through"
                        : "text-on-surface"
                    }`}
                    onClick={handleStartEditingTitle}
                  >
                    {localTitle || t("common.no_title") || "No title"}
                  </h3>
                )}
              </div>
            </div>

            {/* Inline Properties (Date, Priority, Tags Add) */}
            <div className="flex items-center flex-wrap gap-2 pt-1 border-b border-outline-variant/5 pb-4">
              <DatePickerPopover
                selectedDate={
                  currentTaskDetails?.dueDate
                    ? new Date(currentTaskDetails.dueDate)
                    : undefined
                }
                onSelect={(date) =>
                  handleDateSelect(currentTaskDetails.id!, date)
                }
                alwaysVisible
                isOverdue={isOverdue}
              />

              <PrioritySelect
                selectedPriority={currentTaskDetails?.priority}
                onSelect={(priority) =>
                  handleChangeProirity(
                    currentTaskDetails.id,
                    priority || "MEDIUM",
                  )
                }
              />

              <TagSelect
                selectedTagIds={
                  currentTaskDetails.tags?.map((t: Tag) => t.id) || []
                }
                onSelect={(tagIds) =>
                  updateTask({ id: currentTaskDetails.id, data: { tagIds } })
                }
              />
            </div>

            {/* Description */}
            <div className="group relative">
              <textarea
                placeholder={
                  (t("common.description_placeholder") ||
                    "Description...") as string
                }
                value={localDescription}
                onChange={onDescriptionChange}
                onFocus={handleStartEditingDescription}
                onBlur={handleBlurDescription}
                className="w-full min-h-[100px] text-[0.85rem] leading-relaxed bg-transparent border-none outline-none text-on-surface-variant placeholder:text-on-surface-variant/30 focus:text-on-surface transition-all duration-300 resize-none font-body"
              />
            </div>

            {/* Subtasks Section */}
            <div className="border-t border-outline-variant/5 pt-5">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[0.65rem] font-bold text-on-surface-variant/40 tracking-wider uppercase font-label">
                  {(t("common.subtasks") || "Subtasks") as string}
                </h4>
              </div>
              <SubTaskItem />
            </div>

            {/* Tags Display */}
            {currentTaskDetails.tags && currentTaskDetails.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-2">
                {currentTaskDetails.tags.map((tag: Tag) => (
                  <TagBadge
                    key={tag.id}
                    tag={tag}
                    onRemove={() => {
                      const newTagIds = currentTaskDetails.tags
                        .filter((t: Tag) => t.id !== tag.id)
                        .map((t: Tag) => t.id);
                      updateTask({
                        id: currentTaskDetails.id,
                        data: { tagIds: newTagIds },
                      });
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Floating Comments Widget */}
          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-x-0 bottom-0 rounded-t-3xl xl:absolute xl:bottom-14 xl:inset-x-auto xl:start-4 xl:end-4 max-h-[85vh] xl:max-h-[45%] flex flex-col bg-surface-container-lowest/95 backdrop-blur-2xl border border-outline-variant/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-50 xl:rounded-2xl overflow-hidden pb-[env(safe-area-inset-bottom)] xl:pb-0"
              >
                <div className="flex items-center justify-between px-5 pt-3 pb-2 border-b border-outline-variant/5 shrink-0 bg-surface-container-highest/20">
                  <h3 className="text-[0.65rem] font-bold text-on-surface-variant/50 uppercase tracking-widest font-label px-1">
                    {(t("common.comments") || "Comments") as string}
                  </h3>
                  <button
                    onClick={() => setShowComments(false)}
                    className="p-1 rounded-lg text-on-surface-variant/50 hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]!">
                      close
                    </span>
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
                  <Comments taskId={currentTaskDetails.id} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TickTick Style Bottom Action Bar */}
          <footer className="min-h-[2.75rem] py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] flex items-center justify-between px-5 border-t border-outline-variant/5 shrink-0 bg-surface-container-lowest relative z-40 text-on-surface-variant/40">
            <button
              onClick={() => setShowComments((prev) => !prev)}
              className={`p-1.5 hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer rounded-lg flex items-center gap-2 ${showComments ? "bg-primary/10 text-primary" : ""}`}
              title="Toggle Comments"
            >
              <span className="material-symbols-outlined text-[1.1rem]!">
                chat
              </span>
            </button>
            <span className="text-[11px] font-medium opacity-50">
              {currentTaskDetails?.createdAt
                ? `Created ${new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(currentTaskDetails.createdAt))}`
                : ""}
            </span>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
