import TimerTaskItem from "./TimerTaskItem";
import Timer from "./Timer";
import { Plus } from "lucide-react";
import {
  usePomodoroTasks,
  useCreatePomodoroTask,
  useUpdatePomodoroTask,
  useDeletePomodoroTask,
} from "@/hooks/useTimer";
import useTimerControls from "@/hooks/useTimerControls";
import CreateDialog from "@/components/CreateDialog";
import SessionEndDialog from "@/components/SessionEndDialog";
import useNotifications from "./notifications";
import { useUIStore } from "@/store/uiStore";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import logger from "@/lib/logger";

export default function TimerList() {
  const { data: tasks, isLoading: isLoadingTasks } = usePomodoroTasks();
  const { mutateAsync: createPomodoroTask } = useCreatePomodoroTask();
  const { mutateAsync: updatePomodoroTask } = useUpdatePomodoroTask();
  const { mutateAsync: deletePomodoroTask } = useDeletePomodoroTask();
  const { t } = useTranslation();

  const isCreateTaskOpen = useUIStore((s) => s.isCreateTaskOpen);
  const setIsCreateTaskOpen = useUIStore((s) => s.setIsCreateTaskOpen);
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const manualActiveTask = useUIStore((s) => s.manualActiveTask);
  const setManualActiveTask = useUIStore((s) => s.setManualActiveTask);
  const pendingSwitchTask = useUIStore((s) => s.pendingSwitchTask);
  const setPendingSwitchTask = useUIStore((s) => s.setPendingSwitchTask);
  const switchDialogOpen = useUIStore((s) => s.switchDialogOpen);
  const setSwitchDialogOpen = useUIStore((s) => s.setSwitchDialogOpen);

  const timerControls = useTimerControls();
  const { start, pause, resume, reset, complete, isActive, timeLeft, activeSession } =
    timerControls;

  const activeTaskFromSession =
    tasks?.find(
      (t) =>
        String(t.id) === String(activeSession?.pomodoroTaskId) ||
        String(t.id) === String(activeSession?.taskId),
    ) || null;

  const currentActiveTask =
    manualActiveTask !== undefined ? manualActiveTask : activeTaskFromSession;

  const sessionDurationSecs =
    (activeSession?.duration || currentActiveTask?.duration || 25) * 60;
  const elapsedSecs = sessionDurationSecs - timeLeft;

  const startNewTask = () => {
    if (pendingSwitchTask) {
      setManualActiveTask(pendingSwitchTask);
      start(pendingSwitchTask.duration || 25, pendingSwitchTask.id);
      setPendingSwitchTask(null);
    }
  };

  useNotifications(currentActiveTask, timerControls);

  return (
    <div className="flex flex-col h-full gap-8 overflow-hidden">
      <section className="flex flex-col h-full overflow-hidden flex-1">
        <div className="flex items-center justify-between mb-8 px-1 shrink-0">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl font-black tracking-tight text-primary">
              {t("timer.pomodoro")}
            </h1>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveTab("active")}
                className={`text-[10px] px-3 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                  activeTab === "active"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest/40 text-secondary hover:bg-surface-container-highest/60"
                }`}
              >
                {t("timer.active")}
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`text-[10px] px-3 py-1 rounded-full font-bold cursor-pointer transition-colors ${
                  activeTab === "archived"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container-highest/40 text-secondary hover:bg-surface-container-highest/60"
                }`}
              >
                {t("timer.archived")}
              </button>
            </div>
          </div>

          <button
            className="w-7 h-7 rounded-full bg-surface-container-highest/40 text-secondary hover:bg-surface-container-highest/60 flex items-center justify-center cursor-pointer transition-colors"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-0 flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin">
          {(() => {
            const filteredTasks = tasks?.filter((task) =>
              activeTab === "archived" ? task.isArchived : !task.isArchived,
            ) || [];

            if (isLoadingTasks) {
              return (
                <div className="space-y-0">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 px-3 py-2.5 border-b border-b-outline-variant/10"
                    >
                      {/* Play button ghost */}
                      <Skeleton
                        width={28}
                        height={28}
                        borderRadius={999}
                        baseColor="var(--color-surface-container-high)"
                        highlightColor="var(--color-surface-container-highest)"
                      />
                      {/* Task name */}
                      <div className="grow">
                        <Skeleton
                          width={`${55 + (i % 3) * 15}%`}
                          height={12}
                          borderRadius={6}
                          baseColor="var(--color-surface-container-high)"
                          highlightColor="var(--color-surface-container-highest)"
                        />
                      </div>
                      {/* Duration pill */}
                      <Skeleton
                        width={36}
                        height={16}
                        borderRadius={999}
                        baseColor="var(--color-surface-container-high)"
                        highlightColor="var(--color-surface-container-highest)"
                      />
                      {/* Action menu ghost */}
                      <Skeleton
                        width={20}
                        height={20}
                        borderRadius={4}
                        baseColor="var(--color-surface-container-high)"
                        highlightColor="var(--color-surface-container-highest)"
                      />
                    </div>
                  ))}
                </div>
              );
            }

            if (filteredTasks.length === 0) {
              return (
                <div className="text-center py-12 px-4 rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center gap-3 mt-4">
                  <span className="material-symbols-outlined text-3xl opacity-20">
                    {activeTab === "archived" ? "archive" : "timer"}
                  </span>
                  <p className="text-[10px] font-medium text-secondary/40 uppercase tracking-widest">
                    {activeTab === "archived" ? t("timer.noArchivedTasks") : t("timer.noActiveTasks")}
                  </p>
                </div>
              );
            }

            return filteredTasks.map((task) => {
              const isTaskRunning = currentActiveTask?.id === task.id;

              return (
                <TimerTaskItem
                  key={task.id}
                  name={task.title}
                  duration={task.duration}
                  isActive={isTaskRunning && isActive}
                  onDelete={async () => {
                    try {
                      await deletePomodoroTask(String(task.id));
                      if (currentActiveTask?.id === task.id) {
                        setManualActiveTask(null);
                        reset();
                      }
                    } catch (err) {
                      logger.error("Failed to delete pomodoro task", err);
                    }
                  }}
                  onEdit={async (title, duration) => {
                    try {
                      await updatePomodoroTask({
                        id: String(task.id),
                        title,
                        duration,
                      });
                    } catch (err) {
                      logger.error("Failed to update pomodoro task", err);
                    }
                  }}
                  onArchive={
                    activeTab === "archived"
                      ? undefined
                      : async () => {
                          try {
                            await updatePomodoroTask({
                              id: String(task.id),
                              isArchived: true,
                            });
                          } catch (err) {
                            logger.error("Failed to archive pomodoro task", err);
                          }
                        }
                  }
                  isClick={() => {
                    if (currentActiveTask?.id !== task.id) {
                      if (isActive) {
                        setPendingSwitchTask(task);
                        setSwitchDialogOpen(true);
                      } else {
                        setManualActiveTask(task);
                        start(task.duration || 25, task.id);
                      }
                    } else if (!isActive) {
                      resume();
                    } else {
                      pause();
                    }
                  }}
                  taskId={task.id}
                />
              );
            });
          })()}
        </div>
      </section>

      <footer className="mt-auto">
        <Timer
          activeTask={currentActiveTask}
          onClear={() => {
            setManualActiveTask(null);
            reset();
          }}
          timerControls={timerControls}
        />
      </footer>
      <CreateDialog
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onCreateAction={async (title: string, duration?: number) => {
          try {
            await createPomodoroTask({ title, duration });
          } catch (err) {
            logger.error("Failed to create pomodoro task", err);
          }
        }}
        title={t("timer.createTask")}
        inputLabel={t("timer.taskName")}
        inputPlaceholder={t("timer.enterTaskName")}
        showDuration
      />
      <SessionEndDialog
        open={switchDialogOpen}
        onOpenChange={setSwitchDialogOpen}
        elapsedSecs={elapsedSecs}
        onEndAndSave={() => {
          complete();
          startNewTask();
        }}
        onQuit={() => {
          reset();
          startNewTask();
        }}
        switchLabel={pendingSwitchTask?.title}
        onSwitch={() => {
          reset();
          startNewTask();
        }}
      />
    </div>
  );
}
