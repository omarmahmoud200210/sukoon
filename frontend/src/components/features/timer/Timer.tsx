import { ListTodo, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import type { PomodoroTask } from "@/types/timer";
import useTimerControls from "@/hooks/useTimerControls";
import SessionEndDialog from "../../SessionEndDialog";
import { useUIStore } from "@/store/uiStore";

interface TimerProps {
  activeTask: PomodoroTask | null;
  onClear?: () => void;
  timerControls: ReturnType<typeof useTimerControls>;
}

export default function Timer({
  activeTask,
  onClear,
  timerControls,
}: TimerProps) {
  const { start, pause, resume, reset, complete, isActive, timeLeft, mode, sessionCount, activeSession } =
    timerControls;
  const [openDuration, setOpenDuration] = useState(25);
  const { t } = useTranslation();

  const endDialogOpen = useUIStore((s) => s.endDialogOpen);
  const setEndDialogOpen = useUIStore((s) => s.setEndDialogOpen);

  const formatTime = (seconds: number) => {
    const mm = Math.floor(seconds / 60);
    const ss = seconds % 60;
    return `${mm.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
  };

  const getModeLabel = () => {
    switch (mode) {
      case "short_break":
        return t("timer.shortBreak");
      case "long_break":
        return t("timer.longBreak");
      default:
        return activeTask?.title || t("timer.focus");
    }
  };

  const isPaused = timeLeft > 0 && !isActive;
  const isRunning = isActive;
  const isIdle = timeLeft === 0 && !isActive;

  const currentDuration = activeTask?.duration || openDuration;

  const displayTime =
    timeLeft > 0
      ? formatTime(timeLeft)
      : `${currentDuration.toString().padStart(2, "0")}:00`;

  const sessionDurationSecs = (activeSession?.duration || currentDuration) * 60;
  const elapsedSecs = sessionDurationSecs - timeLeft;

  return (
    <motion.div
      layout
      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
      className={`flex items-center justify-between px-8 py-4 rounded-2xl transition-colors duration-300 group ${
        mode === "work" ? "bg-primary text-on-primary" : "bg-tertiary text-on-tertiary"
      }`}
    >
      <div className="flex items-center gap-4 truncate">
        <div className="flex items-center gap-2 truncate">
          <ListTodo className="w-4 h-4 shrink-0" />
          {!activeTask && isIdle ? (
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">{t("timer.focusFor")}</span>
              <input
                type="number"
                min="1"
                max="120"
                value={openDuration}
                onChange={(e) => setOpenDuration(Math.max(1, Number(e.target.value) || 25))}
                className="w-12 bg-on-primary/10 text-center font-bold text-sm rounded-md border-none outline-none focus:ring-2 focus:ring-on-primary/50 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <span className="text-sm font-bold">{t("timer.min")}</span>
            </div>
          ) : (
            <span className="text-sm font-bold truncate">
              {getModeLabel()}
              {mode === "work" && sessionCount > 0 && ` (#${sessionCount + 1})`}
            </span>
          )}
        </div>
        <div className="h-4 w-px bg-on-primary/20 shrink-0" />
        <span className="text-xl font-bold tabular-nums">{displayTime}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <AnimatePresence mode="popLayout">
          {isIdle && (
            <motion.button
              key="start-btn"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-on-primary text-primary flex items-center justify-center cursor-pointer shrink-0"
              onClick={() => {
                start(currentDuration, activeTask?.id);
              }}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_arrow
              </span>
            </motion.button>
          )}

          {isRunning && (
            <motion.button
              key="pause-btn"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-full bg-on-primary text-primary flex items-center justify-center cursor-pointer shrink-0"
              onClick={pause}
            >
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                pause
              </span>
            </motion.button>
          )}

          {isPaused && (
            <motion.div
              key="paused-controls"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-on-primary text-primary flex items-center justify-center cursor-pointer shrink-0"
                onClick={resume}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-full bg-on-primary/20 text-on-primary flex items-center justify-center cursor-pointer shrink-0"
                onClick={() => setEndDialogOpen(true)}
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  restart_alt
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTask && (
          <button
            onClick={onClear}
            className="p-1.5 hover:bg-on-primary/10 rounded-full transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
            title={t("common.clear")}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <SessionEndDialog
        open={endDialogOpen}
        onOpenChange={setEndDialogOpen}
        onEndAndSave={complete}
        onQuit={reset}
        elapsedSecs={elapsedSecs}
        sessionMode={mode}
      />
    </motion.div>
  );
}
