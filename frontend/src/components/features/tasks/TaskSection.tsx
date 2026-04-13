import { useState, useEffect } from "react";
import TaskItem from "./TaskItem";
import { Virtuoso } from "react-virtuoso";
import { useTranslation } from "react-i18next";
import type { TaskSection as TaskSectionType } from "@/types/tasks";
import { useTasks } from "@/hooks/useTasks";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { listContainer, listItem, getReducedVariants } from "@/lib/animations";

interface TaskSectionProps {
  taskSection: TaskSectionType;
  overdueIds: Set<string>;
}

export default function TaskSection({ taskSection, overdueIds }: TaskSectionProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(
    taskSection.defaultExpanded || false,
  );
  const { hasNextPage = false } = useTasks();
  const shouldReduce = useReducedMotion();
  const container = getReducedVariants(shouldReduce, listContainer);
  const item = getReducedVariants(shouldReduce, listItem);
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setScrollParent(document.getElementById("dashboard-scroll"));
    }, 0);
    return () => clearTimeout(timer);
  }, []);
  const USE_VIRTUALIZATION_THRESHOLD = 30;
  const isHugeList = taskSection.tasks.length > USE_VIRTUALIZATION_THRESHOLD;



  if (taskSection.tasks.length === 0 && !taskSection.isCompleted) return null;

  if (taskSection.tasks.length === 0 && taskSection.isCompleted) {
    return (
      <div className="mb-4 last:mb-0">
        <div
          className="flex items-center gap-2.5 mb-2 cursor-pointer group w-fit transition-all ps-1"
          onClick={() => setIsExpanded(!isExpanded)}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsExpanded(!isExpanded); } }}
          role="button"
          tabIndex={0}
          aria-label={`${isExpanded ? t("common.collapse") : t("common.expand")} ${taskSection.title}`}
          aria-expanded={isExpanded}
        >
          <span
            className={`material-symbols-outlined text-[18px]! text-on-surface-variant/20 transition-transform duration-500 ease-in-out group-hover:text-primary rtl:-scale-x-100 ${
              isExpanded ? "rotate-90" : ""
            }`}
            aria-hidden="true"
          >
            chevron_right
          </span>
          <h2 className="text-[0.6rem] font-extrabold text-on-surface-variant/30 tracking- uppercase font-label group-hover:text-primary transition-colors">
            {taskSection.title}
            <span className="ms-2 opacity-20 font-normal">
              {taskSection.count}
            </span>
          </h2>
        </div>

      </div>
    );
  }

  return (
    <div className="mb-4 last:mb-0">
      <div
        className="flex items-center gap-2.5 mb-2 cursor-pointer group w-fit transition-all ps-1"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setIsExpanded(!isExpanded); } }}
        role="button"
        tabIndex={0}
        aria-label={`${isExpanded ? t("common.collapse") : t("common.expand")} ${taskSection.title}`}
        aria-expanded={isExpanded}
      >
        <span
          className={`material-symbols-outlined text-[18px]! text-on-surface-variant/20 transition-transform duration-500 ease-in-out group-hover:text-primary rtl:-scale-x-100 ${
            isExpanded ? "rotate-90" : ""
          }`}
          aria-hidden="true"
        >
          chevron_right
        </span>
        <h2 className="text-[0.6rem] font-extrabold text-on-surface-variant/30 tracking- uppercase font-label group-hover:text-primary transition-colors">
          {taskSection.title}
          <span className="ms-2 opacity-20 font-normal">
            {taskSection.count}
          </span>
        </h2>
      </div>

      {isExpanded && (
        <div className="pt-0">
          {isHugeList && scrollParent ? (
             <Virtuoso
               useWindowScroll
               customScrollParent={scrollParent}
               data={taskSection.tasks}
               itemContent={(_, task) => (
                  <TaskItem
                    task={task}
                    isTrashMode={taskSection.mode === "trash"}
                    isOverdue={overdueIds.has(task.id)}
                  />
               )}
             />
          ) : (
            <AnimatePresence>
              <motion.div
                variants={container}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {taskSection.tasks.map((task) => (
                  <motion.div key={task.id} variants={item}>
                    <TaskItem
                      task={task}
                      isTrashMode={taskSection.mode === "trash"}
                      isOverdue={overdueIds.has(task.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      )}

      {isExpanded && taskSection.isCompleted && hasNextPage && (
        <button
          className="mt-4 text-xs font-semibold text-primary/60 hover:text-primary hover:underline ps-6 cursor-pointer flex items-center gap-1.5"
          onClick={taskSection.handleLoadMore}
        >
          <span className="material-symbols-outlined text-[14px]">
            expand_more
          </span>
          <span>{t("common.view_more")}</span>
        </button>
      )}
    </div>
  );
}
