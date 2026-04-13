import TimerActionMenu from "@/components/TimerActionMenu";
import { formatDuration } from "@/lib/utils";
import { useTaskStatistics } from "@/hooks/useTimer";
import { useTranslation } from "react-i18next";

interface TimerTaskItemProps {
  name: string;
  duration: number;
  isActive?: boolean;
  onDelete?: () => void;
  onEdit?: (title: string, duration: number) => void;
  onArchive?: () => void;
  isClick?: () => void;
  taskId: number | string;
}

export default function TimerTaskItem({
  name,
  duration,
  isActive = false,
  onDelete,
  onEdit,
  onArchive,
  isClick,
  taskId,
}: TimerTaskItemProps) {
  const { data: taskStatistics } = useTaskStatistics(String(taskId));
  const timeLeft = formatDuration(taskStatistics?.today.duration || 0);
  const { t } = useTranslation();

  return (
    <>
      {isActive ? (
        <div className="flex items-center w-full max-w-[800px] mx-auto bg-primary/5 border-b border-b-outline-variant/10 border-l-4 border-l-primary px-3 py-2.5 relative overflow-hidden group cursor-pointer transition-all">
          <button
            className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary hover:scale-105 transition-transform shrink-0 z-10 cursor-pointer"
            onClick={isClick}
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              pause
            </span>
          </button>
          <div className="grow px-4 text-xs font-bold text-primary z-10 truncate">
            {name}
          </div>
          <div className="flex items-center gap-2 shrink-0 z-10">
            <span className="text-[9px] font-bold text-primary animate-pulse tracking-widest uppercase">
              {t("timer.active")}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <div className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              {timeLeft}
            </div>
            <TimerActionMenu
              name={name}
              duration={duration}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          </div>
        </div>
      ) : (
        <div className="flex items-center w-full max-w-[800px] mx-auto bg-transparent border-b border-b-outline-variant/10 hover:bg-surface-container-lowest px-3 py-2.5 group cursor-pointer transition-all">
          <button
            className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-primary hover:scale-105 transition-transform shrink-0 cursor-pointer"
            onClick={isClick}
          >
            <span
              className="material-symbols-outlined text-base"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </button>
          <div className="grow px-4 text-xs font-bold text-on-surface truncate">
            {name}
          </div>
          <div className="text-[9px] font-bold text-secondary/50 bg-surface-container px-2 py-0.5 rounded-full shrink-0">
            {timeLeft}
          </div>
          <TimerActionMenu
            name={name}
            duration={duration}
            onDelete={onDelete}
            onEdit={onEdit}
            onArchive={onArchive}
          />
        </div>
      )}
    </>
  );
}
