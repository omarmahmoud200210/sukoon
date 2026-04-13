import { useDeletePomdoroSession, usePomodoroHistory } from "@/hooks/useTimer";
import { formatDuration, formatDateLabel, formatTimeRange } from "@/lib/utils";
import type { PomodoroHistory } from "@/types/timer";
import { Trash } from "lucide-react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function FocusRecord() {
  const { data: history, isLoading } = usePomodoroHistory();
  const { mutateAsync: deletePomodoroSession } = useDeletePomdoroSession();
  const { t, i18n } = useTranslation();
  const locale = i18n.language === "ar" ? "ar-SA" : "en-US";

  const hasAnySessions =
    history && history.some((task: PomodoroHistory) => task.pomodoroSessions.length > 0);
  
  if (isLoading) {
    return (
      <section className="space-y-6">
        <div className="h-4 w-20 mb-6 ml-1">
          <Skeleton
            height={12}
            width={80}
            borderRadius={6}
            baseColor="var(--color-surface-container-high)"
            highlightColor="var(--color-surface-container-highest)"
          />
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <div className="ml-1">
              <Skeleton
                height={10}
                width={120}
                borderRadius={4}
                baseColor="var(--color-surface-container-high)"
                highlightColor="var(--color-surface-container-highest)"
              />
            </div>
            <div className="border-l border-outline-variant/10 ml-1 pl-4 space-y-2">
              {[1, 2].map((j) => (
                <div key={j} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-outline-variant/5 bg-surface-container-lowest/50">
                  <div className="flex flex-col gap-1.5">
                    <Skeleton
                      height={10}
                      width={80}
                      borderRadius={4}
                      baseColor="var(--color-surface-container-high)"
                      highlightColor="var(--color-surface-container-highest)"
                    />
                    <Skeleton
                      height={8}
                      width={60}
                      borderRadius={4}
                      baseColor="var(--color-surface-container-high)"
                      highlightColor="var(--color-surface-container-highest)"
                    />
                  </div>
                  <Skeleton
                    height={18}
                    width={40}
                    borderRadius={999}
                    baseColor="var(--color-surface-container-high)"
                    highlightColor="var(--color-surface-container-highest)"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full overflow-hidden">
      <div className="flex justify-between items-center mb-4 px-1 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-secondary/50">
          {t("timer.history")}
        </h2>
      </div>

      <div className="space-y-8 flex-1 overflow-y-auto pr-2 pb-4 scrollbar-thin">
        {hasAnySessions ? (
          history.map((task: PomodoroHistory) => (
            <div key={task.id} className="group">
              {task.pomodoroSessions.length > 0 && (
                <>
                  <div className="mb-3 px-1 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-secondary/60 uppercase tracking-tight">
                        {task.id === "open-sessions" ? t("timer.openSessions") : task.title}
                      </span>
                      {task.id === "open-sessions" && (
                        <span className="text-[8px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-secondary/10 text-secondary/40">
                          {t("timer.noTask")}
                        </span>
                      )}
                    </div>
                    <span className="text-[9px] font-medium text-secondary/30">
                      {task.pomodoroSessions.length} {t("timer.sessions")}
                    </span>
                  </div>

                  <div className="space-y-2 border-l ml-1 pl-4 border-outline-variant/20 hover:border-primary/30 transition-colors">
                    {task.pomodoroSessions.map((session, sessionIndex) => (
                      <div
                        key={sessionIndex}
                        className="flex flex-col gap-1 py-2.5 px-3 rounded-lg transition-all border border-outline-variant/5 bg-surface-container-lowest/50 hover:bg-surface-container-low hover:border-outline-variant/20 group/session relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-secondary/40 uppercase">
                            {formatDateLabel(new Date(session.startedAt), locale)}
                          </span>
                          <span className="text-[10px] font-bold text-primary">
                            {formatDuration(session.duration)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-secondary/50">
                            {formatTimeRange(
                              session.startedAt,
                              session.endedAt,
                              locale,
                            )}
                          </span>
                          <button
                            className="flex items-center gap-1.5 px-2 py-1 -mr-1.5 -my-1 rounded-md text-error/30 hover:text-error hover:bg-error/10 opacity-0 group-hover/session:opacity-100 transition-all cursor-pointer shadow-none"
                            title={t("timer.deleteSession")}
                            onClick={() =>
                              deletePomodoroSession(String(session.id))
                            }
                          >
                            <Trash size={11} strokeWidth={2.5} />
                            <span className="text-[9px] font-bold uppercase tracking-wider">
                              {t("timer.delete")}
                            </span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 px-4 rounded-xl border border-dashed border-outline-variant/30 flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-3xl opacity-20">
              history
            </span>
            <p className="text-[10px] font-medium text-secondary/40 uppercase tracking-widest">
              {t("timer.noFocusSessions")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
