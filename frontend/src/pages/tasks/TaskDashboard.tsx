import { TaskBoard, TaskForm, TaskList } from "@/components/features/tasks";
import { DailyQuranAya } from "@/components/features/quranAya/DailyQuranAya";
import TafreeghModal from "@/components/features/tafreegh/TafreeghModal";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  pageVariants,
  headerVariants,
  fadeVariants,
  getReducedVariants,
} from "@/lib/animations";
import { useUIStore } from "@/store/uiStore";

export default function TaskDashboard() {
  const { t } = useTranslation();
  const [isTafreeghOpen, setIsTafreeghOpen] = useState(false);
  const shouldReduce = useReducedMotion();
  const setIsMobileSidebarOpen = useUIStore((state) => state.setIsMobileSidebarOpen);

  const page = getReducedVariants(shouldReduce, pageVariants);
  const header = getReducedVariants(shouldReduce, headerVariants);
  const fade = getReducedVariants(shouldReduce, fadeVariants);

  return (
    <TaskBoard>
      {({
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
      }) => (
        <motion.main
          variants={page}
          initial="initial"
          animate="animate"
          exit="exit"
          className={`flex-1 flex flex-col bg-background min-w-0 md:min-w-[360px] transition-colors duration-500 overflow-hidden`}
        >
          <motion.header
            variants={header}
            initial="initial"
            animate="animate"
            className={`h-20 flex items-center justify-between px-4 md:px-8 relative z-10 bg-background/50 backdrop-blur-md border-b border-outline-variant/10`}
          >
            <div className="flex items-center gap-2 md:gap-4 overflow-hidden w-full">
              <button
                title="Menu"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-surface-container-high transition-colors"
                >
                <span className="material-symbols-outlined text-[24px]!">menu</span>
              </button>
              <h1 className="text-xl md:text-3xl font-display font-semibold truncate text-on-surface flex-1">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-2 md:gap-6 text-on-surface-variant/30 shrink-0">
              <div className="w-px h-6 bg-outline-variant/20 mx-1 hidden sm:block"></div>
              <button
                title={t("common.tafreegh") || "Tafreegh"}
                onClick={() => setIsTafreeghOpen(true)}
                className="cursor-pointer h-10 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-on-primary flex items-center gap-2 font-label text-xs font-bold tracking-wider transition-all duration-300 editorial-shadow group"
              >
                <span className="material-symbols-outlined text-[18px]! transition-transform group-hover:scale-110">
                  edit_note
                </span>
                <span className="hidden sm:inline-block">
                  {t("common.tafreegh")}
                </span>
              </button>
            </div>
          </motion.header>

          <div id="dashboard-scroll" className="flex-1 overflow-y-auto px-4 md:px-8 py-6 custom-scrollbar">
            <DailyQuranAya />

            {filter !== "trash" && (
              <div className="mb-8 max-w-xl">
                <TaskForm
                  onSubmit={handleAddTask}
                  placeholder={placeholder}
                />
              </div>
            )}

            <div className="max-w-3xl space-y-10 pb-16 min-h-[50vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${filter}-${currentListId || ""}-${currentTagId || ""}`}
                  variants={fade}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <TaskList
                    filter={filter}
                    tasks={tasks}
                    trashTasks={trashTasks}
                    todayTasks={todayTasks}
                    upcomingTasks={upcomingTasks}
                    isLoading={isLoading}
                    hasNextPage={hasNextPage}
                    currentListId={currentListId}
                    currentTagId={currentTagId}
                    onLoadMore={handleLoadMore}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div
            className="fixed inset-0 pointer-events-none opacity-[0.015] z-[-1]"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuA29gfJ23WCKoVnIhKwTtUyV6oEsNY6b5Ic3Ccmu4iULMTH3n7FqtBHC-XTPHvJzmJkdhbM57xkN5kuOoptNHOH4fjQ7-WOStASNO6-qBq_diE8BWuDE8UaMAmlkxp5IgzeGlStl_dibPGR-sdOATagEGI8eITiWuN-GE953Diz3KIO4y1LV3lYfPX95op1O8LHBIwcnAf9TSMq-fEH4R2v1Qz5uRDcJsqGJYwrIudZi3jhaMmgmYy2Pr-57YwEMMvBsMvSmYgwYKwK")`,
            }}
          />

          <TafreeghModal
            isOpen={isTafreeghOpen}
            onClose={() => setIsTafreeghOpen(false)}
          />
        </motion.main>
      )}
    </TaskBoard>
  );
}
